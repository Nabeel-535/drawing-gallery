'use client';

import React, { useState, useEffect } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import { useRouter } from "next/navigation";
import CloudinaryUploader from "@/components/form/input/CloudinaryUploader";
import Section1ImageUploader from "@/components/form/input/Section1ImageUploader";
import Section2ImageUploader from "@/components/form/input/Section2ImageUploader";
import Image from "next/image";

export default function NewPost() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    categoryId: "",
    author: "",
    status: "Draft",
    featuredImage: "",
    download_link: "",
    download_5_file: "",
    download_10_file: "",
    download_15_file: "",
    section1_images: [],
    section2_images: [],
    section2_title: "",
    tags: []
  });

  // Fetch categories for the dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
          if (data.length > 0) {
            setFormData(prev => ({ ...prev, categoryId: data[0]._id }));
          }
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Add event listener for download field updates from Section1ImageUploader
  useEffect(() => {
    const handleSetDownloadField = (event) => {
      const { field, value } = event.detail;
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    };

    window.addEventListener('set-download-field', handleSetDownloadField);
    
    return () => {
      window.removeEventListener('set-download-field', handleSetDownloadField);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImagesUpdate = (imagesOrUpdater) => {
    console.log('handleImagesUpdate called with:', imagesOrUpdater);
    setFormData(prev => {
      console.log('Previous section1_images:', prev.section1_images);
      // Check if imagesOrUpdater is a function (functional update)
      if (typeof imagesOrUpdater === 'function') {
        const newImages = imagesOrUpdater(prev.section1_images);
        console.log('Functional update result:', newImages);
        return {
          ...prev,
          section1_images: newImages
        };
      } else {
        // Direct value update
        console.log('Direct update with:', imagesOrUpdater);
        return {
          ...prev,
          section1_images: imagesOrUpdater
        };
      }
    });
  };

  const handleSection2ImagesUpdate = (imagesOrUpdater) => {
    console.log('handleSection2ImagesUpdate called with:', imagesOrUpdater);
    setFormData(prev => {
      console.log('Previous section2_images:', prev.section2_images);
      // Check if imagesOrUpdater is a function (functional update)
      if (typeof imagesOrUpdater === 'function') {
        const newImages = imagesOrUpdater(prev.section2_images);
        console.log('Section2 functional update result:', newImages);
        return {
          ...prev,
          section2_images: newImages
        };
      } else {
        // Direct value update
        console.log('Section2 direct update with:', imagesOrUpdater);
        return {
          ...prev,
          section2_images: imagesOrUpdater
        };
      }
    });
  };

  const handleTagsChange = (e) => {
    const value = e.target.value;
    // Split by comma and clean up tags
    const tagsArray = value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    setFormData(prev => ({
      ...prev,
      tags: tagsArray
    }));
  };

  const removeTag = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, index) => index !== indexToRemove)
    }));
  };

  const addTag = (tag) => {
    if (tag.trim() && !formData.tags.includes(tag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag.trim()]
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Debug: Log the form data being submitted
    console.log('Submitting form data:', formData);

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('Response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Post created successfully:', result);
        alert('Post created successfully!');
        router.push('/nabeel-dashboard-gallery/posts');
      } else {
        const error = await response.json();
        console.error('Server error:', error);
        alert(`Error: ${error.error || error.message || 'Failed to create post'}`);
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('An error occurred while creating the post: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Add New Post" />

      <form onSubmit={handleSubmit} className="space-y-6">
        <ComponentCard title="Post Details">
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
              />
            </div>

            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
              >
                {categories.length === 0 && <option value="">No categories available</option>}
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="download_link" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Download Link
              </label>
              <input
                type="text"
                id="download_link"
                name="download_link"
                value={formData.download_link}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
              />
            </div>

            <div>
              <label htmlFor="download_5_file" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Download 5x5 File
              </label>
              <input
                type="text"
                id="download_5_file"
                name="download_5_file"
                value={formData.download_5_file}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
              />
            </div>

            <div>
              <label htmlFor="download_10_file" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Download 10x10 File
              </label>
              <input
                type="text"
                id="download_10_file"
                name="download_10_file"
                value={formData.download_10_file}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
              />
            </div>

            <div>
              <label htmlFor="download_15_file" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Download 15x15 File
              </label>
              <input
                type="text"
                id="download_15_file"
                name="download_15_file"
                value={formData.download_15_file}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Content
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows={6}
                className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
              ></textarea>
            </div>

            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Author
              </label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
              >
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </select>
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tags
              </label>
              <input
                type="text"
                id="tags"
                placeholder="Enter tags separated by commas (e.g., animals, cartoon, kids)"
                onChange={handleTagsChange}
                className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Separate tags with commas. These help users find your content through search.
              </p>
              
              {/* Display current tags */}
              {formData.tags.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(index)}
                          className="ml-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Featured Image
              </label>
              <CloudinaryUploader 
                onImageUpload={(url) => setFormData(prev => ({ ...prev, featuredImage: url }))}
                value={formData.featuredImage}
                className="mb-2"
              />
              {formData.featuredImage && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Preview:</p>
                  <div className="relative h-40 w-full max-w-md overflow-hidden rounded-md border border-gray-300 dark:border-gray-700">
                    <Image
                      src={formData.featuredImage}
                      alt="Featured image preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </ComponentCard>

        <ComponentCard title="Section 1: Gallery Images">
          <div className="space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Upload multiple images and set their display order with priority numbers. The image with the highest priority (last in order) will be displayed differently.
            </p>
            <Section1ImageUploader 
              onImagesUpdate={handleImagesUpdate}
              images={formData.section1_images}
            />
          </div>
        </ComponentCard>

        <ComponentCard title="Section 2: Additional Gallery">
          <div className="space-y-6">
            <div>
              <label htmlFor="section2_title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Section 2 Title
              </label>
              <input
                type="text"
                id="section2_title"
                name="section2_title"
                value={formData.section2_title}
                onChange={handleChange}
                placeholder="e.g., Additional Resources, Coloring Variations, etc."
                className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
              />
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Upload images with titles and descriptions for the second gallery section.
              </p>
              <Section2ImageUploader 
                onImagesUpdate={handleSection2ImagesUpdate}
                images={formData.section2_images}
              />
            </div>
          </div>
        </ComponentCard>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/nabeel-dashboard-gallery/posts')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Post'}
          </Button>
        </div>
      </form>
    </div>
  );
}