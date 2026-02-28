"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Link from "next/link";
import { ProtectedRoute } from "@/app/components/ProtectedRoute";
import { useAuth } from "@/app/contexts/AuthContext";
import { saveHexagramResult, getUserReadingCount } from "@/lib/hexagram";
import FooterSection from "../components/Footer";

interface HexagramData {
  hexFont: string;
  english: string;
  pinyin: string;
  number: string;
  directionalGuidance: {
    direction: string;
    meaning: string;
    recommendedCities: string[];
  };
}

interface LocationData {
  city: string;
  state: string;
  latitude: number;
  longitude: number;
}

interface FortuneData {
  hexagram: string;
  description: string;
  journey?: string;
  currentCityImpact?: string;
  destinationCityTraits?: string;
  directionalGuidance?: {
    direction: string;
    meaning: string;
    recommendedCities: string[];
  };
  error?: string;
}

export default function CoinTossingPage() {
  const { user } = useAuth();
  const [hexagram, setHexagram] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [hexagramData, setHexagramData] = useState<HexagramData | null>(null);
  const [fortuneData, setFortuneData] = useState<FortuneData | null>(null);
  const [readingComplete, setReadingComplete] = useState(false);
  const [userLocation, setUserLocation] = useState<LocationData | null>(null);
  const [saveStatus, setSaveStatus] = useState<string>("");
  const [readingCount, setReadingCount] = useState<number>(0);
  const [cityAnalysisLoading, setCityAnalysisLoading] = useState(false);
  const router = useRouter();

  // Load user's reading count when component mounts
  useEffect(() => {
    if (user) {
      loadReadingCount();
    }
  }, [user]);

  const loadReadingCount = async () => {
    if (!user) return;
    try {
      const count = await getUserReadingCount(user.uid);
      setReadingCount(count);
    } catch (error) {
      console.error("Error loading reading count:", error);
    }
  };

  const renderCoin = (line: string, index: number) => (
    <div
      key={index}
      className={`relative w-12 h-12 rounded-full shadow-md text-xl font-bold transition-all duration-700 flex items-center justify-center ${
        loading
          ? "bg-gray-300 animate-spin-slow"
          : `${
              line === "yang"
                ? "bg-yellow-400 text-black"
                : "bg-purple-500 text-white"
            } animate-bounce-slight`
      }`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center text-2xl">
          🪙
        </span>
      )}
      {!loading && (line === "yang" ? "⚊" : "⚋")}
    </div>
  );

  const flipCoins = async () => {
    setLoading(true);
    setHexagramData(null);
    setFortuneData(null); // Reset fortune data
    setReadingComplete(false);

    const newHexagram = Array.from({ length: 6 }, () =>
      Math.random() < 0.5 ? "yin" : "yang"
    );
    console.log("newHexagram", newHexagram);
    setHexagram(newHexagram);

    const binary = newHexagram.map((l) => (l === "yang" ? "1" : "0")).join("");

    try {
      // Get user location first
      const location = await getUserLocation();
      setUserLocation(location);

      // First call fortune-life to get direction
      const lifeResponse = await fetch("/api/fortune-life", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          binary,
          userCity: location.city,
          userState: location.state,
        }),
      });

      const lifeData = await lifeResponse.json();

      // Store the response data
      setFortuneData(lifeData);

      if (lifeResponse.ok) {
        setReadingComplete(true);

        // Save hexagram result to user's subcollection
        if (user) {
          try {
            const binary = newHexagram
              .map((l) => (l === "yang" ? "1" : "0"))
              .join("");

            const hexagramId = await saveHexagramResult(user.uid, {
              coinResults: newHexagram,
              binary: binary,
              hexagram: lifeData.hexagram || "Unknown",
              description: lifeData.description,
              userLocation: {
                city: location.city,
                state: location.state,
                latitude: location.latitude,
                longitude: location.longitude,
              },
              fortuneData: {
                journey: lifeData.journey,
                currentCityImpact: lifeData.currentCityImpact,
                destinationCityTraits: lifeData.destinationCityTraits,
                directionalGuidance: lifeData.directionalGuidance,
              },
            });

            // Update reading count
            await loadReadingCount();

            setSaveStatus("✅ Reading saved to your history! Redirecting...");
            router.push(`/hexagram-analysis?id=${hexagramId}`);
          } catch (saveError) {
            console.error("Error saving hexagram result:", saveError);
            setSaveStatus("⚠️ Reading saved but failed to save to history");
          }
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setSaveStatus("❌ Error occurred during reading");
    } finally {
      setLoading(false);
    }
  };

  const getUserLocation = async (): Promise<LocationData> => {
    return new Promise((resolve) => {
      // First try browser geolocation (most accurate)
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;

            // Get city/state from coordinates using free reverse geocoding
            try {
              const response = await fetch(
                `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
              );
              const data = await response.json();

              resolve({
                city: data.city || data.locality || "Unknown",
                state: data.principalSubdivision || "Unknown",
                latitude,
                longitude,
              });
            } catch (error) {
              console.error("Reverse geocoding failed:", error);
              // Fallback to IP location
              getIPLocation().then(resolve);
            }
          },
          () => {
            // User denied geolocation, fallback to IP location
            getIPLocation().then(resolve);
          },
          { timeout: 10000 }
        );
      } else {
        // Browser doesn't support geolocation
        getIPLocation().then(resolve);
      }
    });
  };

  const getIPLocation = async (): Promise<LocationData> => {
    try {
      // Using ipapi.co (free tier: 1000 requests/day)
      const response = await fetch("https://ipapi.co/json/");
      const data = await response.json();

      return {
        city: data.city || "Unknown",
        state: data.region || "Unknown",
        latitude: data.latitude || 0,
        longitude: data.longitude || 0,
      };
    } catch (error) {
      console.error("IP location failed:", error);
      // Final fallback
      return {
        city: "Unknown",
        state: "Unknown",
        latitude: 0,
        longitude: 0,
      };
    }
  };

  return (
    <div className="flex flex-col gap-4 min-h-screen bg-gradient-to-br from-[#924519] to-[#00FF22]">
      {" "}
      <Navbar />
      <ProtectedRoute>
        <main className="flex-1 w-full flex flex-col items-center gap-8 p-8 mt-24">
          {userLocation && (
            <div className="text-center text-sm text-gray-600 mb-4">
              📍 Reading for: {userLocation.city}, {userLocation.state}
            </div>
          )}

          {saveStatus && (
            <div className="text-center text-sm mb-4 p-2 rounded-lg bg-blue-50 border border-blue-200">
              {saveStatus}
            </div>
          )}

          <div className="w-full max-w-md bg-background rounded-lg border p-6 shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Your Destiny Hexagram</h2>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Readings</p>
                <p className="text-lg font-semibold text-purple-600">
                  {readingCount}
                </p>
              </div>
            </div>
            <button
              onClick={flipCoins}
              className="mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white px-5 py-2 rounded-xl shadow-lg shadow-purple-500/40 hover:shadow-pink-500/50 transition-all duration-300 ease-in-out font-semibold tracking-wider"
              disabled={loading}
            >
              {loading ? "Consulting the Yijing..." : "Flip the Coins of Fate"}
            </button>

            {hexagramData && (
              <div className="text-center p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg mb-6">
                <div
                  className="mb-4 font-serif leading-none"
                  style={{ fontSize: "150px" }}
                >
                  {hexagramData.hexFont}
                </div>

                <h3 className="text-xl font-semibold text-purple-700">
                  {hexagramData.english}
                </h3>

                <p className="text-sm text-purple-600 mt-2">
                  {hexagramData.pinyin} • Hexagram {hexagramData.number}
                </p>
              </div>
            )}

            {hexagram.length > 0 && (
              <div className="text-center mb-6">
                <div className="grid grid-cols-6 gap-2 justify-center mb-4">
                  {hexagram.map((line, index) => renderCoin(line, index))}
                </div>
              </div>
            )}
          </div>
          {readingComplete && !loading && (
            <Link href="/hexagram-analysis">
              <button className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white px-5 py-2 rounded-xl shadow-lg shadow-purple-500/40 hover:shadow-pink-500/50 transition-all duration-300 ease-in-out font-semibold tracking-wider">
                Proceed to Hexagram Analysis
              </button>
            </Link>
          )}
        </main>
      </ProtectedRoute>
      <FooterSection />
    </div>
  );
}
