'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { use } from 'react';

export default function PostClient({ params }) {
  const resolvedParams = use(params);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/posts/slug/${resolvedParams.id}`);
        const data = await response.json();
        
        if (data.success) {
          setPost(data.post);
          
          // Fetch related posts by category
          if (data.post.categoryId) {
            const relatedResponse = await fetch(`/api/categories/${data.post.categoryId}/posts`);
            if (relatedResponse.ok) {
              const relatedData = await relatedResponse.json();
              // Filter out current post and limit to 6 posts
              const filtered = relatedData.filter(p => p._id !== data.post._id).slice(0, 6);
              setRelatedPosts(filtered);
              
              // Get first 5 as featured posts for sidebar
              setFeaturedPosts(filtered.slice(0, 5));
            }
          }
        } else {
          console.error('Post not found');
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data.categories || data || []);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    if (resolvedParams.id) {
      fetchPost();
      fetchCategories();
    }
  }, [resolvedParams.id]);

  const getMainImage = (post) => {
    if (post?.section1_images && post.section1_images.length > 0) {
      const mainImage = post.section1_images.find(img => img.main_image_url);
      if (mainImage) return mainImage.main_image_url;
      return post.section1_images[0].imageUrl;
    }
    return post?.thumbnail || '/placeholder-image.jpg';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading post...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="text-6xl mb-4">😕</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Post Not Found</h1>
            <p className="text-gray-600 mb-8">
              The post you're looking for doesn't exist or has been removed.
            </p>
            <Link
              href="/gallery"
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Back to Gallery
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mainbg ">
      <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-red-50 via-white to-orange-50 ">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-red-600">Home</Link>
            <span>/</span>
            <Link href="/gallery" className="hover:text-red-600">Gallery</Link>
            <span>/</span>
            <span className="text-gray-900">{post.title}</span>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Post Title */}
            <div className="text-left mb-8">
              <div className="flex items-start justify-start gap-3 mb-4">
                {post.category && (
                  <span className="bg-red-600 text-white text-sm px-3 py-1 rounded-full font-medium">
                    {post.category.name}
                  </span>
                )}
                <span className="text-sm text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {post.title}
              </h1>
              
              {post.description && (
                <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
                  {post.description}
                </p>
              )}
            </div>

            {/* Section 1: Drawing Steps */}
            {post.section1_images && post.section1_images.length > 0 && (
              <div className="mb-8 w-full">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Drawing Steps</h2>
                
                <div className=" w-full">
                  {post.section1_images.map((image, index) => (
                    <div key={index} className="flex justify-center">
                      <div className="bg-white p-6 shadow-sm w-full 2xl:max-w-4xl max-w-3xl">
                        {/* Main Drawing Image with border */}
                        {image.main_image_url && (
                          <div className="relative rounded-sm overflow-hidden border-2 border-gray-300 mb-4">
                            <Image
                              src={image.main_image_url}
                              alt={image.title || `Step ${index + 1}`}
                              width={400}
                              height={400}
                              className="object-contain bg-white w-full h-auto"
                            />
                          </div>
                        )}
                        
                        {/* Image Title */}
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                          {image.title || "Coloring Page"}
                        </h3>
                        
                        {/* Download Buttons */}
                        <div className="flex gap-2 flex-col justify-between items-center">
                          {image.pdfUrl && (
                            <button
                              onClick={() => window.open(image.pdfUrl, '_blank')}
                              className="flex-1 px-10 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors font-medium text-sm"
                            >
                              Print
                            </button>
                          )}
                          
                          {image.imageUrl && (
                            <a
                              href={image.imageUrl}
                              download
                              className="flex-1 px-10 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors font-medium text-sm text-center"
                            >
                              Download
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Download Bundles */}
            <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* 5x5 Download */}
                {post.download_5_file && (
                  <a
                    href={post.download_5_file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group"
                  >
                    <div className="bg-blue-600 text-white p-3 rounded-lg mb-3">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h4 className="font-medium text-gray-900">Download 5x5</h4>
                  </a>
                )}

                {/* 10x10 Download */}
                {post.download_10_file && (
                  <a
                    href={post.download_10_file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors group"
                  >
                    <div className="bg-green-600 text-white p-3 rounded-lg mb-3">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h4 className="font-medium text-gray-900">Download 10x10</h4>
                  </a>
                )}

                {/* 15x15 Download */}
                {post.download_15_file && (
                  <a
                    href={post.download_15_file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors group"
                  >
                    <div className="bg-purple-600 text-white p-3 rounded-lg mb-3">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h4 className="font-medium text-gray-900">Download 15x15</h4>
                  </a>
                )}
              </div>
            </div>

            {/* Section 2: Additional Resources */}
            {post.section2_images && post.section2_images.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  {post.section2_title || "Additional Resources"}
                </h2>
                
                <div className=" w-full">
                  {post.section2_images.map((image, index) => (
                    <div key={index} className="flex justify-center">
                      <div className="bg-white p-6 shadow-sm w-full 2xl:max-w-4xl max-w-3xl ">
                        {/* Image with border */}
                        {image.imageUrl && (
                          <div className="relative rounded-sm overflow-hidden border-2 border-gray-300 mb-4">
                            <Image
                              src={image.imageUrl}
                              alt={image.title || `Resource ${index + 1}`}
                              width={400}
                              height={400}
                              className="object-contain bg-white w-full h-auto"
                            />
                          </div>
                        )}
                        
                        {/* Title */}
                        {image.title && (
                          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-left">
                            {image.title}
                          </h3>
                        )}
                        
                        {/* Description */}
                        {image.description && (
                          <p className="text-gray-600 leading-relaxed text-left">
                            {image.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
             {/* Main Download URL */}
             {post.download_link && (
                <a
                  href={post.download_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-3 w-full p-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="font-medium">Download Step By Step Guide</span>
                </a>
              )}
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  Related Posts in {post.category?.name}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedPosts.map((relatedPost) => (
                    <Link
                      key={relatedPost._id}
                      href={`/post/${relatedPost.url_slug}`}
                      className="group bg-gray-50 rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
                    >
                      <div className="relative aspect-square overflow-hidden">
                        <Image
                          src={getMainImage(relatedPost)}
                          alt={relatedPost.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-center text-gray-900 text-sm line-clamp-2 group-hover:text-red-600 transition-colors">
                          {relatedPost.title}
                        </h3>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Featured Posts */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Featured Posts */}
              {featuredPosts.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Featured in {post.category?.name}
                  </h3>
                  
                  <div className="space-y-4">
                    {featuredPosts.map((featuredPost) => (
                      <Link
                        key={featuredPost._id}
                        href={`/post/${featuredPost.url_slug}`}
                        className="group flex space-x-3 hover:bg-gray-50 p-2 rounded-lg transition-colors"
                      >
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={getMainImage(featuredPost)}
                            alt={featuredPost.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-red-600 transition-colors">
                            {featuredPost.title}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(featuredPost.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Categories Section */}
              {categories.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Browse Categories
                  </h3>
                  
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <Link
                        key={category._id}
                        href={`/gallery?category=${category._id}`}
                        className="group flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                          <span className="text-sm font-medium text-gray-900 group-hover:text-red-600 transition-colors">
                            {category.name}
                          </span>
                        </div>
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    ))}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <Link
                      href="/gallery"
                      className="block text-center text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      View All Categories →
                    </Link>
                  </div>
                </div>
              )}

              {/* YouTube CTA */}
              <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-xl p-6 text-white">
                <h3 className="text-lg font-bold mb-2">Watch Tutorial</h3>
                <p className="text-sm mb-4 opacity-90">
                  Learn step-by-step on our YouTube channel!
                </p>
                <a
                  href="https://youtube.com/@Drawing-Gallery"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-white text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors text-sm w-full justify-center"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  <span>Subscribe Now</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}