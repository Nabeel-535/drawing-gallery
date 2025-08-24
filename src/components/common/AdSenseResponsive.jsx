'use client';

import AdSense from './AdSense';

export default function AdSenseResponsive({ adSlot, className = '' }) {
  return (
    <AdSense
      adSlot={adSlot}
      adFormat="auto"
      fullWidthResponsive={true}
      className={`responsive-ad ${className}`}
      style={{
        display: 'block',
        minHeight: '100px',
        width: '100%'
      }}
    />
  );
}