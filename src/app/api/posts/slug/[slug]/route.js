import { NextResponse } from 'next/server';
import { getPostBySlugWithCategory } from '@/lib/models';

// GET /api/posts/slug/[slug] - Get a specific post by slug
export async function GET(request, { params }) {
  try {
    const post = await getPostBySlugWithCategory(params.slug);
    
    if (!post) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Post not found' 
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      post: post
    });
  } catch (error) {
    console.error('Error fetching post by slug:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch post' 
      },
      { status: 500 }
    );
  }
} 