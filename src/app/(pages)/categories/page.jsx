import { Metadata } from 'next';
import CategoriesClient from './CategoriesClient';

export const metadata = {
  title: 'Browse Drawing Categories | Drawing Gallery',
  description: 'Explore our collection of drawing tutorials and coloring pages organized by categories. Find step-by-step guides, tips, and downloadable content for artists of all levels.',
  keywords: 'drawing tutorials, art categories, coloring pages, drawing lessons, art instruction, drawing guides',
  openGraph: {
    title: 'Browse Drawing Categories | Drawing Gallery',
    description: 'Explore our collection of drawing tutorials and coloring pages organized by categories. Find step-by-step guides, tips, and downloadable content for artists of all levels.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Drawing Gallery'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Browse Drawing Categories | Drawing Gallery',
    description: 'Explore our collection of drawing tutorials and coloring pages organized by categories. Find step-by-step guides, tips, and downloadable content for artists of all levels.'
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function CategoriesPage() {
  return <CategoriesClient />;
}