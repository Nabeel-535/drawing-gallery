'use client';

import AdSense from './AdSense';

export default function AdSenseVertical({ adSlot, className = '' }) {
  return (
    <AdSense
      adSlot={adSlot}
      adFormat="auto"
      fullWidthResponsive={true}
      className={`vertical-ad ${className}`}
      style={{
        display: 'block',
        minHeight: '250px',
        width: '100%',
        maxWidth: '300px',
        margin: '0 auto'
      }}
    />
  );
}