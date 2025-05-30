import { NextResponse } from 'next/server';
import { getPostById, getPostByIdWithCategory, updatePost, deletePost } from '@/lib/models';

// GET /api/posts/[id] - Get a specific post
export async function GET({ params }) {
  try {
    const post = await getPostByIdWithCategory(params.id);
    
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
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch post' 
      },
      { status: 500 }
    );
  }
}

// PUT /api/posts/[id] - Update a post
export async function PUT(request, { params }) {
  try {
    const data = await request.json();
    
    // Check if post exists
    const existingPost = await getPostById(params.id);
    if (!existingPost) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Post not found' 
        },
        { status: 404 }
      );
    }
    
    const result = await updatePost(params.id, data);
    return NextResponse.json({
      success: true,
      result: result
    });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to update post' 
      },
      { status: 500 }
    );
  }
}

// DELETE /api/posts/[id] - Delete a post
export async function DELETE(request, { params }) {
  try {
    // Check if post exists
    const existingPost = await getPostById(params.id);
    if (!existingPost) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Post not found' 
        },
        { status: 404 }
      );
    }
    
    const result = await deletePost(params.id);
    return NextResponse.json({
      success: true,
      result: result
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to delete post' 
      },
      { status: 500 }
    );
  }
}