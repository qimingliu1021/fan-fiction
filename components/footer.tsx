"use client";

import React from "react";
import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-b from-slate-900 via-amber-900/50 to-red-900/50">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-red-400">
                Destiny Lens
              </h2>
              <span className="ml-3 text-2xl">☯</span>
            </div>
            <p className="text-amber-200 text-lg leading-relaxed mb-6">
              The #1 platform for discovering your destined city through ancient
              Chinese wisdom and modern AI technology.
            </p>
            <p className="text-amber-300/80 text-sm leading-relaxed mb-6">
              Combining the timeless insights of I Ching and Classic of
              Mountains and Seas with cutting-edge algorithms to guide your
              journey to belonging.
            </p>

            {/* Social Links */}
            <div className="flex space-x-4">
              <Link
                href="#"
                className="w-10 h-10 bg-gradient-to-r from-amber-600 to-red-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300"
              >
                <span className="text-white text-lg">🐉</span>
              </Link>
              <Link
                href="#"
                className="w-10 h-10 bg-gradient-to-r from-red-600 to-amber-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300"
              >
                <span className="text-white text-lg">🔮</span>
              </Link>
              <Link
                href="#"
                className="w-10 h-10 bg-gradient-to-r from-amber-600 to-red-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300"
              >
                <span className="text-white text-lg">🏮</span>
              </Link>
            </div>
          </div>

          {/* About */}
          <div>
            <h3 className="text-amber-300 font-serif text-lg mb-6">About</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#"
                  className="text-amber-200/80 hover:text-amber-100 transition-colors duration-300"
                >
                  Our Story
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-amber-200/80 hover:text-amber-100 transition-colors duration-300"
                >
                  Team
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-amber-200/80 hover:text-amber-100 transition-colors duration-300"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-amber-200/80 hover:text-amber-100 transition-colors duration-300"
                >
                  Press
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-amber-300 font-serif text-lg mb-6">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#"
                  className="text-amber-200/80 hover:text-amber-100 transition-colors duration-300"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-amber-200/80 hover:text-amber-100 transition-colors duration-300"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-amber-200/80 hover:text-amber-100 transition-colors duration-300"
                >
                  Community
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-amber-200/80 hover:text-amber-100 transition-colors duration-300"
                >
                  Feedback
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-amber-300 font-serif text-lg mb-6">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#"
                  className="text-amber-200/80 hover:text-amber-100 transition-colors duration-300"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-amber-200/80 hover:text-amber-100 transition-colors duration-300"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-amber-200/80 hover:text-amber-100 transition-colors duration-300"
                >
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-amber-200/80 hover:text-amber-100 transition-colors duration-300"
                >
                  GDPR
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center text-amber-200/70 text-sm mb-4 md:mb-0">
              <span>© 2025 Destiny Lens Inc. All rights reserved.</span>
              <span className="mx-2">•</span>
              <span>Powered by Ancient Wisdom & Modern AI</span>
            </div>

            <div className="flex items-center space-x-6 text-sm">
              <span className="text-amber-300/70">Made with</span>
              <div className="flex items-center space-x-2">
                <span className="text-red-400">❤️</span>
                <span className="text-amber-300/70">and</span>
                <span className="text-amber-400">☯</span>
                <span className="text-amber-300/70">
                  for seekers everywhere
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Mystical Elements */}
      <div className="absolute bottom-4 right-4 opacity-20 pointer-events-none">
        <div className="text-4xl ancient-runes">☰</div>
      </div>
      <div className="absolute bottom-8 left-8 opacity-20 pointer-events-none">
        <div
          className="text-3xl ancient-runes"
          style={{ animationDelay: "1s" }}
        >
          ☷
        </div>
      </div>
    </footer>
  );
};

export default Footer;
