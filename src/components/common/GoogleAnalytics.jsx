'use client';

import useGoogleAnalytics from '@/hooks/useGoogleAnalytics';

/**
 * Component that initializes Google Analytics tracking
 * This component should be included in the app layout
 */
export default function GoogleAnalytics() {
  // The hook handles the tracking logic
  useGoogleAnalytics();
  
  // This component doesn't render anything
  return null;
}