"use client";

import { useAuth } from "@/app/contexts/AuthContext";
import Link from "next/link";
import { signOut } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Navbar() {
  const { user } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-black/20 backdrop-blur-md shadow-sm border-b border-white/20 bg-transparent`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo with better contrast */}
          <Link
            href="/"
            className="text-3xl font-bold text-white drop-shadow-lg ml-[-60px]"
          >
            Yiverse
          </Link>

          {/* Navigation Links with better contrast */}
          <div className="flex items-center space-x-6"></div>
        </div>
      </div>
    </nav>
  );
}
