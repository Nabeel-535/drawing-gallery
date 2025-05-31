"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/useModal";
import RequestDrawingModal from "@/components/common/RequestDrawingModal";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { data: session } = useSession();
  const router = useRouter();
  const { isOpen, openModal, closeModal } = useModal(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/gallery?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <>
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 dark:bg-gray-900/95 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-12 h-12 flex items-center justify-center">
                <img 
                  src="/images/favicon.ico" 
                  alt="Drawing Gallery Logo" 
                  className="w-10 h-10"
                />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-[#58C0C2] to-[#49b5b7] bg-clip-text text-transparent">
                Drawing Gallery
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-red-600 transition-colors dark:text-gray-300 dark:hover:text-red-400">
                Home
              </Link>
              <Link href="/gallery" className="text-gray-700 hover:text-red-600 transition-colors dark:text-gray-300 dark:hover:text-red-400">
                Gallery
              </Link>
              <Link href="/categories" className="text-gray-700 hover:text-red-600 transition-colors dark:text-gray-300 dark:hover:text-red-400">
                Categories
              </Link>
              <Link target="_blank" href="https://www.youtube.com/@Drawing-Gallery/playlists" className="text-gray-700 hover:text-red-600 transition-colors dark:text-gray-300 dark:hover:text-red-400">
                Video Playlist
              </Link>
              <Link href="/#about" className="text-gray-700 hover:text-red-600 transition-colors dark:text-gray-300 dark:hover:text-red-400">
                About
              </Link>
            </nav>

            {/* Search Bar & Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="hidden lg:flex items-center">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by tags..."
                    className="w-64 px-4 py-2 pl-10 pr-4 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <button
                    type="submit"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <svg className="w-4 h-4 text-gray-400 hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5-5 5M6 12h12" />
                    </svg>
                  </button>
                </div>
              </form>

              {/* YouTube, Request Drawing & Auth Buttons */}
              <div className="hidden md:flex items-center space-x-4">
                <button
                  id="request-drawing-btn"
                  onClick={openModal}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  <span>Request Drawing</span>
                </button>
                <a
                  href="https://youtube.com/@Drawing-Gallery"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  <span>Subscribe</span>
                </a>
                {session ? (
                  <Link
                    href="/nabeel-dashboard-gallery"
                    className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-all duration-200"
                  >
                    Admin
                  </Link>
                ) : (
                 null
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-800">
              {/* Mobile Search Bar */}
              <form onSubmit={handleSearch} className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by tags..."
                    className="w-full px-4 py-2 pl-10 pr-4 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <button
                    type="submit"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <svg className="w-4 h-4 text-gray-400 hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5-5 5M6 12h12" />
                    </svg>
                  </button>
                </div>
              </form>

              <nav className="flex flex-col space-y-4">
                <Link href="/" className="text-gray-700 hover:text-red-600 transition-colors">
                  Home
                </Link>
                <Link href="/gallery" className="text-gray-700 hover:text-red-600 transition-colors">
                  Gallery
                </Link>
                <Link href="/categories" className="text-gray-700 hover:text-red-600 transition-colors">
                  Categories
                </Link>
                <Link href="https://www.youtube.com/@Drawing-Gallery/playlists" className="text-gray-700 hover:text-red-600 0">
                Video Playlist
              </Link>
                <Link href="/#about" className="text-gray-700 hover:text-red-600 transition-colors">
                  About
                </Link>
                <div className="pt-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
                  <button
                    onClick={openModal}
                    className="flex items-center justify-center space-x-2 w-full px-4 py-2 bg-green-600 text-white rounded-lg mb-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    <span>Request Drawing</span>
                  </button>
                  <a
                    href="https://youtube.com/@Drawing-Gallery"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    <span>Subscribe to Channel</span>
                  </a>
                  {session ? (
                    <Link
                      href="/nabeel-dashboard-gallery"
                      className="block px-4 py-2 bg-gray-800 text-white rounded-lg text-center"
                    >
                      Admin Dashboard
                    </Link>
                  ) : (
                    null
                  )}
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>
      
      {/* Request Drawing Modal */}
      <RequestDrawingModal isOpen={isOpen} onClose={closeModal} />
    </>
  );
}
