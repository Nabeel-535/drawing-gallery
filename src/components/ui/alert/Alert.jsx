"use client";
import React from "react";

export default function Alert({ type, message, onClose, className }) {
  const getAlertStyles = () => {
    switch (type) {
      case "success":
        return "bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-500";
      case "info":
        return "bg-blue-light-50 text-blue-light-600 dark:bg-blue-light-500/10 dark:text-blue-light-500";
      case "warning":
        return "bg-warning-50 text-warning-600 dark:bg-warning-500/10 dark:text-warning-500";
      case "error":
        return "bg-error-50 text-error-600 dark:bg-error-500/10 dark:text-error-500";
      default:
        return "bg-gray-50 text-gray-600 dark:bg-gray-700 dark:text-gray-400";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return (
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM10 14.17L16.59 7.58L18 9L10 17L6 13L7.41 11.59L10 14.17Z"
              fill="currentColor"
            />
          </svg>
        );
      case "info":
        return (
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM11 7H13V9H11V7ZM11 11H13V17H11V11Z"
              fill="currentColor"
            />
          </svg>
        );
      case "warning":
        return (
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM11 7H13V13H11V7ZM11 15H13V17H11V15Z"
              fill="currentColor"
            />
          </svg>
        );
      case "error":
        return (
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM13.59 8L12 9.59L10.41 8L9 9.41L10.59 11L9 12.59L10.41 14L12 12.41L13.59 14L15 12.59L13.41 11L15 9.41L13.59 8Z"
              fill="currentColor"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`flex items-center gap-3 rounded-lg px-4 py-3 ${getAlertStyles()} ${className}`}
      role="alert"
    >
      {getIcon()}
      <div className="flex-1">{message}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="inline-flex h-5 w-5 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5"
        >
          <svg
            className="h-3 w-3"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0.293015 0.293015C0.683495 -0.0976718 1.31666 -0.0976718 1.70714 0.293015L7.00008 5.58596L12.293 0.293015C12.6835 -0.0976718 13.3167 -0.0976718 13.7071 0.293015C14.0976 0.683495 14.0976 1.31666 13.7071 1.70714L8.41421 7.00008L13.7071 12.293C14.0976 12.6835 14.0976 1.31666 13.7071 13.7071C13.3167 14.0976 12.6835 14.0976 12.293 13.7071L7.00008 8.41421L1.70714 13.7071C1.31666 14.0976 0.683495 14.0976 0.293015 13.7071C-0.0976718 13.3167 -0.0976718 12.6835 0.293015 12.293L5.58596 7.00008L0.293015 1.70714C-0.0976718 1.31666 -0.0976718 0.683495 0.293015 0.293015Z"
              fill="currentColor"
            />
          </svg>
        </button>
      )}
    </div>
  );
}