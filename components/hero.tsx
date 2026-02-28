"use client";

import Link from "next/link";
import { Sparkles, Compass, Star } from "lucide-react";

export function Hero() {
  return (
    <div className="flex flex-col gap-16 items-center py-16">
      {/* Main Hero Section */}
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center gap-4 mb-8">
          <Star className="text-purple-500 animate-pulse" size={32} />
          <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
            Destiny Lens
          </h1>
          <Compass className="text-indigo-500 animate-pulse" size={32} />
        </div>

        <p className="text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Discover your path through ancient I Ching wisdom and modern insights.
          Uncover your destiny city and life guidance through the timeless art
          of hexagram divination.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
          <Link
            href="/coin-tossing"
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-lg group"
          >
            <Sparkles className="group-hover:animate-spin" size={20} />
            Start Your Journey
          </Link>

          <Link
            href="/faq"
            className="flex items-center gap-2 border-2 border-purple-200 text-purple-600 px-8 py-4 rounded-xl hover:bg-purple-50 transition-colors font-semibold text-lg"
          >
            Learn More
          </Link>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-xl border border-purple-100 hover:shadow-lg transition-shadow">
          <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <Sparkles className="text-purple-600" size={24} />
          </div>
          <h3 className="text-xl font-semibold text-purple-700 mb-3">
            Ancient Wisdom
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Tap into 3,000 years of I Ching wisdom with authentic coin
            divination and hexagram interpretation.
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-teal-50 p-8 rounded-xl border border-blue-100 hover:shadow-lg transition-shadow">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <Compass className="text-blue-600" size={24} />
          </div>
          <h3 className="text-xl font-semibold text-blue-700 mb-3">
            City Guidance
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Discover your destiny city through trigram analysis and energetic
            alignment with your life path.
          </p>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-xl border border-indigo-100 hover:shadow-lg transition-shadow">
          <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <Star className="text-indigo-600" size={24} />
          </div>
          <h3 className="text-xl font-semibold text-indigo-700 mb-3">
            Personal Journey
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Get personalized insights, video summaries, and actionable guidance
            for your unique life situation.
          </p>
        </div>
      </div>

      {/* Decorative separator */}
      <div className="w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent"></div>
    </div>
  );
}
