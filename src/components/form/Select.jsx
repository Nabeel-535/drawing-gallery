"use client";
import React from "react";

export default function Select({
  options,
  value,
  onChange,
  placeholder,
  className,
}) {
  return (
    <select
      value={value}
      onChange={onChange}
      className={`block w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90 dark:focus:border-primary-500 ${className}`}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}