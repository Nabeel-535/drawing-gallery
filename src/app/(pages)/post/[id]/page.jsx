import { Metadata } from 'next';
import PostClient from '@/components/PostClient';

async function getPost(slug) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
    const response = await fetch(`${apiUrl}/api/posts/slug/${slug}`);
    const data = await response.json();
    return data.success ? data.post : null;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  // Ensure params is properly resolved
  const resolvedParams = await Promise.resolve(params);
  const post = await getPost(resolvedParams.id);

  
  if (!post) {
    return {
      title: 'Post Not Found | Drawing Gallery',
      description: 'The requested post could not be found.'
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
      ...(post.tags || [])
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
      title: post.title,
      description: post.description || `Learn how to draw ${post.title} step by step`,
      images: [post.featuredImage]
    },
    robots: {
      index: true,
      follow: true
    }
  };
}

export default function PostDetailPage({ params }) {
  return <PostClient params={Promise.resolve(params)} />;
}