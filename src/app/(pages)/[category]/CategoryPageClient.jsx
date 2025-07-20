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
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [category._id, pagination.currentPage, pagination.limit]);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: newPage }));
      
      // Update URL
      const url = newPage === 1 ? `/${category.custom_url}` : `/${category.custom_url}?page=${newPage}`;
      router.push(url, { scroll: false });
    }
  };

  const getMainImage = (post) => {
    return post.featuredImage || "/placeholder-image.jpg";
  };

  // Generate pagination numbers
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    const current = pagination.currentPage;
    const total = pagination.totalPages;
    
    let start = Math.max(1, current - Math.floor(maxVisible / 2));
    let end = Math.min(total, start + maxVisible - 1);
    
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  return (
    <div className="min-h-screen mainbg">
      <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-red-50 via-white to-orange-50">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              {category.name} Coloring Page
            </span>
          </h1>
          
          {category.short_description && (
            <p className="text-xl text-gray-600 px-10 mx-auto mb-8">
              {category.short_description}
            </p>
          )}
        </div>

        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-red-600">Home</Link>
            <span>/</span>
            <Link href="/categories" className="hover:text-red-600">Categories</Link>
            <span>/</span>
            <span className="text-gray-900">{category.name}</span>
          </div>
        </nav>

        {/* Category Info Card */}
        {/* {category.thumbnail && (
          <div className="bg-white rounded-xl p-6 shadow-lg mb-12">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-32 h-32 relative flex-shrink-0">
                <Image
                  src={category.thumbnail}
                  alt={category.name}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{category.name}</h2>
                {category.short_description && (
                  <p className="text-gray-600 mb-4">{category.short_description}</p>
                )}
                <p className="text-sm text-gray-500">
                  {pagination.totalPosts} {pagination.totalPosts === 1 ? 'post' : 'posts'} available
                </p>
              </div>
            </div>
          </div>
        )} */}

        {/* Posts Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Posts Found</h3>
            <p className="text-gray-600 mb-4">
              This category doesn't have any posts yet. Check back later for new content!
            </p>
            <Link
              href="/gallery"
              className="inline-block px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Browse All Posts
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-12">
              {posts.map((post) => (
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
                        {category.name}
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

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mb-12">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {/* Page Numbers */}
                {generatePageNumbers().map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg ${
                      pageNum === pagination.currentPage
                        ? 'bg-red-600 text-white'
                        : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* Long Description Section */}
        {category.long_description && (
          <div className="bg-white p-8 mb-12">
            {/* <h3 className="text-2xl font-bold text-gray-900 mb-6">
              About {category.name} Coloring Pages
            </h3> */}
            <div className="prose prose-gray max-w-none">
              <div className="text-gray-700 leading-relaxed markdown-content">
                <ReactMarkdown>{category.long_description}</ReactMarkdown>
              </div>
            </div>
          </div>
        )}

        <style jsx>{`
          .markdown-content h1 {
            font-size: 2em;
            font-weight: bold;
            margin-bottom: 0.5em;
            color: #111827;
          }
          
          .markdown-content h2 {
            font-size: 1.5em;
            font-weight: bold;
            margin-bottom: 0.5em;
            color: #111827;
          }
          
          .markdown-content h3 {
            font-size: 1.25em;
            font-weight: bold;
            margin-bottom: 0.5em;
            color: #111827;
          }
          
          .markdown-content p {
            margin-bottom: 1em;
            line-height: 1.6;
          }
          
          .markdown-content ul, .markdown-content ol {
            margin-bottom: 1em;
            padding-left: 1.5em;
          }
          
          .markdown-content li {
            margin-bottom: 0.5em;
          }
          
          .markdown-content blockquote {
            border-left: 4px solid #e5e7eb;
            padding-left: 1em;
            margin: 1em 0;
            color: #6b7280;
            font-style: italic;
          }
          
          .markdown-content code {
            background: #f3f4f6;
            padding: 2px 4px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
          }
          
          .markdown-content pre {
            background: #f3f4f6;
            padding: 1em;
            border-radius: 4px;
            overflow-x: auto;
            margin: 1em 0;
          }
          
          .markdown-content a {
            color: #dc2626;
            text-decoration: underline;
          }
          
          .markdown-content a:hover {
            color: #b91c1c;
          }
          
          .markdown-content strong {
            font-weight: bold;
          }
          
          .markdown-content em {
            font-style: italic;
          }
        `}</style>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Explore More Categories
            </h3>
            <p className="text-gray-600 mb-6">
              Discover more coloring pages and drawing tutorials in our other categories.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/categories"
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Browse All Categories
              </Link>
              <Link
                href="/gallery"
                className="px-6 py-3 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                View All Posts
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 