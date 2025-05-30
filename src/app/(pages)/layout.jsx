"use client";

import { ThemeProvider } from "@/context/ThemeContext";
import Header from "@/components/header/Header";
import Footer from "@/components/Footer";
import React from "react";
import './style.css'

export default function PagesLayout({ children }) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <ThemeProvider>
        <Header />
        <main className="relative">{children}</main>
        <Footer />
      </ThemeProvider>
    </div>
  );
}