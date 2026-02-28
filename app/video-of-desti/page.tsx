"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, RotateCcw, Play, Download } from "lucide-react";
import RemotionPlayer from "@/components/RemotionPlayer";

interface HexagramData {
  hexFont: string;
  english: string;
  pinyin: string;
  number: string;
}

export default function VideoOfDestiPage() {
  const [hexagramData, setHexagramData] = useState<HexagramData | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [poemData, setPoemData] = useState<{
    poem: string;
    audioFile: string;
    audioUrl: string;
  } | null>(null);

  useEffect(() => {
    const storedHexagramData = localStorage.getItem("hexagramData");
    const storedImageUrls = localStorage.getItem("imageUrls");
    const storedPoemData = localStorage.getItem("poemData");

    if (storedHexagramData) {
      setHexagramData(JSON.parse(storedHexagramData));
    }
    if (storedImageUrls) {
      setImageUrls(JSON.parse(storedImageUrls));
    }
    if (storedPoemData) {
      setPoemData(JSON.parse(storedPoemData));
    }
  }, []);

  const generateNewVideo = async () => {
    setLoading(true);

    // Generate new hexagram
    const newHexagram = Array.from({ length: 6 }, () =>
      Math.random() < 0.5 ? "yin" : "yang"
    );
    const binary = newHexagram.map((l) => (l === "yang" ? "1" : "0")).join("");

    try {
      const [hexagramResponse, imageResponse] = await Promise.all([
        fetch("/api/hexagram-data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ binary }),
        }),
        fetch("/api/image-fetching", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ binary }),
        }),
      ]);

      if (hexagramResponse.ok && imageResponse.ok) {
        const hexagramCsvData = await hexagramResponse.json();
        const imageData = await imageResponse.json();

        setHexagramData(hexagramCsvData);
        setImageUrls(imageData.imageUrls || []);

        // Store in localStorage for other pages
        localStorage.setItem("currentHexagram", JSON.stringify(newHexagram));
        localStorage.setItem("hexagramData", JSON.stringify(hexagramCsvData));
        localStorage.setItem(
          "imageUrls",
          JSON.stringify(imageData.imageUrls || [])
        );
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

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
        });

        // Save to localStorage for persistence
        localStorage.setItem("poemData", JSON.stringify(data));
      }
    } catch (error) {
      console.error("Error generating poem:", error);
    }
  };

  const downloadVideo = async () => {
    try {
      const response = await fetch("/api/video-generation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrls }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "destiny-video.mp4";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error("Error downloading video:", error);
    }
  };

  return (
    <div className="flex-1 w-full flex flex-col items-center gap-8 p-8">
      {/* Navigation */}
      <div className="w-full max-w-4xl flex justify-between items-center">
        <Link
          href="/city-analysis"
          className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
        >
          <ArrowLeft size={16} />
          City Analysis
        </Link>

        <h1 className="text-2xl font-bold text-center">
          🎬 Your Destiny Journey
        </h1>

        <Link
          href="/coin-tossing"
          className="flex items-center gap-2 px-4 py-2 bg-purple-100 hover:bg-purple-200 rounded-lg transition-colors"
        >
          Back to Start
        </Link>
      </div>

      {/* Hexagram Display */}
      {hexagramData && (
        <div className="text-center p-6 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg">
          <div
            className="mb-4 font-serif leading-none"
            style={{ fontSize: "120px" }}
          >
            {hexagramData.hexFont}
          </div>

          <h2 className="text-2xl font-semibold text-green-700">
            {hexagramData.english}
          </h2>

          <p className="text-lg text-green-600 mt-2">
            {hexagramData.pinyin} • Hexagram {hexagramData.number}
          </p>
        </div>
      )}

      {/* Generate New Video Button */}
      <button
        onClick={generateNewVideo}
        className="flex items-center gap-2 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-500 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
        disabled={loading}
      >
        <RotateCcw size={18} />
        {loading ? "Creating New Journey..." : "Create New Video Journey"}
      </button>

      {/* Video Player Section */}
      {imageUrls.length > 0 && (
        <div className="w-full max-w-4xl space-y-6 bg-white rounded-lg border p-8 shadow-lg">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-green-700 mb-4 flex items-center justify-center gap-3">
              <Play size={28} />
              Your Personalized Destiny Video
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-emerald-400 mx-auto rounded-full"></div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg">
            <p className="text-center text-gray-700 mb-6 leading-relaxed">
              Watch as your destiny unfolds through the wisdom of the Yijing.
              This personalized video journey was created based on your hexagram
              reading, blending ancient wisdom with modern storytelling.
            </p>

            <div className="w-full flex justify-center">
              <RemotionPlayer
                imageUrls={imageUrls}
                poemText={poemData?.poem}
                poemAudioFile={poemData?.audioFile}
                showText={true}
              />
            </div>
          </div>

          {/* Video Controls */}
          <div className="flex justify-center gap-4 pt-4">
            <button
              onClick={generateNewVideo}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              disabled={loading}
            >
              <RotateCcw size={16} />
              Generate New Video
            </button>

            <button
              onClick={downloadVideo}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download size={16} />
              Download Video
            </button>
          </div>

          {/* Video Details */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">Video Details:</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>• Images generated: {imageUrls.length}</p>
              <p>• Based on hexagram: {hexagramData?.english || "Unknown"}</p>
              <p>• Format: MP4 with audio soundtrack</p>
              <p>• Duration: Approximately 30 seconds</p>
            </div>
          </div>
        </div>
      )}

      {imageUrls.length === 0 && !loading && (
        <div className="w-full max-w-4xl text-center p-8 bg-gray-50 rounded-lg">
          <div className="space-y-4">
            <div className="text-6xl mb-4">🎬</div>
            <h3 className="text-xl font-semibold text-gray-700">
              No Video Journey Available
            </h3>
            <p className="text-gray-600 mb-6">
              Create your personalized destiny video by generating a new reading
              or starting from the beginning.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/coin-tossing"
                className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                Start Complete Journey
              </Link>
              <button
                onClick={generateNewVideo}
                className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <Play size={16} />
                Generate Video Only
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="w-full max-w-4xl flex justify-between items-center pt-8 border-t">
        <Link
          href="/city-analysis"
          className="flex items-center gap-2 px-6 py-3 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
        >
          <ArrowLeft size={16} />
          City Analysis
        </Link>

        <div className="flex gap-4">
          <Link
            href="/hexagram-analysis"
            className="flex items-center gap-2 px-6 py-3 bg-purple-100 hover:bg-purple-200 rounded-lg transition-colors"
          >
            Hexagram Analysis
          </Link>

          <Link
            href="/coin-tossing"
            className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            New Reading
          </Link>
        </div>
      </div>
    </div>
  );
}
