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
      setCategories(categories.filter(category => category._id !== id));
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category. Please try again.');
    }
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Categories Management" />
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
          All Categories
        </h2>
        <Link href="/nabeel-dashboard-gallery/categories/new">
          <Button variant="primary" startIcon={<PlusIcon />}>
            Add New Category
          </Button>
        </Link>
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
                {categories.map((category) => (
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
        )}
      </ComponentCard>
    </div>
  );
}