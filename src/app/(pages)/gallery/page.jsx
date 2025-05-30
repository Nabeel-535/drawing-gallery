import { Metadata } from 'next';
import GalleryClient from './GalleryClient';

export const metadata = {
  title: 'Drawing Gallery - Free Printable Coloring Pages & Drawing Tutorials',
  description: 'Browse our collection of free printable coloring pages and drawing tutorials. Download high-quality images perfect for kids, adults, and art enthusiasts.',
  keywords: 'coloring pages, drawing tutorials, printable art, free downloads, kids art, adult coloring, art education',
  openGraph: {
    title: 'Drawing Gallery - Free Printable Coloring Pages & Drawing Tutorials',
    description: 'Browse our collection of free printable coloring pages and drawing tutorials. Download high-quality images perfect for kids, adults, and art enthusiasts.',
    type: 'website',
    url: 'https://your-domain.com/gallery',
    images: [
      {
        url: 'https://your-domain.com/images/gallery-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Drawing Gallery Preview'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Drawing Gallery - Free Printable Coloring Pages & Drawing Tutorials',
    description: 'Browse our collection of free printable coloring pages and drawing tutorials. Download high-quality images perfect for kids, adults, and art enthusiasts.',
    images: ['https://your-domain.com/images/gallery-og.jpg']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function GalleryPage() {
  return <GalleryClient />;
}