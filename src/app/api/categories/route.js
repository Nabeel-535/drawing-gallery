import { NextResponse } from 'next/server';
import { getCategories, createCategory } from '@/lib/models';

// GET /api/categories - Get all categories
export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST /api/categories - Create a new category
export async function POST(request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.name.trim()) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }
    
    // Validate custom_url if provided
    if (data.custom_url && !/^[a-z0-9-]+$/.test(data.custom_url)) {
      return NextResponse.json(
        { error: 'Custom URL can only contain lowercase letters, numbers, and hyphens' },
        { status: 400 }
      );
    }
    
    // Prepare category data with new fields
    const categoryData = {
      name: data.name.trim(),
      thumbnail: data.thumbnail || '',
      short_description: data.short_description || '',
      long_description: data.long_description || '',
      custom_url: data.custom_url || '',
      keyword: data.keyword || ''
    };
    
    const result = await createCategory(categoryData);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}