import { NextResponse } from 'next/server';
import { getCategoryById, updateCategory, deleteCategory } from '@/lib/models';

// GET /api/categories/[id] - Get a specific category
export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const category = await getCategoryById(resolvedParams.id);
    
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}

// PUT /api/categories/[id] - Update a category
export async function PUT(request, { params }) {
  try {
    const resolvedParams = await params;
    const data = await request.json();
    
    // Check if category exists
    const existingCategory = await getCategoryById(resolvedParams.id);
    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
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
    
    // Prepare update data with new fields
    const updateData = {
      name: data.name.trim(),
      thumbnail: data.thumbnail || '',
      short_description: data.short_description || '',
      long_description: data.long_description || '',
      custom_url: data.custom_url || '',
      keyword: data.keyword || ''
    };
    
    const result = await updateCategory(resolvedParams.id, updateData);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

// DELETE /api/categories/[id] - Delete a category
export async function DELETE(request, { params }) {
  try {
    const resolvedParams = await params;
    // Check if category exists
    const existingCategory = await getCategoryById(resolvedParams.id);
    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    const result = await deleteCategory(resolvedParams.id);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}