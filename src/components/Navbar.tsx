'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Moon, Sun, LogOut, Home, PenSquare } from 'lucide-react';
import { useState } from 'react';
import useThemeStore from '@/store/themestore';

const Navbar = () => {
  const { theme, toggleTheme } = useThemeStore();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    // Add any additional logout logic here (clear tokens, redirect, etc.)
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-2 sm:px-6 sm:py-2 lg:px-8 lg:py-2 ">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
  <Image
    src="/image.svg"
    alt="App Logo"
    width={50}
    height={50}
    priority
  />

            <div className="w-8 h-8 bg-linear-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <PenSquare className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-linear-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
              BlogPlatform
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Home className="w-4 h-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
                
                <Link
                  href="/posts/create"
                  className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <PenSquare className="w-4 h-4" />
                  <span className="hidden sm:inline">Create</span>
                </Link>

                <div className="flex items-center space-x-2 pl-4 border-l border-gray-300 dark:border-gray-600">
                  <span className="text-sm text-gray-700 dark:text-gray-300 hidden md:inline">
                    {user?.name || user?.email}
                  </span>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="btn-primary text-sm"
                >
                  Register
                </Link>
              </>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-gray-700" />
              ) : (
                <Sun className="w-5 h-5 text-yellow-400" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;