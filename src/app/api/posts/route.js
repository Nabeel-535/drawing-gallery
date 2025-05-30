import { NextResponse } from 'next/server';
import { getPostsWithCategory, getPostByIdWithCategory, createPost } from '@/lib/models';

// GET /api/posts - Get all posts
export async function GET() {
  try {
    const posts = await getPostsWithCategory();
    return NextResponse.json({ 
      success: true,
      posts: posts 
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch posts' 
      },
      { status: 500 }
    );
  }
}

// POST /api/posts - Create a new post
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
    
    const result = await createPost(data);
    
    // Get the created post with its slug
    const createdPost = await getPostByIdWithCategory(result.insertedId);
    
    return NextResponse.json({ 
      success: true,
      result: result,
      post: createdPost
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to create post' 
      },
      { status: 500 }
    );
  }
}