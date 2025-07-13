import { NextResponse } from 'next/server';
import { getCategoryByCustomUrl } from '@/lib/models';

// GET /api/categories/slug/[slug] - Get a category by custom URL
export async function GET(request, { params }) {
  try {
    const { slug } = await Promise.resolve(params);
    
    if (!slug) {
      return NextResponse.json(
        { error: 'Slug parameter is required' },
        { status: 400 }
      );
    }
    
    const category = await getCategoryByCustomUrl(slug);
    
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(category);
  } catch (error) {
    console.error('Error fetching category by slug:', error);
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    );
  }
} 