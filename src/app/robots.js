export default function robots() {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/nabeel-dashboard-gallery/',
        '/api/',
        '/admin/',
        '/_next/',
        '/temp/',
        '/signin/',
        '/signup/',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
} 