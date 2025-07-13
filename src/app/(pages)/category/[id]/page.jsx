import { notFound, redirect } from "next/navigation";
import { getCategoryById } from "@/lib/models";

export default async function CategoryByIdPage({ params }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  
  // Get category by ID
  const category = await getCategoryById(id);
  
  if (!category) {
    notFound();
  }
  
  // Redirect to the proper custom URL if available
  if (category.custom_url) {
    redirect(`/${category.custom_url}`);
  }
  
  // If no custom URL, redirect to categories page
  redirect('/categories');
} 