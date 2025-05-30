// Cloudinary configuration

// Cloudinary configuration using environment variables
export const cloudinaryConfig = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dtdbywbjc',
  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'drawing-gallery',
  apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '537238422458959',
};

// Helper function to build the Cloudinary upload URL
export const getCloudinaryUploadUrl = () => {
  return `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`;
};