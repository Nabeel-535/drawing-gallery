"use client";
import React from "react";

export default function AvatarText({ text, size, className }) {
  const getSize = () => {
    switch (size) {
      case "xs":
        return "h-6 w-6 text-xs";
      case "sm":
        return "h-8 w-8 text-sm";
      case "md":
        return "h-10 w-10 text-base";
      case "lg":
        return "h-12 w-12 text-lg";
      case "xl":
        return "h-14 w-14 text-xl";
      case "2xl":
        return "h-16 w-16 text-2xl";
      default:
        return "h-10 w-10 text-base";
    }
  };

  const getInitials = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-500 ${getSize()} ${className}`}
    >
      {getInitials(text)}
    </div>
  );
}