'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

// Dynamically import MDEditor to avoid SSR issues
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { 
  ssr: false,
  loading: () => <div className="h-32 bg-gray-100 rounded-md animate-pulse" />
});

const RichTextEditor = ({ 
  value = '', 
  onChange, 
  placeholder = 'Enter your content here...', 
  className = '',
  disabled = false,
  error = false,
  hint = ''
}) => {
  const [editorValue, setEditorValue] = useState(value);

  useEffect(() => {
    setEditorValue(value);
  }, [value]);

  const handleChange = (val) => {
    setEditorValue(val || '');
    if (onChange) {
      onChange(val || '');
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div 
        className={`
          border !text-black rounded-lg overflow-hidden rich-text-editor-wrapper
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <div className="rich-text-editor-container">
          <div style={{ color: '#000000', backgroundColor: 'white' }}>
            <MDEditor
              value={editorValue}
              onChange={handleChange}
              placeholder={placeholder}
              preview="edit"
              hideToolbar={disabled}
              data-color-mode="light"
              height={200}
              style={{
                backgroundColor: 'transparent',
                color: '#000000',
              }}
            />
          </div>
        </div>
      </div>
      
      {hint && (
        <p className={`mt-1 text-sm ${error ? 'text-red-500' : 'text-gray-500'}`}>
          {hint}
        </p>
      )}
      
      <style jsx global>{`
        /* Wrapper styles */
        .rich-text-editor-wrapper {
          position: relative;
        }
        
        .rich-text-editor-container {
          position: relative;
          z-index: 1;
        }
        
        /* Reset and base styles */
        .w-md-editor {
          background-color: transparent !important;
          border: none !important;
          border-radius: 0 !important;
        }
        
        .w-md-editor * {
          box-sizing: border-box !important;
        }
        
        .w-md-editor.w-md-editor-focus {
          border: none !important;
          box-shadow: none !important;
        }
        
        /* Toolbar styles */
        .w-md-editor-toolbar {
          background-color: #f9fafb !important;
          border-bottom: 1px solid #e5e7eb !important;
          border-radius: 0.5rem 0.5rem 0 0 !important;
          padding: 8px 12px !important;
        }
        
        .w-md-editor-toolbar ul {
          margin: 0 !important;
          padding: 0 !important;
        }
        
        .w-md-editor-toolbar ul li {
          margin: 0 2px !important;
        }
        
        .w-md-editor-toolbar ul li button {
          color: #4b5563 !important;
          background-color: transparent !important;
          border: none !important;
          padding: 4px 6px !important;
          border-radius: 4px !important;
          font-size: 14px !important;
        }
        
        .w-md-editor-toolbar ul li button:hover {
          background-color: #e5e7eb !important;
          color: #1f2937 !important;
        }
        
        .w-md-editor-toolbar ul li button.active {
          background-color: #dbeafe !important;
          color: #1d4ed8 !important;
        }
        
        /* Editor text area styles */
        .rich-text-editor-container .w-md-editor-text-textarea,
        .rich-text-editor-container .w-md-editor-text-input,
        .rich-text-editor-container .w-md-editor-text,
        .rich-text-editor-container .w-md-editor-text-area,
        .w-md-editor-text-textarea,
        .w-md-editor-text-input,
        .w-md-editor-text,
        .w-md-editor-text-area {
          background-color: white !important;
          color: #1f2937 !important;
          font-size: 14px !important;
          line-height: 1.6 !important;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
          padding: 12px !important;
          border: none !important;
          outline: none !important;
          resize: none !important;
        }
        
        /* Placeholder styling */
        .w-md-editor-text-textarea::placeholder,
        .w-md-editor-text-input::placeholder {
          color: #9ca3af !important;
          opacity: 1 !important;
        }
        
        /* Container and wrapper styles */
        .w-md-editor-text-container,
        .w-md-editor-text {
          background-color: white !important;
          border-radius: 0 0 0.5rem 0.5rem !important;
        }
        
        /* Focus states */
        .w-md-editor-text-textarea:focus,
        .w-md-editor-text-input:focus {
          outline: none !important;
          box-shadow: none !important;
        }
        
        /* Scrollbar styling */
        .w-md-editor-text-textarea::-webkit-scrollbar {
          width: 8px !important;
        }
        
        .w-md-editor-text-textarea::-webkit-scrollbar-track {
          background: #f1f5f9 !important;
        }
        
        .w-md-editor-text-textarea::-webkit-scrollbar-thumb {
          background: #cbd5e1 !important;
          border-radius: 4px !important;
        }
        
        .w-md-editor-text-textarea::-webkit-scrollbar-thumb:hover {
          background: #94a3b8 !important;
        }
        
        /* Override any conflicting Tailwind styles */
        .rich-text-editor-container .w-md-editor-text-textarea,
        .rich-text-editor-container .w-md-editor-text-input,
        .w-md-editor-text-textarea,
        .w-md-editor-text-input {
          border-radius: 0 !important;
          box-shadow: none !important;
          border: none !important;
          background-color: white !important;
          color: #1f2937 !important;
        }
        
        /* Ensure proper text selection */
        .rich-text-editor-container .w-md-editor-text-textarea::selection,
        .rich-text-editor-container .w-md-editor-text-input::selection,
        .w-md-editor-text-textarea::selection,
        .w-md-editor-text-input::selection {
          background-color: #3b82f6 !important;
          color: white !important;
        }
        
        /* Additional specificity for text color */
        .rich-text-editor-container textarea,
        .rich-text-editor-container input[type="text"] {
          color: #1f2937 !important;
          background-color: white !important;
        }
        
        /* Force text color with highest specificity */
        .rich-text-editor-wrapper .w-md-editor *,
        .rich-text-editor-wrapper .w-md-editor textarea,
        .rich-text-editor-wrapper .w-md-editor input,
        .rich-text-editor-wrapper textarea,
        .rich-text-editor-wrapper input {
          color: #000000 !important;
          background-color: white !important;
        }
        
        /* Target all possible text elements */
        .rich-text-editor-wrapper .w-md-editor-text-textarea,
        .rich-text-editor-wrapper .w-md-editor-text-input,
        .rich-text-editor-wrapper .w-md-editor-text,
        .rich-text-editor-wrapper .w-md-editor-text-area,
        .rich-text-editor-wrapper .w-md-editor-text-container textarea,
        .rich-text-editor-wrapper .w-md-editor-text-container input {
          color: #000000 !important;
          background-color: #ffffff !important;
        }
        
        /* Override any inherited styles */
        .rich-text-editor-wrapper * {
          color: inherit !important;
        }
        
        /* Specifically target the editor content */
        .rich-text-editor-wrapper .w-md-editor-text-textarea,
        .rich-text-editor-wrapper .w-md-editor-text-input {
          color: #000000 !important;
          background-color: #ffffff !important;
          caret-color: #000000 !important;
        }
        
        /* Override Tailwind's text color utilities */
        .rich-text-editor-wrapper .text-white,
        .rich-text-editor-wrapper .text-gray-100,
        .rich-text-editor-wrapper .text-gray-200,
        .rich-text-editor-wrapper .text-gray-300,
        .rich-text-editor-wrapper .text-gray-400,
        .rich-text-editor-wrapper .text-gray-500 {
          color: #000000 !important;
        }
        
        /* Nuclear option - force all text to be black */
        .rich-text-editor-wrapper,
        .rich-text-editor-wrapper *,
        .rich-text-editor-wrapper *:before,
        .rich-text-editor-wrapper *:after {
          color: #000000 !important;
        }
        
        /* Except for the toolbar buttons */
        .rich-text-editor-wrapper .w-md-editor-toolbar,
        .rich-text-editor-wrapper .w-md-editor-toolbar *,
        .rich-text-editor-wrapper .w-md-editor-toolbar button {
          color: #4b5563 !important;
        }
        
        /* Force textarea and input elements specifically */
        .rich-text-editor-wrapper textarea,
        .rich-text-editor-wrapper input[type="text"],
        .rich-text-editor-wrapper input,
        .rich-text-editor-wrapper [contenteditable] {
          color: #000000 !important;
          background-color: #ffffff !important;
          -webkit-text-fill-color: #000000 !important;
        }
        
        /* Override any CSS custom properties */
        .rich-text-editor-wrapper {
          --tw-text-opacity: 1 !important;
          color: rgb(0 0 0 / var(--tw-text-opacity)) !important;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor; 