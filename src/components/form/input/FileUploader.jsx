'use client';

import React, { useState, useCallback } from 'react';
import { getRawUploadUrl, cloudinaryConfig } from '@/lib/cloudinary';

const FileUploader = ({ onFileUpload, value, className, accept = "*/*", label = "Click or drag and drop a file" }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const inputId = `fileInput-${Math.random().toString(36).substr(2, 9)}`; // Generate unique ID
  
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
    setIsUploading(true);
    setError('');

    try {
      // Create form data for upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', cloudinaryConfig.rawUploadPreset);
      // Note: resource_type is determined by the endpoint (raw/upload)

      // Upload to Cloudinary
      const response = await fetch(
        getRawUploadUrl(),
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
      if (onFileUpload) {
        onFileUpload(data.secure_url);
      }
    } catch (err) {
      console.error('Error uploading to Cloudinary:', err);
      setError('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Get file name from URL
  const getFileName = (url) => {
    if (!url) return '';
    try {
      const urlParts = url.split('/');
      return decodeURIComponent(urlParts[urlParts.length - 1]);
    } catch {
      return 'Uploaded file';
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
        onClick={() => document.getElementById(inputId).click()}
      >
        <input
          id={inputId}
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept={accept}
          disabled={isUploading}
        />

        {value ? (
          <div className="mb-2">
            <div className="inline-flex items-center px-3 py-2 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 rounded-md">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-sm font-medium">{getFileName(value)}</span>
            </div>
            <div className="mt-1">
              <a 
                href={value} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                View file
              </a>
            </div>
          </div>
        ) : null}

        <div className="py-4">
          {isUploading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
              <p className="ml-2 text-sm text-gray-500 dark:text-gray-400">Uploading...</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-center mb-2">
                <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {value ? 'Click or drag to replace file' : label}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                PDF, ZIP, DOC, XLS, PPT, TXT and other files up to 100MB
              </p>
            </>
          )}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <p className="mt-2 text-sm text-error-500 dark:text-error-400">{error}</p>
      )}

      {/* Current URL input (for manual entry) */}
      {value && (
        <div className="mt-2">
          <input
            type="text"
            value={value}
            readOnly
            className="w-full text-xs px-2 py-1 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded"
            onClick={(e) => {
              e.target.select();
              e.stopPropagation();
            }}
          />
        </div>
      )}
    </div>
  );
};

export default FileUploader; 