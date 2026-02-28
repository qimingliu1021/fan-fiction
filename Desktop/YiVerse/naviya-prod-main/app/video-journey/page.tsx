"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Play } from "lucide-react";
import RemotionPlayer from "@/components/RemotionPlayer";
import Footer from "@/app/components/Footer";
import Nav from "@/app/components/Navbar";

export default function VideoOfDestinyPage() {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [poemData, setPoemData] = useState<{
    poem: string;
    audioFile: string;
    audioUrl: string;
    timestamp: number;
    fileSize: number;
  } | null>(null);

  // Add state for city poem data
  const [cityPoemData, setCityPoemData] = useState<{
    poem: string;
    audioFile: string;
    audioUrl: string;
    timestamp: number;
    fileSize: number;
  } | null>(null);

  useEffect(() => {
    const storedImageUrls = localStorage.getItem("imageUrls");
    const storedPoemData = localStorage.getItem("poemData");

    if (storedImageUrls) {
      setImageUrls(JSON.parse(storedImageUrls));
    }
    if (storedPoemData) {
      setPoemData(JSON.parse(storedPoemData));
    }

    // Update useEffect to load city poem data
    const storedCityPoemData = localStorage.getItem("cityPoemData");
    if (storedCityPoemData) {
      setCityPoemData(JSON.parse(storedCityPoemData));
    }
  }, []);

  const generatePoem = async () => {
    try {
      // Get fortune life data from localStorage or state
      const fortuneLifeData = JSON.parse(
        localStorage.getItem("fortuneLifeData") || "{}"
      );

      const response = await fetch("/api/poem-of-life", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fortuneLifeData }),
      });

      if (response.ok) {
        const data = await response.json();
        setPoemData({
          poem: data.poem,
          audioFile: data.audioFile,
          audioUrl: data.audioUrl,
          timestamp: data.timestamp,
          fileSize: data.fileSize,
        });

        // Save to localStorage for persistence
        localStorage.setItem("poemData", JSON.stringify(data));
      }
    } catch (error) {
      console.error("Error generating poem:", error);
    }
  };

  return (
    <div>
      <Nav />
      <div className="flex-1 w-full flex flex-col items-center gap-8 p-8">
        {imageUrls.length > 0 && (
          <div className="w-full max-w-4xl space-y-6 bg-white rounded-lg border p-8 shadow-lg">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-green-700 mb-4 flex items-center justify-center gap-3">
                <Play size={28} />
                Your Complete Destiny Journey
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-emerald-400 mx-auto rounded-full"></div>
              {poemData && cityPoemData && (
                <p className="text-gray-600 mt-4">
                  Experience both your life journey and city destiny in one
                  complete video
                </p>
              )}
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg">
              <div className="w-full flex justify-center">
                <RemotionPlayer
                  imageUrls={imageUrls}
                  lifePoemData={poemData}
                  cityPoemData={cityPoemData}
                  showText={true}
                />
              </div>
            </div>
          </div>
        )}
        <div className="w-full max-w-4xl flex justify-between items-center pt-8 border-t">
          <Link
            href="/city-analyze"
            className="flex items-center gap-2 px-6 py-3 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
          >
            <ArrowLeft size={16} />
            City Analysis
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
