"use client";

import { useState, useEffect } from "react";
import Link from 'next/link';

// I Ching wisdom quotes
const I_CHING_QUOTES = [
  {
    chinese: "天行健，君子以自强不息",
    english: "Heaven moves with strength, the superior person cultivates himself without ceasing",
    meaning: "Continuous self-improvement and perseverance"
  },
  {
    chinese: "地势坤，君子以厚德载物",
    english: "Earth's nature is receptive, the superior person carries all things with virtue",
    meaning: "Humility and generosity in serving others"
  },
  {
    chinese: "云雷屯，君子以经纶",
    english: "Clouds and thunder form the image of difficulty, the superior person brings order out of chaos",
    meaning: "Leadership in times of challenge"
  },
  {
    chinese: "山下出泉，蒙，君子以果行育德",
    english: "A spring wells up at the foot of the mountain, the superior person cultivates virtue through decisive action",
    meaning: "Nurturing character through action"
  },
  {
    chinese: "天与水违行，讼，君子以作事谋始",
    english: "Heaven and water move in opposite directions, the superior person plans carefully before acting",
    meaning: "Strategic planning and foresight"
  },
  {
    chinese: "地中有水，师，君子以容民畜众",
    english: "Water in the earth, the superior person gathers people and nurtures the masses",
    meaning: "Building community and leadership"
  },
  {
    chinese: "地上有水，比，君子以建万国，亲诸侯",
    english: "Water on the earth, the superior person establishes nations and unites people",
    meaning: "Unity and cooperation"
  },
  {
    chinese: "风行天上，小畜，君子以懿文德",
    english: "Wind moves across heaven, the superior person cultivates inner beauty and virtue",
    meaning: "Cultivating inner qualities"
  },
  {
    chinese: "天泽履，君子以辨上下，定民志",
    english: "Heaven above the lake, the superior person distinguishes high and low, settles the people's will",
    meaning: "Establishing order and purpose"
  },
  {
    chinese: "地天泰，君子以裁成天地之道，辅相天地之宜",
    english: "Heaven and earth in harmony, the superior person completes the way of heaven and earth, assists in their proper functioning",
    meaning: "Harmony and balance in all things"
  }
];

export default function ThankYouPage() {
  const [selectedQuote, setSelectedQuote] = useState(I_CHING_QUOTES[0]);

  // Select random quote on component mount
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * I_CHING_QUOTES.length);
    setSelectedQuote(I_CHING_QUOTES[randomIndex]);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating clouds */}
        <div className="absolute top-20 left-10 w-32 h-16 bg-white/20 rounded-full blur-sm animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-12 bg-white/30 rounded-full blur-sm animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-32 left-1/4 w-28 h-14 bg-white/25 rounded-full blur-sm animate-pulse" style={{animationDelay: '4s'}}></div>
        
        {/* Traditional patterns */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-amber-100/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-red-100/50 to-transparent"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6">
        <div className="text-center max-w-4xl mx-auto">
          
          {/* Success Icon with I Ching Elements */}
          <div className="mb-8">
            <div className="relative inline-block">
              {/* Outer ring */}
              <div className="w-32 h-32 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                {/* Inner circle */}
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                  {/* I Ching symbol - 8 trigrams simplified */}
                  <div className="text-4xl font-bold text-amber-600">☰</div>
                </div>
              </div>
              
              {/* Floating elements around the circle */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-red-400 rounded-full animate-bounce"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-orange-400 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
              <div className="absolute top-1/2 -right-6 w-4 h-4 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
            </div>
          </div>

          {/* Main Title */}
          <h2 className="text-5xl md:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-red-600">
            Welcome to the Journey
          </h2>
                    

          {/* Success Message (Wu Xing theme) */}
          <div className="mb-12 p-8 rounded-3xl border-2 shadow-xl bg-gradient-to-br from-emerald-50 via-amber-50 to-sky-50 border-emerald-200/50">
            {/* <div className="flex justify-center gap-3 mb-5">
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" title="Wood"></span>
              <span className="w-3 h-3 rounded-full bg-orange-500/80" title="Fire"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500/80" title="Earth"></span>
              <span className="w-3 h-3 rounded-full bg-zinc-400/80" title="Metal"></span>
              <span className="w-3 h-3 rounded-full bg-sky-500/80" title="Water"></span>
            </div> */}
            <p className="text-xl md:text-2xl text-gray-700 mb-2 leading-relaxed font-title">
            Thank you for joining our waitlist. <br />
            We'll contact you via email with the latest updates.
            </p>
          </div>

          {/* I Ching Wisdom Quote */}
          <div className="mb-12 p-8 bg-white/70 backdrop-blur-sm rounded-3xl border-2 border-amber-200 shadow-xl">
            <div className="mb-4">
              <span className="text-4xl">☯</span>
            </div>
            <p className="text-xl md:text-2xl text-gray-800 mb-4 font-title leading-relaxed">
              "{selectedQuote.chinese}"
            </p>
            <p className="text-lg md:text-xl text-gray-700 mb-3 italic leading-relaxed font-title">
              "{selectedQuote.english}"
            </p>
            <p className="text-sm text-amber-600 font-medium font-title">
              {selectedQuote.meaning}
            </p>
            <p className="text-xs text-gray-500 mt-3">— I Ching (Book of Changes)</p>
          </div>

          {/* What's Next Section */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 font-title">What Happens Next?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-amber-200 shadow-lg">
                <div className="text-3xl mb-3">📧</div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2 font-title">Start Exploring</h4>
                <p className="text-gray-600 text-sm font-title">We'll contact you via email when we're ready to begin your personalized energy journey</p>
              </div>
              
              <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-amber-200 shadow-lg">
                <div className="text-3xl mb-3">🔮</div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2 font-title">Future Features</h4>
                <p className="text-gray-600 text-sm font-title">Learn more about I Ching, write your journey diary, and track your energy evolution</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center items-center mb-8">
            <Link href="/">
              <button className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-lg rounded-2xl hover:from-amber-600 hover:to-orange-600 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl font-title">
                Return Home
              </button>
            </Link>
          </div>



          {/* Traditional Decorative Elements */}
          <div className="mt-16 flex justify-center space-x-8 text-amber-600/60">
            <div className="text-2xl">☯</div>
            <div className="text-2xl">☰</div>
            <div className="text-2xl">☱</div>
            <div className="text-2xl">☲</div>
            <div className="text-2xl">☯</div>
          </div>
        </div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-amber-400/30 rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
    </div>
  );
}