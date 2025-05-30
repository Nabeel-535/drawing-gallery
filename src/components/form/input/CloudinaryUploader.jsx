'use client';

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import { getCloudinaryUploadUrl, cloudinaryConfig } from '@/lib/cloudinary';

const CloudinaryUploader = ({ onImageUpload, value, className }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  
  // Handle drag events
  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  }, [isDragging]);

  // Handle file upload
  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      await uploadFile(files[0]);
    }
  }, []);

  const handleFileChange = useCallback(async (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await uploadFile(files[0]);
    }
  }, []);

  const uploadFile = async (file) => {
    // Check if file is an image
    if (!file.type.match('image.*')) {
      setError('Please select an image file');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      // Create form data for upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', cloudinaryConfig.uploadPreset);

      // Upload to Cloudinary
      const response = await fetch(
        getCloudinaryUploadUrl(),
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      
      // Call the callback with the secure URL
      if (onImageUpload) {
        onImageUpload(data.secure_url);
      }
    } catch (err) {
      console.error('Error uploading to Cloudinary:', err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Drag and drop area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${isDragging ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10' : 'border-gray-300 dark:border-gray-700'} ${isUploading ? 'opacity-50' : ''}`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('fileInput').click()}
      >
        <input
          id="fileInput"
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept="image/*"
          disabled={isUploading}
        />

        {value ? (
          <div className="relative w-full h-40 mb-2">
            <Image 
              src={value} 
              alt="Uploaded image" 
              fill 
              className="object-contain rounded-md" 
            />
          </div>
        ) : null}

        <div className="py-4">
          {isUploading ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">Uploading...</p>
          ) : (
            <>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {value ? 'Click or drag to replace image' : 'Click or drag and drop an image'}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                PNG, JPG, GIF up to 10MB
              </p>
            </>
          )}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <p className="mt-2 text-sm text-error-500 dark:text-error-400">{error}</p>
      )}
    </div>
  );
};

export default CloudinaryUploader;