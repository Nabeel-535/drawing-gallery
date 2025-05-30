'use client';

import React, { useState, useEffect, use } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import { useRouter } from "next/navigation";
import CloudinaryUploader from "@/components/form/input/CloudinaryUploader";
import Image from "next/image";

export default function EditCategory({ params }) {
  const router = useRouter();
  const { id } = use(params);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    thumbnail: ""
  });

  // Fetch category data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/categories/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch category');
        }
        const categoryData = await response.json();
        
        setFormData({
          name: categoryData.name || "",
          thumbnail: categoryData.thumbnail || ""
        });
      } catch (error) {
        console.error('Error fetching category:', error);
        alert('Failed to load category data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/nabeel-dashboard-gallery/categories');
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || 'Failed to update category'}`);
      }
    } catch (error) {
      console.error('Error updating category:', error);
      alert('An error occurred while updating the category');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Edit Category" />
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500 dark:text-gray-400">Loading category data...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Edit Category" />

      <ComponentCard title="Category Details">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
            />
          </div>

          <div>
            <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Thumbnail Image
            </label>
            <CloudinaryUploader 
              onImageUpload={(url) => setFormData(prev => ({ ...prev, thumbnail: url }))}
              value={formData.thumbnail}
              className="mb-2"
            />
            {formData.thumbnail && (
              <div className="mt-2">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Preview:</p>
                <div className="relative h-32 w-32 overflow-hidden rounded-md border border-gray-300 dark:border-gray-700">
                  <Image
                    src={formData.thumbnail}
                    alt="Thumbnail preview"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/nabeel-dashboard-gallery/categories')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Update Category'}
            </Button>
          </div>
        </form>
      </ComponentCard>
    </div>
  );
}