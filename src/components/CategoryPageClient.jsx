"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";

export default function CategoryPageClient({ category, initialPage = 1 }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: initialPage,
    totalPages: 1,
    totalPosts: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 20
  });
  const router = useRouter();

  // Fetch posts for the category
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/categories/${category._id}/posts?page=${pagination.currentPage}&limit=${pagination.limit}`);
        
        if (response.ok) {
          const data = await response.json();
          setPosts(data.posts || []);
          setPagination(data.pagination || pagination);
        } else {
          console.error('Failed to fetch posts');
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    if (category?._id) {
      fetchPosts();
    }
  }, [category, pagination.currentPage]);

  // Handle pagination
  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
    // Update URL without navigating - keep current pathname
    // Use requestAnimationFrame to avoid forced reflow during DOM manipulation
    requestAnimationFrame(() => {
      const url = new URL(window.location);
      url.searchParams.set('page', newPage.toString());
      window.history.pushState({}, '', url);
    });
  };

  // Helper function to get main image
  const getMainImage = (post) => {
    if (post.featuredImage) return post.featuredImage;
    if (post.section1_images && post.section1_images.length > 0) {
      return post.section1_images[0].main_image_url || post.section1_images[0].imageUrl;
    }
    if (post.section2_images && post.section2_images.length > 0) {
      return post.section2_images[0].imageUrl;
    }
    return '/images/placeholder.jpg';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Category Header */}
        <div className="text-center mb-12">
          {category.thumbnail && (
            <div className="relative w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden shadow-lg">
              <Image
                src={category.thumbnail}
                alt={category.name}
                fill
                className="object-cover"
              />
            </div>
          )}
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {category.name}
          </h1>
          
          {category.short_description && (
            <div className="max-w-5xl mx-auto">
              <div className="text-lg text-gray-600 leading-relaxed prose prose-lg mx-auto">
                <ReactMarkdown>
                  {category.short_description}
                </ReactMarkdown>
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-center mt-6 space-x-6 text-gray-500">
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {pagination.totalPosts} Coloring Pages
            </span>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
          </div>
        )}

        {/* Posts Grid */}
        {!loading && posts.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-12">
              {posts.map((post) => (
                <Link
                  key={post._id}
                  href={`/${post.url_slug}`}
                  className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={getMainImage(post)}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  
                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-center text-gray-900 text-sm line-clamp-2 group-hover:text-red-600 transition-colors">
                      {post.title}
                    </h3>
                    
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2 justify-center">
                        {post.tags.slice(0, 2).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-12">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                
                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const page = i + 1;
                    const isActive = page === pagination.currentPage;
                    
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-red-600 text-white'
                            : 'bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* No Posts State */}
        {!loading && posts.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎨</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Coloring Pages Yet</h2>
            <p className="text-gray-600 mb-8">We're working on adding amazing coloring pages to this category.</p>
            <Link
              href="/gallery"
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Browse All Categories
            </Link>
          </div>
        )}

        {/* Long Description */}
        {category.long_description && (
          <div className="mt-16 bg-white rounded-xl p-8 shadow-lg">
            <div className="max-w-full mx-auto">
              <div className="prose prose-lg max-w-none">
                <ReactMarkdown>
                  {category.long_description}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}