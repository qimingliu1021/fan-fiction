"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getHexagramResult, HexagramResult } from "@/lib/hexagram";
import { useAuth } from "@/app/contexts/AuthContext";

interface FortuneData {
  description: string;
  journey: string;
  currentCityImpact: string;
  destinationCityTraits: string;
  directionalGuidance?: {
    direction: string;
    meaning: string;
    recommendedCities: string[];
  };
}

interface UserLocation {
  city: string;
  state: string;
  latitude: number;
  longitude: number;
}

function HexagramAnalysisContent() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [hexagramResult, setHexagramResult] = useState<HexagramResult | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cityAnalysisLoading, setCityAnalysisLoading] = useState(false);

  useEffect(() => {
    const fetchHexagramData = async () => {
      const id = searchParams.get("id");

      if (!user || !id) {
        setLoading(false);
        setError("User not logged in or hexagram ID is missing.");
        return;
      }

      try {
        const result = await getHexagramResult(user.uid, id);
        if (result) {
          setHexagramResult(result);
        } else {
          setError("Hexagram result not found.");
        }
      } catch (err) {
        setError("Failed to fetch hexagram data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchHexagramData();
    }
  }, [user, searchParams]);

  const fortuneData = hexagramResult?.fortuneData
    ? {
        description: hexagramResult.description || "",
        journey: hexagramResult.fortuneData.journey || "",
        currentCityImpact: hexagramResult.fortuneData.currentCityImpact || "",
        destinationCityTraits:
          hexagramResult.fortuneData.destinationCityTraits || "",
        directionalGuidance: hexagramResult.fortuneData.directionalGuidance,
      }
    : null;

  const userLocation = hexagramResult?.userLocation;

  if (loading) {
    return (
      <div className="text-center">
        <p>Loading your fortune analysis...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 text-gray-800">
      <div className="w-full max-w-4xl space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-900">
          Hexagram Analysis for {hexagramResult?.hexagram}
        </h1>
        {/* Fortune Results */}
        {fortuneData ? (
          <>
            <div className="w-full max-w-4xl space-y-4 bg-blue-50 p-4 rounded">
              <h3 className="font-bold text-blue-800">Description:</h3>
              <p>{fortuneData.description}</p>
            </div>
            <div className="w-full max-w-4xl space-y-4 bg-green-50 p-4 rounded">
              <h3 className="font-bold text-green-800">Your Journey:</h3>
              <p>{fortuneData.journey}</p>
            </div>
            <div className="w-full max-w-4xl space-y-4 bg-purple-50 p-4 rounded">
              <h3 className="font-bold text-purple-800">
                Current City Impact:
              </h3>
              <p>{fortuneData.currentCityImpact}</p>
            </div>
            <div className="w-full max-w-4xl space-y-4 bg-red-50 p-4 rounded">
              <h3 className="font-bold text-red-800">
                Destination City Traits:
              </h3>
              <p>{fortuneData.destinationCityTraits}</p>
            </div>
            {fortuneData.directionalGuidance && (
              <div className="w-full max-w-4xl space-y-4 bg-yellow-50 p-4 rounded">
                <h3 className="font-bold text-yellow-800">
                  Directional Guidance:
                </h3>
                <p>
                  <strong>Direction:</strong>{" "}
                  {fortuneData.directionalGuidance.direction}
                </p>
                <p>
                  <strong>Meaning:</strong>{" "}
                  {fortuneData.directionalGuidance.meaning}
                </p>
                <p>
                  <strong>Recommended Cities:</strong>{" "}
                  {fortuneData.directionalGuidance.recommendedCities.join(", ")}
                </p>
                <div className="mt-4 flex gap-3 justify-center">
                  <button
                    onClick={async () => {
                      if (
                        !fortuneData.directionalGuidance?.direction ||
                        !userLocation
                      ) {
                        alert(
                          "Direction or location data is missing. Please complete your fortune reading first."
                        );
                        return;
                      }

                      setCityAnalysisLoading(true);

                      try {
                        console.log("🎯 Calling fortune-city API...");
                        const response = await fetch("/api/fortune-city", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            direction:
                              fortuneData.directionalGuidance.direction,
                            userCity: userLocation.city,
                            userState: userLocation.state,
                            latitude: userLocation.latitude,
                            longitude: userLocation.longitude,
                          }),
                        });

                        const cityData = await response.json();

                        if (cityData.success) {
                          console.log("✅ City analysis successful:", cityData);
                          // Store data for city-analyze page
                          localStorage.setItem(
                            "cityAnalysis",
                            JSON.stringify(cityData)
                          );
                          router.push("/city-analyze");
                        } else {
                          console.error(
                            "❌ City analysis failed:",
                            cityData.error
                          );
                          alert(`City analysis failed: ${cityData.error}`);
                        }
                      } catch (error) {
                        console.error(
                          "💥 Error calling fortune-city API:",
                          error
                        );
                        alert("Failed to analyze city. Please try again.");
                      } finally {
                        setCityAnalysisLoading(false);
                      }
                    }}
                    disabled={
                      cityAnalysisLoading ||
                      !fortuneData.directionalGuidance?.direction ||
                      !userLocation
                    }
                    className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-6 py-2 rounded-lg shadow-lg hover-shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {cityAnalysisLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Analyzing...
                      </>
                    ) : (
                      <>
                        Analyze Your Ideal City
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M5 12h14m-7-7 7 7-7 7" />
                        </svg>
                      </>
                    )}
                  </button>
                  <Link
                    href="/hexagram-history"
                    className="bg-gradient-to-r from-green-600 to-teal-500 text-white px-6 py-2 rounded-lg shadow-lg hover-shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    View My History
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </Link>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center">
            <p>No fortune data found for this reading.</p>
          </div>
        )}
      </div>
    </main>
  );
}

export default function HexagramAnalysisPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HexagramAnalysisContent />
    </Suspense>
  );
}
