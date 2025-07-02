'use client';

import React, { useState, useEffect } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import Link from "next/link";
import { PlusIcon } from "@/icons";
import Image from "next/image";


export default function CategoriesManagement() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [categoriesPerPage, setCategoriesPerPage] = useState(20);

  // Fetch categories from the API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/categories');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Failed to load categories. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Pagination logic
  const totalCategories = categories.length;
  const totalPages = Math.ceil(totalCategories / categoriesPerPage);
  const startIndex = (currentPage - 1) * categoriesPerPage;
  const endIndex = startIndex + categoriesPerPage;
  const currentCategories = categories.slice(startIndex, endIndex);

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCategoriesPerPageChange = (e) => {
    setCategoriesPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing categories per page
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

  // Handle category deletion
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return;
    }

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete category');
      }

      // Remove the deleted category from the state
      const updatedCategories = categories.filter(category => category._id !== id);
      setCategories(updatedCategories);
      
      // Check if current page is still valid after deletion
      const newTotalPages = Math.ceil(updatedCategories.length / categoriesPerPage);
      
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category. Please try again.');
    }
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Categories Management" />
      <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
            All Categories
          </h2>
          {!loading && categories.length > 0 && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Showing {startIndex + 1}-{Math.min(endIndex, totalCategories)} of {totalCategories} categories
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          {!loading && categories.length > 0 && (
            <div className="flex items-center gap-2">
              <label htmlFor="categoriesPerPage" className="text-sm text-gray-600 dark:text-gray-400">
                Show:
              </label>
              <select
                id="categoriesPerPage"
                value={categoriesPerPage}
                onChange={handleCategoriesPerPageChange}
                className="rounded-md border border-gray-300 px-3 py-1 text-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-sm text-gray-600 dark:text-gray-400">categories</span>
            </div>
          )}
          
          <Link href="/nabeel-dashboard-gallery/categories/new">
            <Button variant="primary" startIcon={<PlusIcon />}>
              Add New Category
            </Button>
          </Link>
        </div>
      </div>

      <ComponentCard>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-gray-500 dark:text-gray-400">Loading categories...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-error-600">{error}</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-gray-500 dark:text-gray-400">No categories found. Create your first category!</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50">
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                      Thumbnail
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                      Created At
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {currentCategories.map((category) => (
                    <tr
                      key={category._id}
                      className="bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700/50"
                    >
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800 dark:text-white/90">
                        <div className="h-12 w-12 overflow-hidden rounded-md">
                          <Image
                            src={category.thumbnail || "/images/grid-image/grid-image-01.jpg"}
                            alt={category.name}
                            width={48}
                            height={48}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800 dark:text-white/90">
                        {category.name}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {category.createdAt ? new Date(category.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <div className="flex space-x-2">
                          <Link href={`/nabeel-dashboard-gallery/categories/edit/${category._id}`}>
                            <Button size="sm" variant="outline">
                              Edit
                            </Button>
                          </Link>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-error-600"
                            onClick={() => handleDelete(category._id)}
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