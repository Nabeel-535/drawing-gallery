'use client';

import React, { useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import { useRouter } from "next/navigation";
import CloudinaryUploader from "@/components/form/input/CloudinaryUploader";
import RichTextEditor from "@/components/form/input/RichTextEditor";
import Image from "next/image";

export default function NewCategory() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    thumbnail: "",
    short_description: "",
    long_description: "",
    custom_url: "",
    keyword: ""
  });

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
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/nabeel-dashboard-gallery/categories');
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || 'Failed to create category'}`);
      }
    } catch (error) {
      console.error('Error creating category:', error);
      alert('An error occurred while creating the category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Add New Category" />

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
            <div className="bg-gray-800">

            <RichTextEditor
              placeholder="Detailed description for the category page"
              value={formData.long_description}
              onChange={(value) => handleTextAreaChange('long_description', value)}
              className=" bg-gray-800"
              hint="Use the rich text editor to format your content with headings, lists, links, and more."
            />
            </div>
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
              {loading ? 'Saving...' : 'Save Category'}
            </Button>
          </div>
        </form>
      </ComponentCard>
    </div>
  );
}