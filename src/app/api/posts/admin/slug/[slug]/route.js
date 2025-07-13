import { NextResponse } from 'next/server';
import { getPostBySlugWithCategoryAdmin } from '@/lib/models';

// GET /api/posts/admin/slug/[slug] - Get a specific post by slug including drafts (admin access)
export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const post = await getPostBySlugWithCategoryAdmin(resolvedParams.slug);
    
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
    console.error('Error fetching post by slug (admin):', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch post' 
      },
      { status: 500 }
    );
  }
} 