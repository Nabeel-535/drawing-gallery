"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function CategoriesClient() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryPosts, setCategoryPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);
  
  const searchParams = useSearchParams();

  // Fetch all categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/categories");
        const data = await response.json();
        setCategories(data.categories || data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Handle category selection from URL parameter
  useEffect(() => {
    const categoryId = searchParams.get("category");
    if (categoryId && categories.length > 0) {
      const category = categories.find(cat => cat._id === categoryId);
      if (category) {
        handleCategorySelect(category);
      }
    }
  }, [searchParams, categories]);

  // Fetch posts for selected category
  const handleCategorySelect = async (category) => {
    try {
      setPostsLoading(true);
      setSelectedCategory(category);
      
      const response = await fetch(`/api/categories/${category._id}/posts`);
      if (response.ok) {
        const posts = await response.json();
        setCategoryPosts(posts);
      }
      
      // Update URL without page reload
      window.history.pushState({}, '', `/categories?category=${category._id}`);
    } catch (error) {
      console.error("Error fetching category posts:", error);
    } finally {
      setPostsLoading(false);
    }
  };

  const clearSelection = () => {
    setSelectedCategory(null);
    setCategoryPosts([]);
    window.history.pushState({}, '', '/categories');
  };

  const getMainImage = (post) => {
    return post.featuredImage || "/placeholder-image.jpg";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading categories...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mainbg">
      <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-red-50 via-white to-orange-50">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              Browse Categories
            </span>
          </h1>
        </div>

        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-red-600">Home</Link>
            <span>/</span>
            <span className="text-gray-900">Categories</span>
            {selectedCategory && (
              <>
                <span>/</span>
                <span className="text-gray-900">{selectedCategory.name}</span>
              </>
            )}
          </div>
        </nav>

        {!selectedCategory ? (
          /* Categories Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <button
                key={category._id}
                onClick={() => handleCategorySelect(category)}
                className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 text-left"
              >
                {/* Category Thumbnail */}
                <div className="relative aspect-square overflow-hidden">
                  {category.thumbnail ? (
                    <Image
                      src={category.thumbnail}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                      <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Category Info */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-red-600 transition-colors mb-2 text-center">
                    {category.name}
                  </h3>
                  
                  {category.description && (
                    <p className="text-gray-600 text-sm line-clamp-2 text-center">
                      {category.description}
                    </p>
                  )}
                  
                  <div className="mt-3 text-center">
                    <span className="text-xs text-gray-500">
                      Click to explore
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          /* Selected Category Posts */
          <div>
            {/* Category Header */}
            <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedCategory.name}</h2>
                    {selectedCategory.description && (
                      <p className="text-gray-600 mt-1">{selectedCategory.description}</p>
                    )}
                    <p className="text-sm text-gray-500 mt-2">
                      {categoryPosts.length} {categoryPosts.length === 1 ? 'post' : 'posts'} found
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={clearSelection}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span>Back to Categories</span>
                </button>
              </div>
            </div>

            {/* Posts Grid */}
            {postsLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading posts...</p>
              </div>
            ) : categoryPosts.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No Posts Found</h3>
                <p className="text-gray-600 mb-4">
                  This category doesn't have any posts yet. Check back later for new content!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {categoryPosts.map((post) => (
                  <Link
                    key={post._id}
                    href={`/post/${post.url_slug}`}
                    className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    {/* Image */}
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src={getMainImage(post)}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                      />
                      
                      {/* Category Badge */}
                      <div className="absolute top-2 left-2">
                        <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                          {selectedCategory.name}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-semibold text-center text-gray-900 text-sm line-clamp-2 group-hover:text-red-600 transition-colors">
                        {post.title}
                      </h3>
                      
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Can't Find What You're Looking For?
            </h3>
            <p className="text-gray-600 mb-6">
              Browse our complete gallery or search for specific drawing tutorials and coloring pages.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/gallery"
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Browse All Posts
              </Link>
              <a
                href="https://youtube.com/@Drawing-Gallery"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                Watch Tutorials
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}