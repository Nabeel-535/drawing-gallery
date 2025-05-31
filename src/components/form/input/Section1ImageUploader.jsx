'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { getCloudinaryUploadUrl, cloudinaryConfig } from '@/lib/cloudinary';
import { TrashBinIcon, ChevronUpIcon, ChevronDownIcon } from '@/icons';

const Section1ImageUploader = ({ onImagesUpdate, images = [], className }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  
  // Ensure images is always an array
  const safeImages = Array.isArray(images) ? images : [];
  
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

  // Handle file upload with proper state management
  const uploadFile = useCallback(async (file) => {
    // Check if file is an image
    if (!file.type.match('image.*')) {
      setError('Please select an image file');
      return;
    }

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
      
      // Add the new image to the list with a default priority
      const newImage = {
        main_image_url: data.secure_url,
        title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension from title
        imageUrl: '',  // Initialize with empty imageUrl for additional image
        pdfUrl: '',  // Initialize with empty pdfUrl
        priority: 0 // Will be set correctly in the update function
      };
      
      // Use functional update to ensure we get the latest state
      if (onImagesUpdate) {
        onImagesUpdate(prevImages => {
          const updatedImages = [...prevImages, { ...newImage, priority: prevImages.length + 1 }];
          console.log('Updating images:', updatedImages);
          return updatedImages;
        });
      }
    } catch (err) {
      console.error('Error uploading to Cloudinary:', err);
      setError('Failed to upload image. Please try again.');
    }
  }, [onImagesUpdate]);

  // Handle multiple file uploads sequentially
  const handleMultipleFileUploads = useCallback(async (files) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setError('');

    try {
      // Upload files sequentially to avoid race conditions
      for (let i = 0; i < files.length; i++) {
        await uploadFile(files[i]);
      }
    } catch (err) {
      console.error('Error in multiple file upload:', err);
      setError('Some files failed to upload. Please try again.');
    } finally {
      setIsUploading(false);
    }
  }, [uploadFile]);

  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    await handleMultipleFileUploads(files);
  }, [handleMultipleFileUploads]);

  const handleFileChange = useCallback(async (e) => {
    const files = e.target.files;
    await handleMultipleFileUploads(files);
  }, [handleMultipleFileUploads]);

  const handleRemoveImage = useCallback((index) => {
    if (onImagesUpdate) {
      onImagesUpdate(prevImages => {
        const updatedImages = [...prevImages];
        updatedImages.splice(index, 1);
        
        // Reorder priorities after removal
        const reorderedImages = updatedImages.map((img, idx) => ({
          ...img,
          priority: idx + 1
        }));
        
        return reorderedImages;
      });
    }
  }, [onImagesUpdate]);

  const handlePriorityChange = useCallback((index, newPriority) => {
    if (newPriority < 1 || newPriority > safeImages.length) return;
    
    if (onImagesUpdate) {
      onImagesUpdate(prevImages => {
        const updatedImages = [...prevImages];
        const imageToMove = updatedImages[index];
        
        // Remove the image from its current position
        updatedImages.splice(index, 1);
        
        // Insert it at the new position
        updatedImages.splice(newPriority - 1, 0, imageToMove);
        
        // Update all priorities
        const reorderedImages = updatedImages.map((img, idx) => {
          // If this is now the highest priority image, clear pdfUrl but keep URL
          if (idx === updatedImages.length - 1) {
            return {
              ...img,
              pdfUrl: '',
              priority: idx + 1
            };
          }
          return {
            ...img,
            priority: idx + 1
          };
        });
        
        return reorderedImages;
      });
    }
  }, [safeImages.length, onImagesUpdate]);

  const handleTitleChange = useCallback((index, title) => {
    if (onImagesUpdate) {
      onImagesUpdate(prevImages => {
        const updatedImages = [...prevImages];
        updatedImages[index] = { ...updatedImages[index], title };
        return updatedImages;
      });
    }
  }, [onImagesUpdate]);

  const handlePdfUrlChange = useCallback((index, pdfUrl) => {
    if (onImagesUpdate) {
      onImagesUpdate(prevImages => {
        const updatedImages = [...prevImages];
        updatedImages[index] = { ...updatedImages[index], pdfUrl };
        return updatedImages;
      });
    }
  }, [onImagesUpdate]);

  const handleImageUrlChange = useCallback((index, imageUrl) => {
    if (onImagesUpdate) {
      onImagesUpdate(prevImages => {
        const updatedImages = [...prevImages];
        updatedImages[index] = { ...updatedImages[index], imageUrl };
        return updatedImages;
      });
    }
  }, [onImagesUpdate]);

  const uploadAdditionalFile = useCallback(async (file, index, fieldType) => {
    try {
      setIsUploading(true);
      setError('');

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', cloudinaryConfig.uploadPreset);

      const response = await fetch(getCloudinaryUploadUrl(), {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      
      if (onImagesUpdate) {
        onImagesUpdate(prevImages => {
          const updatedImages = [...prevImages];
          
          if (fieldType === 'imageUrl') {
            updatedImages[index] = { ...updatedImages[index], imageUrl: data.secure_url };
          } else if (fieldType === 'pdfUrl') {
            updatedImages[index] = { ...updatedImages[index], pdfUrl: data.secure_url };
          }
          
          return updatedImages;
        });
      }
    } catch (err) {
      console.error('Error uploading additional file:', err);
      setError('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  }, [onImagesUpdate]);

  const movePriorityUp = useCallback((index) => {
    if (index === 0) return; // Already at the top
    handlePriorityChange(index, index);
  }, [handlePriorityChange]);

  const movePriorityDown = useCallback((index) => {
    if (index === safeImages.length - 1) return; // Already at the bottom
    handlePriorityChange(index, index + 2);
  }, [handlePriorityChange, safeImages.length]);

  return (
    <div className={`w-full ${className}`}>
      {/* Drag and drop area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${isDragging ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10' : 'border-gray-300 dark:border-gray-700'} ${isUploading ? 'opacity-50' : ''}`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('section1FileInput').click()}
      >
        <input
          id="section1FileInput"
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept="image/*"
          disabled={isUploading}
          multiple
        />

        <div className="py-4">
          {isUploading ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">Uploading...</p>
          ) : (
            <>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Click or drag and drop images
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

      {/* Debug info */}
      {/* <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs">
        <p>Images count: {safeImages.length}</p>
        <p>Images data: {JSON.stringify(safeImages, null, 2)}</p>
      </div> */}

      {/* Image list */}
      {safeImages.length > 0 && (
        <div className="mt-4 space-y-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Uploaded Images</h4>
          
          <div className="space-y-4">
            {safeImages.map((image, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Image preview - show for all images */}
                  <div className="relative w-full md:w-32 h-32 flex-shrink-0">
                    <Image 
                      src={image.main_image_url} 
                      alt={image.title || `Image ${index + 1}`} 
                      fill 
                      className="object-cover rounded-md" 
                    />
                  </div>
                  
                  {/* Image details */}
                  <div className="flex-grow space-y-3">
                    <div>
                      <label htmlFor={`image-title-${index}`} className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Image Title
                      </label>
                      <input
                        type="text"
                        id={`image-title-${index}`}
                        value={image.title || ''}
                        onChange={(e) => handleTitleChange(index, e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
                      />
                    </div>
                    
                    {/* High priority image (last in order) should not have additional file upload fields */}
                    {image.priority === safeImages.length ? (
                      <div className="flex flex-wrap gap-2 mt-2">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          High priority image - No additional files needed
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3 mt-2">
                        {/* Additional Image Upload */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Additional Image
                          </label>
                          <div className="flex gap-2">
                            {image.imageUrl ? (
                              <div className="flex items-center gap-2 flex-grow">
                                <input
                                  type="text"
                                  value={image.imageUrl}
                                  onChange={(e) => handleImageUrlChange(index, e.target.value)}
                                  placeholder="Image URL"
                                  className="flex-grow rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleImageUrlChange(index, '')}
                                  className="px-2 py-1.5 text-xs text-error-600 hover:text-error-700 dark:text-error-400"
                                >
                                  Clear
                                </button>
                              </div>
                            ) : (
                              <>
                                <input
                                  type="file"
                                  id={`additional-image-${index}`}
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) uploadAdditionalFile(file, index, 'imageUrl');
                                  }}
                                  className="hidden"
                                />
                                <button
                                  type="button"
                                  onClick={() => document.getElementById(`additional-image-${index}`).click()}
                                  className="flex items-center gap-1 px-3 py-1.5 text-xs bg-primary-50 text-primary-600 rounded-md border border-primary-200 hover:bg-primary-100 dark:bg-primary-900/20 dark:text-primary-400 dark:border-primary-800 dark:hover:bg-primary-900/30"
                                >
                                  + Upload Image
                                </button>
                                <input
                                  type="text"
                                  value={image.imageUrl || ''}
                                  onChange={(e) => handleImageUrlChange(index, e.target.value)}
                                  placeholder="Or enter image URL"
                                  className="flex-grow rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
                                />
                              </>
                            )}
                          </div>
                        </div>
                        
                        {/* PDF Upload */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            PDF File
                          </label>
                          <div className="flex gap-2">
                            {image.pdfUrl ? (
                              <div className="flex items-center gap-2 flex-grow">
                                <input
                                  type="text"
                                  value={image.pdfUrl}
                                  onChange={(e) => handlePdfUrlChange(index, e.target.value)}
                                  placeholder="PDF URL"
                                  className="flex-grow rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
                                />
                                <button
                                  type="button"
                                  onClick={() => handlePdfUrlChange(index, '')}
                                  className="px-2 py-1.5 text-xs text-error-600 hover:text-error-700 dark:text-error-400"
                                >
                                  Clear
                                </button>
                              </div>
                            ) : (
                              <>
                                <input
                                  type="file"
                                  id={`pdf-file-${index}`}
                                  accept=".pdf,application/pdf"
                                  onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) uploadAdditionalFile(file, index, 'pdfUrl');
                                  }}
                                  className="hidden"
                                />
                                <button
                                  type="button"
                                  onClick={() => document.getElementById(`pdf-file-${index}`).click()}
                                  className="flex items-center gap-1 px-3 py-1.5 text-xs bg-primary-50 text-primary-600 rounded-md border border-primary-200 hover:bg-primary-100 dark:bg-primary-900/20 dark:text-primary-400 dark:border-primary-800 dark:hover:bg-primary-900/30"
                                >
                                  + Upload PDF
                                </button>
                                <input
                                  type="text"
                                  value={image.pdfUrl || ''}
                                  onChange={(e) => handlePdfUrlChange(index, e.target.value)}
                                  placeholder="Or enter PDF URL"
                                  className="flex-grow rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
                                />
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Priority and actions */}
                  <div className="flex flex-row md:flex-col items-center justify-between md:justify-start gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{image.priority}</span>
                      <div className="flex flex-col">
                        <button 
                          type="button" 
                          onClick={() => movePriorityUp(index)}
                          disabled={index === 0}
                          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 disabled:opacity-50"
                        >
                          <ChevronUpIcon className="w-4 h-4" />
                        </button>
                        <button 
                          type="button" 
                          onClick={() => movePriorityDown(index)}
                          disabled={index === safeImages.length - 1}
                          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 disabled:opacity-50"
                        >
                          <ChevronDownIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveImage(index)}
                      className="text-error-500 hover:text-error-600 dark:text-error-400 dark:hover:text-error-300"
                    >
                      <TrashBinIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Section1ImageUploader;