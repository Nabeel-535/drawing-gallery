"use client";

import { useRef } from 'react';

export default function RequestDrawingButton() {
  const hiddenButtonRef = useRef(null);

  const handleClick = () => {
    // If there's a hidden request button elsewhere, click it
    // Otherwise, this button can handle the request directly
    const requestBtn = document.querySelector('#request-drawing-btn');
    if (requestBtn) {
      requestBtn.click();
    } else {
      // Handle request drawing functionality directly
      // This avoids the need for DOM queries
      console.log('Request drawing functionality would be implemented here');
    }
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center justify-center space-x-2 px-8 py-4 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 hover:shadow-xl hover:scale-105 transition-all duration-200"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
      <span>Request Now</span>
    </button>
  );
}