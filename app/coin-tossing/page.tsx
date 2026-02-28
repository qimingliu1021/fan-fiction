"use client";

import { useState, useEffect } from "react";
import { InfoIcon, ArrowRight } from "lucide-react";
import Link from "next/link";

type FortuneCityResponse = {
  selectedCity: string;
  explanation: string;
  fortune: string;
  recommendedPlaces: { name: string; reason: string }[];
  videoUrl?: string;
};

interface HexagramData {
  hexFont: string;
  english: string;
  pinyin: string;
  number: string;
}

interface LocationData {
  city: string;
  state: string;
  latitude: number;
  longitude: number;
}

export default function CoinTossingPage() {
  const [hexagram, setHexagram] = useState<string[]>([]);
  const [fortuneCity, setFortuneCity] = useState<FortuneCityResponse | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [hexagramData, setHexagramData] = useState<HexagramData | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [readingComplete, setReadingComplete] = useState(false);
  const [userLocation, setUserLocation] = useState<LocationData | null>(null);

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
    setFortuneCity(null);
    setImageUrls([]);
    setLoading(true);
    setHexagramData(null);
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
          latitude: location.latitude,
          longitude: location.longitude,
        }),
      });

      const lifeData = await lifeResponse.json();
      console.log("Fortune Life Response:", lifeData);

      // 🎭 ADD POEM GENERATION HERE - Right after fortune-life
      const poemResponse = await fetch("/api/poem-of-life", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fortuneLifeData: lifeData,
        }),
      });

      let poemData = null;
      if (poemResponse.ok) {
        poemData = await poemResponse.json();
        console.log("🎵 Poem generated:", poemData);
      } else {
        console.error("Failed to generate poem");
      }

      // Extract direction from fortune-life response
      const direction = lifeData.directionalGuidance?.direction || "North";

      // Then call other APIs with the direction
      const [cityResponse, hexagramResponse] = await Promise.all([
        fetch("/api/fortune-city", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            binary,
            direction, // Pass the direction from fortune-life
            userCity: location.city,
            userState: location.state,
            latitude: location.latitude,
            longitude: location.longitude,
          }),
        }),
        fetch("/api/hexagram-data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ binary }),
        }),
      ]);

      if (lifeResponse.ok && cityResponse.ok && hexagramResponse.ok) {
        const cityData = await cityResponse.json();
        const hexagramCsvData = await hexagramResponse.json();

        setFortuneCity(cityData);
        setHexagramData(hexagramCsvData);

        // Store in localStorage for other pages
        if (typeof window !== "undefined") {
          localStorage.setItem("currentHexagram", JSON.stringify(newHexagram));
          localStorage.setItem("fortuneCity", JSON.stringify(cityData));
          localStorage.setItem("fortuneLife", JSON.stringify(lifeData));
          localStorage.setItem("hexagramData", JSON.stringify(hexagramCsvData));
          localStorage.setItem("userLocation", JSON.stringify(location));

          // 🎭 STORE POEM DATA
          if (poemData) {
            localStorage.setItem("poemData", JSON.stringify(poemData));
          }
        }

        // Fetch images after getting data
        const imageResponse = await fetch("/api/image-fetching", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            binary,
            direction, // ← Add direction from fortune-life
            userCity: location.city,
            userState: location.state,
            latitude: location.latitude,
            longitude: location.longitude,
          }),
        });

        if (imageResponse.ok) {
          const imageData = await imageResponse.json();
          setImageUrls(imageData.imageUrls || []);
          if (typeof window !== "undefined") {
            localStorage.setItem(
              "imageUrls",
              JSON.stringify(imageData.imageUrls || [])
            );
          }
          console.log("🖼️ Image URLs ready:", imageData.imageUrls);
        }

        setReadingComplete(true);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if we're in the browser before accessing localStorage
    if (typeof window !== "undefined") {
      const storedHexagramData = localStorage.getItem("hexagramData");

      if (storedHexagramData) {
        setHexagramData(JSON.parse(storedHexagramData));
      }
    }
  }, []);

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
    <div className="flex-1 w-full flex flex-col items-center gap-8 p-8">
      <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
        <InfoIcon size={16} strokeWidth={2} />
        Welcome to Destiny Lens – your personal Yijing fortune teller.
      </div>
      {userLocation && (
        <div className="text-center text-sm text-gray-600 mb-4">
          📍 Reading for: {userLocation.city}, {userLocation.state}
        </div>
      )}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4 text-center">
          Your Destiny Journey
        </h3>
      </div>

      <div className="w-full max-w-md bg-background rounded-lg border p-6 shadow">
        <h2 className="text-xl font-bold mb-4">Your Destiny Hexagram</h2>
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

      {/* Navigation Cards */}
      {readingComplete && (
        <div className="w-full max-w-4xl">
          <h3 className="text-2xl font-bold text-center mb-8">
            🌟 Explore Your Destiny
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Hexagram Analysis Card */}
            <Link href="/hexagram-analysis">
              <div className="bg-white p-6 rounded-lg border shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
                <div className="text-center">
                  <div className="text-4xl mb-4">🔮</div>
                  <h4 className="text-lg font-semibold text-purple-700 mb-2">
                    Life Analysis
                  </h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Discover your personal traits, career guidance, and
                    relationship insights
                  </p>
                  <div className="flex items-center justify-center gap-2 text-purple-600 group-hover:text-purple-800">
                    <span>Explore</span>
                    <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            </Link>

            {/* City Analysis Card */}
            <Link href="/city-analysis">
              <div className="bg-white p-6 rounded-lg border shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
                <div className="text-center">
                  <div className="text-4xl mb-4">🏙️</div>
                  <h4 className="text-lg font-semibold text-blue-700 mb-2">
                    City Analysis
                  </h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Find your destiny city and sacred places to visit
                  </p>
                  <div className="flex items-center justify-center gap-2 text-blue-600 group-hover:text-blue-800">
                    <span>Discover</span>
                    <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            </Link>

            {/* Video Journey Card */}
            <Link href="/video-of-desti">
              <div className="bg-white p-6 rounded-lg border shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
                <div className="text-center">
                  <div className="text-4xl mb-4">🎬</div>
                  <h4 className="text-lg font-semibold text-green-700 mb-2">
                    Video Journey
                  </h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Watch your personalized destiny video unfold
                  </p>
                  <div className="flex items-center justify-center gap-2 text-green-600 group-hover:text-green-800">
                    <span>Watch</span>
                    <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Quick Summary */}
          <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
            <h4 className="text-lg font-semibold text-center mb-4">
              Your Reading Summary
            </h4>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="font-medium text-purple-700">Your Hexagram</div>
                <div className="text-gray-600">{hexagramData?.english}</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-blue-700">Destiny City</div>
                <div className="text-gray-600">{fortuneCity?.selectedCity}</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-green-700">Video Status</div>
                <div className="text-gray-600">
                  {imageUrls.length > 0 ? "Ready to Watch" : "Generating..."}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!readingComplete && !loading && hexagram.length === 0 && (
        <div className="text-center p-8 bg-gray-50 rounded-lg max-w-md">
          <div className="text-6xl mb-4">🪙</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Ready for Your Reading?
          </h3>
          <p className="text-gray-600">
            Click the button above to begin your Yijing journey and discover
            what destiny has in store for you.
          </p>
        </div>
      )}
    </div>
  );
}
