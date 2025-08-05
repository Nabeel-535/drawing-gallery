import { Metadata } from 'next';
import PostClient from '@/components/PostClient';
import { getPostsWithCategory, getPostBySlugWithCategory } from '@/lib/models';
import { notFound } from 'next/navigation';

// Configuration for build optimization
const BUILD_CONFIG = {
  // Number of most recent posts to generate statically at build time
  // Set to 0 to disable static generation entirely and rely on ISR
  STATIC_PAGES_LIMIT: 500, // Reduced from 50 to 10
  
  // Timeout for API calls during build (in milliseconds)
  POST_FETCH_TIMEOUT: 5000,  // Reduced from 10000 to 5000
  POSTS_FETCH_TIMEOUT: 8000, // Reduced from 15000 to 8000
  
  // Disable static generation entirely (set to true if still having issues)
  DISABLE_STATIC_GENERATION: false, // Changed to true to eliminate build timeouts
};

// Helper function to serialize MongoDB objects to plain objects
function serializePost(post) {
  if (!post) return null;
  
  return {
    ...post,
    _id: post._id.toString(),
    categoryId: post.categoryId?.toString() || null,
    createdAt: post.createdAt?.toISOString() || null,
    updatedAt: post.updatedAt?.toISOString() || null,
    category: post.category ? {
      ...post.category,
      _id: post.category._id.toString(),
      createdAt: post.category.createdAt?.toISOString() || null,
      updatedAt: post.category.updatedAt?.toISOString() || null,
    } : null,
    section1_images: post.section1_images?.map(img => ({
      ...img,
      _id: img._id?.toString() || null,
    })) || [],
    section2_images: post.section2_images?.map(img => ({
      ...img,
      _id: img._id?.toString() || null,
    })) || [],
  };
}

// ISR - Revalidate every 3600 seconds (1 hour)
export const revalidate = 3600;

// Allow fallback rendering for pages not generated at build time
export const dynamicParams = true;

// Use direct database access for build-time data fetching
async function getPost(slug) {
  try {
    // During build time, call the database directly instead of making HTTP requests
    const post = await getPostBySlugWithCategory(slug);
    return post;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

// Use direct database access for build-time posts fetching
async function getAllPosts() {
  try {
    // During build time, call the database directly instead of making HTTP requests
    const posts = await getPostsWithCategory();
    return posts;
  } catch (error) {
    console.error('Error fetching posts for static generation:', error);
    return [];
  }
}

// SSG - Pre-generate static pages for only the most recent posts to avoid timeouts
export async function generateStaticParams() {
  // If static generation is disabled, return empty array
  if (BUILD_CONFIG.DISABLE_STATIC_GENERATION) {
    console.log('Static generation disabled - all pages will be generated on-demand with ISR');
    return [];
  }
  
  // If limit is 0, return empty array
  if (BUILD_CONFIG.STATIC_PAGES_LIMIT === 0) {
    console.log('Static pages limit set to 0 - all pages will be generated on-demand with ISR');
    return [];
  }
  
  try {
    const posts = await getAllPosts();
    
    if (!posts || posts.length === 0) {
      console.warn('No posts found for static generation');
      return [];
    }
    
    // Only generate static pages for the most recent posts to avoid build timeouts
    // The rest will be generated on-demand with ISR
    const recentPosts = posts
      .filter(post => post.url_slug) // Ensure post has a slug
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort by newest first
      .slice(0, BUILD_CONFIG.STATIC_PAGES_LIMIT); // Limit to prevent build timeouts
    
    const params = recentPosts.map((post) => ({
      slug: post.url_slug
    }));
    
    console.log(`Generated ${params.length} static params for posts (limited to ${BUILD_CONFIG.STATIC_PAGES_LIMIT} to prevent build timeouts)`);
    return params;
  } catch (error) {
    console.error('Error generating static params:', error);
    console.log('Falling back to on-demand generation for all posts');
    return [];
  }
}

export async function generateMetadata({ params }) {
  // Ensure params is properly resolved
  const resolvedParams = await Promise.resolve(params);
  const post = await getPost(resolvedParams.slug);

  
  if (!post) {
    return {
      title: 'Post Not Found | Drawing Gallery',
      description: 'The requested post could not be found.',
      robots: {
        index: false,
        follow: false
      }
    };
  }

  return {
    title: `${post.title} | Drawing Gallery`,
    description: post.content || `Learn how to draw ${post.title} step by step with our detailed guide and downloadable resources.`,
    keywords: [
      `how to draw ${post.title}`,
      'drawing tutorial',
      'art tutorial',
      post.category?.name,
      'drawing guide',
      'step by step drawing',
      'coloring page',
      'printable',
      ...(post.tags || []),
      ...(post.keywords ? post.keywords.split(',').map(k => k.trim()).filter(k => k.length > 0) : [])
    ].filter(Boolean),
    openGraph: {
      title: post.title,
      description: post.content || `Learn how to draw ${post.title} step by step`,
      images: [{
        url: post.featuredImage,
        width: 1200,
        height: 630,
        alt: post.title
      }]
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.title} | Drawing Gallery`,
      description: post.description || `Learn how to draw ${post.title} step by step`,
      images: [post.featuredImage]
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    }
  };
}

export default async function SlugPage({ params }) {
  // Resolve params and check if it's a post
  const resolvedParams = await Promise.resolve(params);
  const { slug } = resolvedParams;
  
  // Try to find a post with this slug
  const post = await getPost(slug);
  
  if (post) {
    // It's a post - render the post page
    const serializedPost = serializePost(post);
    return <PostClient params={Promise.resolve({ id: slug })} initialPost={serializedPost} />;
  }
  
  // Post not found - 404
  notFound();
}