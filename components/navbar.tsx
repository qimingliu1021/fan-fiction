"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-900/95 via-amber-900/95 to-red-900/95 backdrop-blur-md border-b border-amber-500/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-red-400 group-hover:from-amber-200 group-hover:to-red-300 transition-all duration-300">
              Destiny Lens
            </h1>
            <span className="text-xl animate-pulse">☯</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/blog"
              className="text-amber-200 hover:text-amber-100 transition-colors duration-300 font-medium"
            >
              Blog
            </Link>
            <Link
              href="/about"
              className="text-amber-200 hover:text-amber-100 transition-colors duration-300 font-medium"
            >
              About
            </Link>
            <Link
              href="/faq"
              className="text-amber-200 hover:text-amber-100 transition-colors duration-300 font-medium"
            >
              FAQ
            </Link>
            <Link
              href="/support"
              className="text-amber-200 hover:text-amber-100 transition-colors duration-300 font-medium"
            >
              Support
            </Link>

            {/* Get Started Button */}
            <Button
              asChild
              className="bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-700 hover:to-red-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Link href="/coin-tossing">Get Started</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-amber-300 hover:text-amber-100 transition-colors duration-300"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-amber-500/20">
            <div className="flex flex-col space-y-4">
              <Link
                href="/coin-tossing"
                className="text-amber-200 hover:text-amber-100 transition-colors duration-300 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Start Divination
              </Link>
              <Link
                href="/blog"
                className="text-amber-200 hover:text-amber-100 transition-colors duration-300 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                href="/about"
                className="text-amber-200 hover:text-amber-100 transition-colors duration-300 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/faq"
                className="text-amber-200 hover:text-amber-100 transition-colors duration-300 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                FAQ
              </Link>
              <Link
                href="/support"
                className="text-amber-200 hover:text-amber-100 transition-colors duration-300 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Support
              </Link>
              <Button
                asChild
                className="bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-700 hover:to-red-700 text-white px-6 py-2 rounded-lg font-medium w-fit"
              >
                <Link href="/coin-tossing" onClick={() => setIsMenuOpen(false)}>
                  Get Started
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
