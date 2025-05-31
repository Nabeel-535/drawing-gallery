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

  // Fetch posts from the API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/posts/admin');
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        
        setPosts(data?.posts);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError('Failed to load posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
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
      setPosts(posts.filter(post => post._id !== id));
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

  return (
    <div>
      <PageBreadcrumb pageTitle="Posts Management" />
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
          All Posts
        </h2>
        <Link href="/nabeel-dashboard-gallery/posts/new">
          <Button variant="primary" startIcon={<PlusIcon />}>
            Add New Post
          </Button>
        </Link>
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
                {posts.length > 0 && posts.map((post) => (
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
        )}
      </ComponentCard>
    </div>
  );
}