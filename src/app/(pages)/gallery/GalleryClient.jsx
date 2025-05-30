'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function GalleryClient() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const searchParams = useSearchParams();

  // Get search query from URL parameters
  useEffect(() => {
    const urlSearchQuery = searchParams.get('search');
    const urlCategory = searchParams.get('category');
    
    if (urlSearchQuery) {
      setSearchQuery(urlSearchQuery);
    }
    
    if (urlCategory) {
      setSelectedCategory(urlCategory);
    }
  }, [searchParams]);

  // Fetch posts and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch posts with categories
        const postsResponse = await fetch('/api/posts');
        const postsData = await postsResponse.json();
        
        // Fetch categories
        const categoriesResponse = await fetch('/api/categories');
        const categoriesData = await categoriesResponse.json();
        
        setPosts(postsData.posts || []);
        setCategories(categoriesData.categories || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter and sort posts
  useEffect(() => {
    let filtered = [...posts];

    // Filter by search query - prioritize tags search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(post => {
        // Primary search: tags
        const tagsMatch = post.tags?.some(tag => tag.toLowerCase().includes(query));
        
        // Secondary search: other fields
        const titleMatch = post.title?.toLowerCase().includes(query);
        const descriptionMatch = post.description?.toLowerCase().includes(query);
        const categoryMatch = post.category?.name?.toLowerCase().includes(query);
        
        // Prioritize posts with tag matches
        return tagsMatch || titleMatch || descriptionMatch || categoryMatch;
      });
      
      // Sort by relevance: tag matches first
      filtered.sort((a, b) => {
        const aTagMatch = a.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()));
        const bTagMatch = b.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()));
        
        if (aTagMatch && !bTagMatch) return -1;
        if (!aTagMatch && bTagMatch) return 1;
        return 0;
      });
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.categoryId === selectedCategory);
    }

    // Sort posts (after relevance sorting for search)
    if (!searchQuery.trim()) {
      filtered.sort((a, b) => {
        if (sortBy === 'newest') {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateB - dateA;
        } else if (sortBy === 'oldest') {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateA - dateB;
        } else if (sortBy === 'a-z') {
          return a.title.localeCompare(b.title);
        } else if (sortBy === 'z-a') {
          return b.title.localeCompare(a.title);
        }
        return 0;
      });
    }

    setFilteredPosts(filtered);
  }, [posts, selectedCategory, sortBy, searchQuery]);

  const clearSearch = () => {
    setSearchQuery('');
    // Update URL without search parameter
    window.history.replaceState({}, '', '/gallery');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading gallery...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mainbg ">
      <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-red-50 via-white to-orange-50">
        {/* Search Results Banner */}
        {searchQuery && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="text-blue-800">
                  Search results for: <strong>"{searchQuery}"</strong>
                </span>
              </div>
              <button
                onClick={clearSearch}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Clear search
              </button>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex items-center justify-end gap-2 mb-8">
          {/* Category Filter */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Filter:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort and Results */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="a-z">A-Z</option>
                <option value="z-a">Z-A</option>
              </select>
            </div>
            
            <div className="text-sm text-gray-600">
              {filteredPosts.length} {filteredPosts.length === 1 ? 'item' : 'items'}
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">
              {searchQuery ? "🔍" : "🎨"}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {searchQuery ? "No search results found" : "No posts found"}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery 
                ? `No drawings match "${searchQuery}". Try different keywords or browse all categories.`
                : "Try adjusting your filters or check back later for new content."
              }
            </p>
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Clear search and browse all
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredPosts.map((post) => (
              <Link
                key={post._id}
                href={`/post/${post.url_slug}`}
                className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white rounded-full p-3">
                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Category Badge */}
                  {post.category && (
                    <div className="absolute top-2 left-2">
                      <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                        {post.category.name}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-center text-gray-900 text-sm line-clamp-2 group-hover:text-red-600 transition-colors">
                    {post.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* YouTube Channel CTA */}
        {filteredPosts.length > 0 && (
          <div className="text-center mt-12">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <p className="text-gray-600 mb-4">
                Want to see more amazing coloring pages and tutorials?
              </p>
              <a
                href="https://youtube.com/@Drawing-Gallery"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                <span>Subscribe to Our YouTube Channel</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}