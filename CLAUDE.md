# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Drawing Gallery website built with Next.js 15 and React 19, designed as a content management system for a YouTube drawing channel. It features a public gallery of drawing posts and a protected admin dashboard for content management.

### Technology Stack
- **Framework**: Next.js 15 with App Router
- **Frontend**: React 19, TypeScript, Tailwind CSS 4.0
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js v4 with MongoDB adapter
- **Media**: Cloudinary for image hosting
- **Analytics**: Google Analytics integration
- **Additional**: EmailJS for contact forms

## Architecture

### Application Structure
The app uses Next.js 15 App Router with route groups:

- `(pages)/` - Public pages (gallery, categories, posts)
- `(full-width-pages)/` - Auth pages and error pages  
- `nabeel-dashboard-gallery/` - Protected admin dashboard

### Data Models
The application has two main MongoDB collections:
- **Posts**: Main content with sections for images, descriptions, and metadata
- **Categories**: Content organization with custom URLs

### Key Features
- **Dual Layout System**: Public gallery layout vs admin dashboard layout
- **Authentication**: Protected admin routes with NextAuth.js
- **Content Management**: Full CRUD operations for posts and categories
- **SEO Optimization**: Dynamic metadata, sitemaps, and structured data
- **Image Management**: Cloudinary integration with upload components
- **URL Slugs**: Auto-generated SEO-friendly URLs for posts and categories

## Development Commands

```bash
# Development server
npm run dev

# Build for production
npm build

# Start production server
npm start

# Linting
npm run lint

# Database migration (add slugs to existing posts)
npm run migrate:add-slugs
```

## Database Configuration

The app requires MongoDB connection via `MONGODB_URI` environment variable. Collections:
- `posts` - Content posts with category references
- `categories` - Content categories with custom URLs
- `users` - Authentication users

## Key Components and Utilities

### Data Layer (`src/lib/models.js`)
- Centralized database operations for posts and categories
- Automatic slug generation and uniqueness validation
- Pagination and filtering utilities
- Separate admin/public access functions

### Authentication (`src/app/api/auth/[...nextauth]/route.js`)
- Credentials-based authentication (needs bcrypt implementation for production)
- MongoDB session storage
- Protected route middleware

### Context Providers
- **AuthContext**: Authentication state management
- **ThemeContext**: Dark/light mode theming
- **SidebarContext**: Admin dashboard sidebar state

### Admin Dashboard
Located in `nabeel-dashboard-gallery/` with full content management:
- Posts CRUD with rich text editor and image upload
- Category management with custom URL slugs
- YouTube video integration
- Protected routes with authentication checks

## Environment Variables

Required in `.env.local`:
```bash
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_URL=your_app_url
NEXTAUTH_SECRET=your_nextauth_secret
NEXT_PUBLIC_GA_ID=your_google_analytics_id
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_emailjs_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
```

## Important Development Notes

### File Conventions
- Uses `.jsx` files (not `.tsx`) despite TypeScript dependencies
- Path aliases configured with `@/*` pointing to `src/*`
- SVG files handled by @svgr/webpack for React components

### Database Operations
- All database functions return promises and use MongoDB native driver
- Posts have `status` field ("Published"/"Draft") for visibility control
- Automatic `createdAt`/`updatedAt` timestamps
- Complex image structures for section1_images and section2_images

### Security Considerations
- Admin routes protected by authentication middleware
- Image uploads handled through Cloudinary with signature verification
- Environment variables for sensitive configuration

### Content Structure
Posts contain:
- Basic metadata (title, description, tags)
- Two image sections with different structures
- Category association
- SEO-friendly URL slugs
- Publication status

When working with this codebase, always check authentication for admin operations and use the appropriate data access functions based on whether you're in admin or public context.