"use client";
import React from "react";

export default function Label({ children, className }) {
  return (
    <label className={`block text-sm font-medium text-gray-800 dark:text-white/90 ${className}`}>
      {children}
    </label>
  );
}