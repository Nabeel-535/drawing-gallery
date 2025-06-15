'use client';

import React, { useState, useEffect, use } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import { useRouter } from "next/navigation";
import CloudinaryUploader from "@/components/form/input/CloudinaryUploader";
import Section1ImageUploader from "@/components/form/input/Section1ImageUploader";
import Section2ImageUploader from "@/components/form/input/Section2ImageUploader";
import FileUploader from "@/components/form/input/FileUploader";
import Image from "next/image";

export default function EditPost({ params }) {
  const router = useRouter();
  const { id } = use(params);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [slugError, setSlugError] = useState('');
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(true); // Default to true for edit mode
  const [formData, setFormData] = useState({
    title: "",
    url_slug: "",
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

  // Function to generate URL-friendly slug
  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
      .replace(/[\s_-]+/g, '-') // Replace spaces, underscores, and multiple hyphens with single hyphen
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  };

  // Function to validate slug format
  const validateSlug = (slug) => {
    if (!slug) {
      return 'Slug is required';
    }
    
    if (slug.length < 3) {
      return 'Slug must be at least 3 characters long';
    }
    
    if (slug.length > 100) {
      return 'Slug must be less than 100 characters';
    }
    
    // Check for spaces
    if (/\s/.test(slug)) {
      return 'Slug cannot contain spaces. Use hyphens (-) instead.';
    }
    
    // Check for uppercase letters
    if (/[A-Z]/.test(slug)) {
      return 'Slug must be lowercase only.';
    }
    
    // Check if it starts or ends with hyphen
    if (slug.startsWith('-') || slug.endsWith('-')) {
      return 'Slug cannot start or end with a hyphen.';
    }
    
    // Check for invalid characters
    const slugRegex = /^[a-z0-9-]+$/;
    if (!slugRegex.test(slug)) {
      return 'Slug can only contain lowercase letters, numbers, and hyphens.';
    }
    
    // Check for consecutive hyphens
    if (/--/.test(slug)) {
      return 'Slug cannot contain consecutive hyphens.';
    }
    
    return '';
  };

  // Fetch post data and categories
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch post data
        const postResponse = await fetch(`/api/posts/admin/${id}`);
        if (!postResponse.ok) {
          throw new Error('Failed to fetch post');
        }
        const postResult = await postResponse.json();
        const postData = postResult.post; // Extract the post from the response
        
        // Debug: Log the fetched data
        console.log('Fetched post data:', postData);
        
        // Fetch categories
        const categoriesResponse = await fetch('/api/categories');
        if (!categoriesResponse.ok) {
          throw new Error('Failed to fetch categories');
        }
        const categoriesData = await categoriesResponse.json();
        
        setCategories(categoriesData);
        setFormData({
          title: postData.title || "",
          url_slug: postData.url_slug || "",
          content: postData.content || "",
          categoryId: postData.categoryId || "",
          author: postData.author || "",
          status: postData.status || "Draft",
          featuredImage: postData.featuredImage || "",
          download_link: postData.download_link || "",
          download_5_file: postData.download_5_file || "",
          download_10_file: postData.download_10_file || "",
          download_15_file: postData.download_15_file || "",
          section1_images: postData.section1_images || [],
          section2_images: postData.section2_images || [],
          section2_title: postData.section2_title || "",
          tags: postData.tags || []
        });
        
        // Validate the existing slug
        if (postData.url_slug) {
          const error = validateSlug(postData.url_slug);
          setSlugError(error);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Failed to load post data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

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
    
    if (name === 'title' && !isSlugManuallyEdited) {
      // Auto-generate slug from title if slug hasn't been manually edited
      const newSlug = generateSlug(value);
      setFormData(prev => ({
        ...prev,
        [name]: value,
        url_slug: newSlug
      }));
      // Validate the auto-generated slug
      const error = validateSlug(newSlug);
      setSlugError(error);
    } else if (name === 'url_slug') {
      // Handle manual slug editing - give user complete freedom
      setIsSlugManuallyEdited(true);
      
      setFormData(prev => ({
        ...prev,
        [name]: value // Use the raw value without any cleaning
      }));
      // Validate the raw slug and show errors
      const error = validateSlug(value);
      setSlugError(error);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate slug before submission
    const slugValidationError = validateSlug(formData.url_slug);
    if (slugValidationError) {
      setSlugError(slugValidationError);
      alert('Please fix the slug validation error before submitting.');
      return;
    }
    
    setLoading(true);

    // Debug: Log the form data being submitted
    console.log('Submitting form data:', formData);

    try {
      const response = await fetch(`/api/posts/admin/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('Post updated successfully:', result);
        alert('Post updated successfully!');
        router.push('/nabeel-dashboard-gallery/posts');
      } else {
        const error = await response.json();
        console.error('Server error:', error);
        alert(`Error: ${error.error || error.message || 'Failed to update post'}`);
      }
    } catch (error) {
      console.error('Error updating post:', error);
      alert('An error occurred while updating the post: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Edit Post" />
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500 dark:text-gray-400">Loading post data...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Edit Post" />

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
              <label htmlFor="url_slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Slug
              </label>
              <input
                type="text"
                id="url_slug"
                name="url_slug"
                value={formData.url_slug}
                onChange={handleChange}
                required
                placeholder="url-friendly-slug"
                className={`w-full rounded-md border px-4 py-2 text-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-800 dark:text-white/90 ${
                  slugError 
                    ? 'border-red-500 dark:border-red-500' 
                    : 'border-gray-300 dark:border-gray-700'
                }`}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                The slug is used in the URL (e.g., /posts/your-slug). Edit carefully as this affects the post's URL.
              </p>
              {slugError && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                  {slugError}
                </p>
              )}
              {formData.url_slug && !slugError && (
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  ✓ URL will be: /posts/{formData.url_slug}
                </p>
              )}
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
                Main Download File
              </label>
              <FileUploader 
                onFileUpload={(url) => setFormData(prev => ({ ...prev, download_link: url }))}
                value={formData.download_link}
                label="Upload main download file (PDF, ZIP, etc.)"
                className="mb-2"
              />
            </div>

            <div>
              <label htmlFor="download_5_file" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                5x5 Size File
              </label>
              <FileUploader 
                onFileUpload={(url) => setFormData(prev => ({ ...prev, download_5_file: url }))}
                value={formData.download_5_file}
                label="Upload 5x5 size file"
                className="mb-2"
              />
            </div>

            <div>
              <label htmlFor="download_10_file" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                10x10 Size File
              </label>
              <FileUploader 
                onFileUpload={(url) => setFormData(prev => ({ ...prev, download_10_file: url }))}
                value={formData.download_10_file}
                label="Upload 10x10 size file"
                className="mb-2"
              />
            </div>

            <div>
              <label htmlFor="download_15_file" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                15x15 Size File
              </label>
              <FileUploader 
                onFileUpload={(url) => setFormData(prev => ({ ...prev, download_15_file: url }))}
                value={formData.download_15_file}
                label="Upload 15x15 size file"
                className="mb-2"
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
                defaultValue={formData.tags.join(', ')}
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
            {loading ? 'Updating...' : 'Update Post'}
          </Button>
        </div>
      </form>
    </div>
  );
}