import { getPostsWithCategory } from '@/lib/models';

export const revalidate = 60;
export const dynamic = 'force-dynamic';

export default async function sitemap() {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  try {
    // Use direct database access instead of HTTP requests
    const posts = await getPostsWithCategory();
    
    if (!posts || posts.length === 0) {
      console.warn('No posts found for sitemap generation');
      return staticPages;
    }
    
    // Generate sitemap entries for posts
    const postPages = posts
      .filter(post => post.url_slug) // Ensure post has a slug
      .map((post) => ({
        url: `${baseUrl}/${post.url_slug}`,
        lastModified: new Date(post.updatedAt || post.createdAt),
        changeFrequency: 'monthly',
        priority: 0.7,
      }));

    console.log(`Generated sitemap with ${postPages.length} post URLs`);
    return [...staticPages, ...postPages];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    console.log('Falling back to static pages only');
    // Return only static pages if there's an error
    return staticPages;
  }
} 
