import { NextResponse } from 'next/server';
import { getPostsByCategory, getCategoryById } from '@/lib/models';

// GET /api/categories/[id]/posts - Get all posts for a specific category
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
    
    const posts = await getPostsByCategory(resolvedParams.id);
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts by category:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts for this category' },
      { status: 500 }
    );
  }
}