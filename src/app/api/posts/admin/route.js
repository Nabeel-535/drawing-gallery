import { NextResponse } from 'next/server';
import { getAllPostsWithCategoryAdmin, getPostByIdWithCategoryAdmin, createPost } from '@/lib/models';

// GET /api/posts/admin - Get all posts including drafts (admin access)
export async function GET() {
  try {
    const posts = await getAllPostsWithCategoryAdmin();
    return NextResponse.json({ 
      success: true,
      posts: posts 
    });
  } catch (error) {
    console.error('Error fetching posts (admin):', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch posts' 
      },
      { status: 500 }
    );
  }
}

// POST /api/posts/admin - Create a new post (admin access)
export async function POST(request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.title || !data.content) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Title and content are required' 
        },
        { status: 400 }
      );
    }
    
    // Set default status to draft if not provided
    if (!data.status) {
      data.status = 'Draft';
    }
    
    const result = await createPost(data);
    
    // Get the created post with its slug (using admin function to access regardless of status)
    const createdPost = await getPostByIdWithCategoryAdmin(result.insertedId);
    
    return NextResponse.json({ 
      success: true,
      result: result,
      post: createdPost
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating post (admin):', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to create post' 
      },
      { status: 500 }
    );
  }
} 