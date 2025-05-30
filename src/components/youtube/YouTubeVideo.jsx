'use client';

import { useEffect, useState } from 'react';

export default function YouTubeVideo() {
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVideoUrl();
  }, []);

  const fetchVideoUrl = async () => {
    try {
      const response = await fetch('/api/youtube');
      const data = await response.json();
      if (data.videoUrl) {
        setVideoUrl(data.videoUrl);
      }
    } catch (err) {
      setError('Failed to load video');
    } finally {
      setLoading(false);
    }
  };

  // Extract video ID from YouTube URL
  const getVideoId = (url) => {
    if (!url) return null;
    
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    
    return (match && match[2].length === 11) ? match[2] : null;
  };

  if (loading) {
    return (
      <div className="relative w-full h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl bg-gray-100">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500"></div>
        </div>
      </div>
    );
  }

  if (error || !videoUrl) {
    return (
      <div className="relative w-full h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl bg-gray-100">
        <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-orange-500 opacity-90"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <svg className="w-32 h-32 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            <h3 className="text-2xl font-bold mb-2">Latest Drawing Tutorial</h3>
            <p className="text-lg opacity-90">Watch our newest step-by-step guide</p>
          </div>
        </div>
      </div>
    );
  }

  const videoId = getVideoId(videoUrl);
  
  return (
    <div className="relative w-full h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
      <iframe
        className="absolute inset-0 w-full h-full"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
      
      {/* Floating Elements */}
      <div className="absolute -top-4 -right-4 w-20 h-20 bg-yellow-400 rounded-full opacity-80 animate-bounce flex items-center justify-center pointer-events-none">
        <span className="text-2xl">🎨</span>
      </div>
      <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-pink-400 rounded-full opacity-80 animate-pulse flex items-center justify-center pointer-events-none">
        <span className="text-xl">✏️</span>
      </div>
      <div className="absolute top-1/2 -left-8 w-12 h-12 bg-green-400 rounded-full opacity-80 animate-ping flex items-center justify-center pointer-events-none">
        <span className="text-lg">🖍️</span>
      </div>
    </div>
  );
}