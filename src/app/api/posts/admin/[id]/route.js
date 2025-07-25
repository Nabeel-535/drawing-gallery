import { NextResponse } from 'next/server';
import { getPostById, getPostByIdWithCategoryAdmin, updatePost, deletePost } from '@/lib/models';

// GET /api/posts/admin/[id] - Get a specific post including drafts (admin access)
export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const post = await getPostByIdWithCategoryAdmin(resolvedParams.id);
    
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
    console.error('Error fetching post (admin):', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch post' 
      },
      { status: 500 }
    );
  }
}

// PUT /api/posts/admin/[id] - Update a post (admin access)
export async function PUT(request, { params }) {
  try {
    const resolvedParams = await params;
    const data = await request.json();
    
    // Check if post exists
    const existingPost = await getPostById(resolvedParams.id);
    if (!existingPost) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Post not found' 
        },
        { status: 404 }
      );
    }
    
    const result = await updatePost(resolvedParams.id, data);
    return NextResponse.json({
      success: true,
      result: result
    });
  } catch (error) {
    console.error('Error updating post (admin):', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to update post' 
      },
      { status: 500 }
    );
  }
}

// DELETE /api/posts/admin/[id] - Delete a post (admin access)
export async function DELETE(request, { params }) {
  try {
    const resolvedParams = await params;
    // Check if post exists
    const existingPost = await getPostById(resolvedParams.id);
    if (!existingPost) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Post not found' 
        },
        { status: 404 }
      );
    }
    
    const result = await deletePost(resolvedParams.id);
    return NextResponse.json({
      success: true,
      result: result
    });
  } catch (error) {
    console.error('Error deleting post (admin):', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to delete post' 
      },
      { status: 500 }
    );
  }
} 