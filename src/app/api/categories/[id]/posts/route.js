import { NextResponse } from 'next/server';
import { getPostsByCategoryPaginated, getCategoryById } from '@/lib/models';

// GET /api/categories/[id]/posts - Get all posts for a specific category with pagination
export async function GET(request, { params }) {
  try {
    // Ensure params is properly resolved
    const resolvedParams = await Promise.resolve(params);
    
    // Check if category exists
    const category = await getCategoryById(resolvedParams.id);
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    // Get pagination parameters from URL
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    
    // Validate pagination parameters
    if (page < 1) {
      return NextResponse.json(
        { error: 'Page must be greater than 0' },
        { status: 400 }
      );
    }
    
    if (limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: 'Limit must be between 1 and 100' },
        { status: 400 }
      );
    }
    
    const result = await getPostsByCategoryPaginated(resolvedParams.id, page, limit);
    
    return NextResponse.json({
      ...result,
      category: category
    });
  } catch (error) {
    console.error('Error fetching posts by category:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts for this category' },
      { status: 500 }
    );
  }
}