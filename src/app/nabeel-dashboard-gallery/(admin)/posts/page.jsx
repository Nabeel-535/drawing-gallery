'use client';

import React, { useState, useEffect } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import Link from "next/link";
import { PlusIcon } from "@/icons";

export default function PostsManagement() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(20);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  // Fetch posts and categories from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch posts
        const postsResponse = await fetch('/api/posts/admin');
        if (!postsResponse.ok) {
          throw new Error('Failed to fetch posts');
        }
        const postsData = await postsResponse.json();
        setPosts(postsData?.posts || []);
        
        // Fetch categories
        const categoriesResponse = await fetch('/api/categories');
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          setCategories(categoriesData || []);
        }
        
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle post deletion
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      const response = await fetch(`/api/posts/admin/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      // Remove the deleted post from the state
      const updatedPosts = posts.filter(post => post._id !== id);
      setPosts(updatedPosts);
      
      // Check if current page is still valid after deletion
      const filteredUpdatedPosts = selectedCategory 
        ? updatedPosts.filter(post => post.categoryId === selectedCategory)
        : updatedPosts;
      const newTotalPages = Math.ceil(filteredUpdatedPosts.length / postsPerPage);
      
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. Please try again.');
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Filter posts by category
  const filteredPosts = selectedCategory 
    ? posts.filter(post => post.categoryId === selectedCategory)
    : posts;

  // Pagination logic
  const totalPosts = filteredPosts.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePostsPerPageChange = (e) => {
    setPostsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing posts per page
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1); // Reset to first page when changing category filter
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Posts Management" />
      <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
            All Posts
          </h2>
          {!loading && posts.length > 0 && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Showing {startIndex + 1}-{Math.min(endIndex, totalPosts)} of {totalPosts} posts
              {selectedCategory && (
                <span className="ml-2 text-primary-600 dark:text-primary-400">
                  (filtered by category)
                </span>
              )}
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-4 flex-wrap">
          {!loading && posts.length > 0 && (
            <>
              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <label htmlFor="categoryFilter" className="text-sm text-gray-600 dark:text-gray-400">
                  Category:
                </label>
                <select
                  id="categoryFilter"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  className="rounded-md border border-gray-300 px-3 py-1 text-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Posts Per Page */}
              <div className="flex items-center gap-2">
                <label htmlFor="postsPerPage" className="text-sm text-gray-600 dark:text-gray-400">
                  Show:
                </label>
                <select
                  id="postsPerPage"
                  value={postsPerPage}
                  onChange={handlePostsPerPageChange}
                  className="rounded-md border border-gray-300 px-3 py-1 text-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="text-sm text-gray-600 dark:text-gray-400">posts</span>
              </div>
            </>
          )}
          
          <Link href="/nabeel-dashboard-gallery/posts/new">
            <Button variant="primary" startIcon={<PlusIcon />}>
              Add New Post
            </Button>
          </Link>
        </div>
      </div>

      <ComponentCard>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-gray-500 dark:text-gray-400">Loading posts...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-error-600">{error}</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-gray-500 dark:text-gray-400">No posts found. Create your first post!</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50">
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                      Author
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                      Published Date
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {currentPosts.length > 0 && currentPosts.map((post) => (
                    <tr
                      key={post._id}
                      className="bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700/50"
                    >
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800 dark:text-white/90">
                        {post.title}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {post?.category?.name || 'Uncategorized'}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {post.author}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {post.createdAt ? formatDate(post.createdAt) : 'N/A'}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            post.status === "Published"
                              ? "bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-500"
                              : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                          }`}
                        >
                          {post.status || 'Draft'}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <div className="flex space-x-2">
                          <Link href={`/nabeel-dashboard-gallery/posts/edit/${post._id}`}>
                            <Button size="sm" variant="outline">
                              Edit
                            </Button>
                          </Link>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-error-600"
                            onClick={() => handleDelete(post._id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Page {currentPage} of {totalPages}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {/* Previous Button */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1 text-sm rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:hover:bg-gray-800 dark:text-white/90"
                    >
                      Previous
                    </button>
                    
                    {/* Page Numbers */}
                    {getPageNumbers().map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-1 text-sm rounded-md border ${
                          currentPage === pageNum
                            ? 'bg-primary-600 text-white border-primary-600'
                            : 'border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 dark:text-white/90'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                    
                    {/* Next Button */}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 text-sm rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:hover:bg-gray-800 dark:text-white/90"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </ComponentCard>
    </div>
  );
}