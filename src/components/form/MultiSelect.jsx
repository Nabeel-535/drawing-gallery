"use client";
import React, { useState } from "react";

export default function MultiSelect({
  options,
  selectedValues,
  onChange,
  placeholder,
  className,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (value) => {
    const newSelectedValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];
    onChange(newSelectedValues);
  };

  return (
    <div className="relative">
      <div
        className={`flex min-h-[46px] w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-800 outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90 dark:focus:border-primary-500 ${className}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-wrap gap-2">
          {selectedValues.length > 0 ? (
            selectedValues.map((value) => (
              <span
                key={value}
                className="inline-flex items-center rounded-md bg-primary-50 px-2 py-1 text-xs font-medium text-primary-600 dark:bg-primary-500/10 dark:text-primary-500"
              >
                {options.find((option) => option.value === value)?.label}
              </span>
            ))
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </div>
        <svg
          className="h-5 w-5 text-gray-400"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
        >
          <path
            d="M7 7l3-3 3 3m0 6l-3 3-3-3"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          {options.map((option) => (
            <div
              key={option.value}
              className={`flex cursor-pointer items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700/50 ${selectedValues.includes(option.value) ? "text-primary-500" : "text-gray-800 dark:text-white/90"}`}
              onClick={() => handleOptionClick(option.value)}
            >
              <input
                type="checkbox"
                className="mr-3 h-4 w-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-primary-500"
                checked={selectedValues.includes(option.value)}
                onChange={() => {}}
              />
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}