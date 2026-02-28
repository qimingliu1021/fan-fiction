"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import React, { JSX, useState, useEffect } from "react";
import FooterSection from "./components/Footer";
import Link from "next/link";
import Navbar from "./components/Navbar";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function Home() {
  const { ref, isVisible } = useScrollAnimation();
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showDemoVideo, setShowDemoVideo] = useState(false);

  // Your video URL from Firebase Storage
  const demoVideoUrl =
    "https://firebasestorage.googleapis.com/v0/b/yiverse-b16ed.firebasestorage.app/o/yiverse%20demo.mp4?alt=media&token=b11179fc-bc6f-45f3-af9e-ad9dad608941";

  // Trigger animations when page loads
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const toggleAccordion = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index)
        ? prev.filter((item) => item !== index)
        : [...prev, index]
    );
  };

  // Plus icon SVG
  const PlusIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="currentColor"
      className="w-5 h-5"
    >
      <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
    </svg>
  );

  // Minus icon SVG
  const MinusIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="currentColor"
      className="w-5 h-5"
    >
      <path d="M3.75 7.25a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5h-8.5Z" />
    </svg>
  );

  const howItWorksCards = [
    {
      number: "01",
      title: "Discover Your Trigram",
      description:
        "Flip the coins. Unlock your I Ching profile.\n(Reveal your energetic signature in the ancient way.)",
      icon: (
        <div className="w-[55px] h-[50px] mx-auto">
          <img
            className="w-full h-full"
            alt="Hexagram pictogram"
            src="/images/image.png"
          />
        </div>
      ),
    },
    {
      number: "02",
      title: "Find Your City & Life Path",
      description:
        "Get your recommended U.S. city based on your energy and life stage.\n(Designed through the logic of ancient trigrams and modern AI.)",
      icon: (
        <div className="w-[60px] h-[50px] mx-auto">
          <img className="w-full h-full" alt="Map icon" src="/images/map.png" />
        </div>
      ),
    },
    {
      number: "03",
      title: "Watch Your Story Unfold",
      description:
        "A personalized video that weaves your fate into poems and cityscapes.\n(Feel the rhythm of the place you're meant to be.)",
      icon: (
        <div className="w-[50px] h-[50px] mx-auto">
          <img
            className="w-full h-full"
            alt="Movie clapper"
            src="/images/movie.png"
          />
        </div>
      ),
    },
    {
      number: "04",
      title: "Connect Through Our Local Guides",
      description:
        "Meet passionate guides who help you explore your city from a soul-first perspective.\n(Cultural depth, local secrets, and energy-aligned insight.)",
      icon: (
        <img
          className="w-[60px] h-[50px] mx-auto"
          alt="Arrow icon"
          src="/images/direction.png"
        />
      ),
    },
  ];

  const faqItems = [
    {
      question: "How can I trust the result?",
      answer:
        "When you feel you're moved somehow, and there's something you haven't realized before. \nIf something inside you stirs — a pull, a curiosity, a warmth — then the result is already working.\n\nYour destination isn't just a place. It's where you thrive. It's where you begin to become who you really are.",
    },
    {
      question: "Is this just a city recommendation system?",
      answer:
        "Not at all. While we use city data, the core lies in trigram-based insight that reads your inner state and aligns it with I Ching wisdom. This isn't about telling you where to go—it's about helping you feel why a place resonates with your current self. It's not logistical guidance; it's emotional, energetic, and poetic discovery of truths you may not have fully realized",
    },
    {
      question: "How do you analyze my current state?",
      answer:
        "We use the traditional coin divination method from the I Ching to generate one of 64 hexagrams with a probability of 1/4096. Our AI precisely analyzes the meaning of your unique hexagram, comparing it to your recent emotions, life circumstances, interpersonal relationships, and current fortune patterns to provide deep insights into your present moment.",
    },
    {
      question: "How do you determine my destiny city?",
      answer:
        "We map the 'Later Heaven Eight Trigrams directions' from the I Ching to the cultural atmosphere, climate characteristics, and social rhythm of various American cities. For example: if your hexagram reveals 'Kan (water) energy with challenges above but continuous flow,' we might recommend cities like Seattle or Boston—northern places that may seem cold but offer deep healing and growth potential that aligns with your energy patterns.",
    },
  ];

  return (
    <>
      <div className="relative min-h-screen bg-gradient-to-br from-[#151929] to-[#924519]">
        <Navbar />

        {/* ******************* Hero Section ******************* */}
        <div className="relative w-full h-[90vh] bg-cover bg-center pt-16 ">
          {/* Blurred band between Hero and How It Works sections */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-transparent to-[#151929] mt-16"
            style={{
              backgroundImage:
                "linear-gradient(to bottom, rgba(207, 217, 255, 0.35), rgba(21, 25, 41, 0.85)), url('/images/background.jpg')",
              maskImage:
                "linear-gradient(to bottom, black 0%, black 70%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, black 0%, black 70%, transparent 100%)",
              filter: "blur(0px)",
            }}
          ></div>

          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
            {/* Animated Title */}
            <h1
              className={`font-title text-[50px] md:text-6xl text-white mb-4 drop-shadow-lg transition-all duration-1000 transform ${
                isLoaded
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              Find the city you belong
            </h1>

            {/* Animated Subtitle */}
            <p
              className={`text-2xl md:text-2xl text-white max-w-2xl mb-8 drop-shadow transition-all duration-1000 delay-300 transform ${
                isLoaded
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              We turn your story into a poem movie — and a path forward. A city
              speaks your energy. We help you hear it.
            </p>

            {/* Animated Buttons */}
            <div
              className={`flex flex-row gap-6 transition-all duration-1000 delay-600 transform ${
                isLoaded
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <Link
                href="/join-waitlist"
                className="text-lg font-title inline-block px-6 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] hover:from-purple-700 hover:via-pink-700 hover:to-red-700 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
              >
                Join Waitlist
              </Link>

              <button
                onClick={() => setShowDemoVideo(true)}
                className="text-lg inline-block px-6 py-4 bg-gray-400 text-black font-title rounded-xl shadow-xl font-semibold hover:shadow-[0_0_25px_rgba(59,130,246,0.6)] hover:bg-gray-300 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
              >
                View Demo
              </button>
              {showDemoVideo && (
                <div
                  className="fixed inset-0 z-50 items-center w-[400px] h-[200px] bg-black/80 backdrop-blur-md "
                  onClick={() => setShowDemoVideo(false)}
                >
                  <div
                    className="relative w-full max-w-3xl aspect-video bg-black rounded-lg shadow-xl overflow-hidden"
                    onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on video
                  >
                    <video
                      className="w-full h-full"
                      controls
                      autoPlay
                      onEnded={() => setShowDemoVideo(false)}
                    >
                      <source src={demoVideoUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    <button
                      onClick={() => setShowDemoVideo(false)}
                      className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
                    >
                      &times;
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ******************* How It Works Section ******************* */}
        <div
          ref={ref}
          className="w-full py-16 px-4 md:px-16 lg:px-20 relative "
        >
          {/* Add a subtle top blur */}

          {/* Animated Title */}
          <h2
            className={`text-[70px] font-title text-white mb-12 transition-all duration-1000 transform ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            How it works
          </h2>

          {/* Animated Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-20 max-w-10xl mx-auto">
            {howItWorksCards.map((card, index) => (
              <Card
                key={index}
                className={`bg-transparent rounded-[50px] overflow-hidden shadow-[0px_0px_21px_15px_#994b1c] border-none h-[450px] max-w-6xl mx-auto transition-all duration-700 transform ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-12"
                }`}
                style={{
                  transitionDelay: `${300 + index * 200}ms`,
                }}
              >
                <CardContent className="bg-[#55220d] p-4 flex flex-col items-center h-full overflow-y-auto">
                  <div className="mt-6 mb-4">{card.icon}</div>
                  <div className="text-center">
                    <p className="text-xl mb-1 text-white font-bold font-title">
                      {card.number}
                    </p>
                    <h3 className="text-[25px] mb-4 text-white font-bold font-title">
                      {card.title}
                    </h3>
                    <p className="text-[20px] whitespace-pre-line text-white font-title">
                      {card.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* ******************* FAQ Title ******************* */}
          <h2
            className={`text-[70px] font-title text-white mb-8 transition-all duration-1000 transform ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "1200ms" }}
          >
            FAQ
          </h2>

          {/* FAQ Items */}
          <div className="w-full space-y-4">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className={`rounded-xl bg-amber-900/20 backdrop-blur-sm border border-amber-600/30 transition-all duration-700 hover:bg-amber-900/30 hover:shadow-lg hover:shadow-amber-500/20 overflow-hidden transform ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{
                  transitionDelay: `${1400 + index * 100}ms`,
                }}
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full flex justify-between items-center py-5 px-6 text-amber-900 hover:text-white transition-all duration-300 hover:bg-amber-800/30 focus:outline-none group"
                >
                  <span className="font-bold text-lg text-white font-title text-left">
                    {item.question}
                  </span>
                  <span className="text-amber-400 group-hover:text-white transition-all duration-300 flex-shrink-0 ml-4">
                    {openItems.includes(index) ? <MinusIcon /> : <PlusIcon />}
                  </span>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openItems.includes(index)
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-6  pb-5 text-white font-title text-[20px] hover:text-white transition-colors duration-300 text-base leading-relaxed whitespace-pre-line">
                    {item.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-b from-[#924519] to-[#263356] h-12"></div>

      <FooterSection />
    </>
  );
}
