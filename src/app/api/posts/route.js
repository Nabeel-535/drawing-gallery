import { NextResponse } from 'next/server';
import { getPostsWithCategory, getPostByIdWithCategoryAdmin, createPost, getPostsWithCategoryPaginated } from '@/lib/models';

// GET /api/posts - Get all published posts with pagination support
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Check if pagination is requested
    const page = searchParams.get('page');
    const limit = searchParams.get('limit');
    const sort = searchParams.get('sort');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    
    // If no pagination params, return all posts (backward compatibility)
    if (!page && !limit) {
      const posts = await getPostsWithCategory();
      return NextResponse.json({ 
        success: true,
        posts: posts 
      });
    }
    
    // Use paginated function
    const result = await getPostsWithCategoryPaginated({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
      sort: sort || 'newest',
      category: category || 'all',
      search: search || ''
    });
    
    return NextResponse.json({ 
      success: true,
      posts: result.posts,
      totalPages: result.pagination.totalPages,
      totalPosts: result.pagination.totalPosts,
      currentPage: result.pagination.currentPage,
      hasNextPage: result.pagination.hasNextPage,
      hasPrevPage: result.pagination.hasPrevPage
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