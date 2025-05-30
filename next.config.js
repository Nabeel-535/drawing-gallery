/** @type {import('next').NextConfig} */

const nextConfig = {
  /* config options here */
  images: {
    domains: ['res.cloudinary.com','drawing-gallery.com'],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

module.exports = nextConfig;