'use client';

import React, { useState, useEffect, use } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import { useRouter } from "next/navigation";
import CloudinaryUploader from "@/components/form/input/CloudinaryUploader";
import RichTextEditor from "@/components/form/input/RichTextEditor";
import Image from "next/image";

export default function EditCategory({ params }) {
  const router = useRouter();
  const { id } = use(params);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    thumbnail: "",
    short_description: "",
    long_description: "",
    custom_url: "",
    keyword: ""
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
          thumbnail: categoryData.thumbnail || "",
          short_description: categoryData.short_description || "",
          long_description: categoryData.long_description || "",
          custom_url: categoryData.custom_url || "",
          keyword: categoryData.keyword || ""
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

  const handleTextAreaChange = (name, value) => {
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
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
              placeholder="Enter category name"
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

          <div>
            <label htmlFor="short_description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Short Description
            </label>
            <input
              type="text"
              id="short_description"
              name="short_description"
              value={formData.short_description}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
              placeholder="Brief description for the category"
            />
          </div>

          <div>
            <label htmlFor="long_description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Long Description
            </label>
            <RichTextEditor
              placeholder="Detailed description for the category page"
              value={formData.long_description}
              onChange={(value) => handleTextAreaChange('long_description', value)}
              className="text-black"
              hint="Use the rich text editor to format your content with headings, lists, links, and more."
            />
          </div>

          <div>
            <label htmlFor="custom_url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Custom URL
            </label>
            <input
              type="text"
              id="custom_url"
              name="custom_url"
              value={formData.custom_url}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
              placeholder="custom-url-slug (leave empty to auto-generate)"
              pattern="[a-z0-9-]*"
              title="Only lowercase letters, numbers, and hyphens are allowed"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Will be used as: yoursite.com/{formData.custom_url || 'category-name'}
            </p>
          </div>

          <div>
            <label htmlFor="keyword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              SEO Keywords
            </label>
            <input
              type="text"
              id="keyword"
              name="keyword"
              value={formData.keyword}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
              placeholder="Keywords for SEO (comma-separated)"
            />
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