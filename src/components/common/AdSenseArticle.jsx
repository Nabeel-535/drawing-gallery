'use client';

import AdSense from './AdSense';

export default function AdSenseArticle({ adSlot, className = '' }) {
  return (
    <div className={`article-ad-container my-8 ${className}`}>
      <AdSense
        adSlot={adSlot}
        adFormat="fluid"
        fullWidthResponsive={true}
        className="article-ad"
        style={{
          display: 'block',
          textAlign: 'center'
        }}
      />
    </div>
  );
}