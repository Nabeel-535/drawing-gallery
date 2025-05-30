"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const { data: session, status } = useSession();

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut({
        callbackUrl: '/signin',
        redirect: true
      });
    } catch (error) {
      console.error('Error signing out:', error);
      alert('An error occurred while signing out.');
    } finally {
      setIsSigningOut(false);
      setIsOpen(false);
    }
  };

  // Show loading state while session is loading
  if (status === "loading") {
    return (
      <div className="flex items-center gap-2 rounded-lg py-1.5 pl-1.5 pr-3 text-sm font-medium text-gray-800 dark:text-white/90">
        <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full dark:bg-gray-800">
          <span className="text-xs font-semibold text-gray-400">...</span>
        </div>
        <span>Loading...</span>
      </div>
    );
  }

  // If no session, don't render the dropdown
  if (!session) {
    return null;
  }

  const user = session.user;
  const userName = user?.name || user?.email || "User";
  const userEmail = user?.email || "";

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg py-1.5 pl-1.5 pr-3 text-sm font-medium text-gray-800 hover:bg-gray-100 dark:text-white/90 dark:hover:bg-gray-800"
      >
        <div className="flex items-center justify-center w-8 h-8 bg-primary-100 rounded-full dark:bg-primary-900/20">
          {user?.image ? (
            <Image
              src={user.image}
              alt={userName}
              width={32}
              height={32}
              className="rounded-full"
            />
          ) : (
            <span className="text-xs font-semibold text-primary-600 dark:text-primary-400">
              {userName.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <span>{userName}</span>
        <svg
          className="h-4 w-4 text-gray-400"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 6L8 10L12 6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-1 w-56 rounded-lg border border-gray-200 bg-white py-2 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {userName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {userEmail || 'Administrator'}
            </p>
          </div>

          <div className="py-2">
            <Link
              href="/nabeel-dashboard-gallery/profile"
              onClick={() => setIsOpen(false)}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                  fill="currentColor"
                />
                <path
                  d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z"
                  fill="currentColor"
                />
              </svg>
              Profile
            </Link>
          </div>

          <div className="border-t border-gray-200 px-2 py-2 dark:border-gray-700">
            <button
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-error-600 hover:bg-error-50 dark:text-error-500 dark:hover:bg-error-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16 17V14H9V10H16V7L21 12L16 17ZM14 2C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6H14V4H5V20H14V18H16V20C16 20.5304 15.7893 21.0391 15.4142 21.4142C15.0391 21.7893 14.5304 22 14 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V4C3 3.46957 3.21071 2.96086 3.58579 2.58579C3.96086 2.21071 4.46957 2 5 2H14Z"
                  fill="currentColor"
                />
              </svg>
              {isSigningOut ? 'Signing Out...' : 'Sign Out'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}