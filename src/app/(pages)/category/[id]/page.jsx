import { notFound } from "next/navigation";
import { getCategoryById, getCategoryByCustomUrl } from "@/lib/models";
import CategoryPageClient from "@/components/CategoryPageClient";

// Helper function to serialize MongoDB objects to plain objects
function serializeCategory(category) {
  if (!category) return null;
  
  return {
    ...category,
    _id: category._id.toString(),
    createdAt: category.createdAt?.toISOString() || null,
    updatedAt: category.updatedAt?.toISOString() || null,
  };
}

export default async function CategoryByIdPage({ params, searchParams }) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const { id } = resolvedParams;
  const page = parseInt(resolvedSearchParams.page) || 1;
  
  // Try to get category by ID first, then by custom URL
  let category = await getCategoryById(id);
  if (!category) {
    category = await getCategoryByCustomUrl(id);
  }
  
  if (!category) {
    notFound();
  }
  
  // Serialize the category object for client component
  const serializedCategory = serializeCategory(category);
  
  return (
    <CategoryPageClient 
      category={serializedCategory} 
      initialPage={page} 
    />
  );
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  let category = await getCategoryById(id);
  if (!category) {
    category = await getCategoryByCustomUrl(id);
  }
  
  if (!category) {
    return {
      title: 'Category Not Found',
    };
  }
  
  return {
    title: `${category.name} Coloring Page - Drawing Gallery`,
    description: category.short_description || `Browse ${category.name} coloring pages and drawing tutorials`,
    keywords: category.keyword || category.name,
    openGraph: {
      title: `${category.name} Coloring Page`,
      description: category.short_description || `Browse ${category.name} coloring pages and drawing tutorials`,
      images: category.thumbnail ? [category.thumbnail] : [],
    },
  };
} 