"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import {
  getUserHexagramHistoryWithCount,
  HexagramResult,
} from "@/lib/hexagram";
import Navbar from "../components/Navbar";
import { ProtectedRoute } from "@/app/components/ProtectedRoute";
import Link from "next/link";
import FooterSection from "../components/Footer";

export default function HexagramHistoryPage() {
  const { user } = useAuth();
  const [hexagramHistory, setHexagramHistory] = useState<HexagramResult[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (user) {
      loadHexagramHistory();
    }
  }, [user]);

  const loadHexagramHistory = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const result = await getUserHexagramHistoryWithCount(user.uid, 20);
      setHexagramHistory(result.history);
      setTotalCount(result.totalCount);
    } catch (err) {
      setError("Failed to load hexagram history");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const renderCoinLine = (line: string) => (
    <span
      className={`text-lg ${
        line === "yang" ? "text-yellow-600" : "text-purple-600"
      }`}
    >
      {line === "yang" ? "⚊" : "⚋"}
    </span>
  );

  if (loading) {
    return (
      <div className="flex flex-col gap-4 min-h-screen">
        <Navbar />
        <ProtectedRoute>
          <main className="flex-1 w-full flex flex-col items-center gap-8 p-8 mt-24">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">
                Loading your hexagram history...
              </p>
            </div>
          </main>
        </ProtectedRoute>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 min-h-screen">
      <Navbar />
      <ProtectedRoute>
        <main className="flex-1 w-full flex flex-col items-center gap-8 p-8 mt-24">
          <div className="w-full max-w-6xl">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Your Hexagram History
                </h1>
                <p className="text-gray-600 mt-2">
                  Total Readings:{" "}
                  <span className="font-semibold text-purple-600">
                    {totalCount}
                  </span>
                </p>
              </div>
              <Link
                href="/coin-tossing"
                className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                New Reading
              </Link>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            {hexagramHistory.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔮</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No readings yet
                </h3>
                <p className="text-gray-500 mb-6">
                  Start your journey by getting your first hexagram reading
                </p>
                <Link
                  href="/coin-tossing"
                  className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Get Your First Reading
                </Link>
              </div>
            ) : (
              <div className="grid gap-6">
                {hexagramHistory.map((result, index) => (
                  <div
                    key={result.id || index}
                    className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                          {result.hexagram}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {formatDate(result.timestamp)}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600 mb-1">
                          Binary: {result.binary}
                        </div>
                        <div className="flex gap-1">
                          {result.coinResults.map((line, lineIndex) => (
                            <div
                              key={lineIndex}
                              className="w-6 h-6 flex items-center justify-center"
                            >
                              {renderCoinLine(line)}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {result.userLocation && (
                      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-700">
                          📍 Reading for: {result.userLocation.city},{" "}
                          {result.userLocation.state}
                        </p>
                      </div>
                    )}

                    {result.description && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-700 mb-2">
                          Description:
                        </h4>
                        <p className="text-gray-600">{result.description}</p>
                      </div>
                    )}

                    {result.fortuneData && (
                      <div className="space-y-3">
                        {result.fortuneData.journey && (
                          <div>
                            <h4 className="font-semibold text-gray-700 mb-1">
                              Journey:
                            </h4>
                            <p className="text-gray-600">
                              {result.fortuneData.journey}
                            </p>
                          </div>
                        )}

                        {result.fortuneData.currentCityImpact && (
                          <div>
                            <h4 className="font-semibold text-gray-700 mb-1">
                              Current City Impact:
                            </h4>
                            <p className="text-gray-600">
                              {result.fortuneData.currentCityImpact}
                            </p>
                          </div>
                        )}

                        {result.fortuneData.destinationCityTraits && (
                          <div>
                            <h4 className="font-semibold text-gray-700 mb-1">
                              Destination City Traits:
                            </h4>
                            <p className="text-gray-600">
                              {result.fortuneData.destinationCityTraits}
                            </p>
                          </div>
                        )}

                        {result.fortuneData.directionalGuidance && (
                          <div className="p-3 bg-yellow-50 rounded-lg">
                            <h4 className="font-semibold text-yellow-800 mb-2">
                              Directional Guidance:
                            </h4>
                            <p className="text-yellow-700 mb-1">
                              <strong>Direction:</strong>{" "}
                              {result.fortuneData.directionalGuidance.direction}
                            </p>
                            <p className="text-yellow-700 mb-1">
                              <strong>Meaning:</strong>{" "}
                              {result.fortuneData.directionalGuidance.meaning}
                            </p>
                            <p className="text-yellow-700">
                              <strong>Recommended Cities:</strong>{" "}
                              {result.fortuneData.directionalGuidance.recommendedCities.join(
                                ", "
                              )}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </ProtectedRoute>
      <FooterSection />
    </div>
  );
}
