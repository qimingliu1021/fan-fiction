"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addToWaitlist, checkEmailExists } from "@/lib/waitlist";
import Navbar from "../components/Navbar";
import FooterSection from "../components/Footer";

export default function JoinWaitlistPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim()) {
      setError("Please fill in all fields");
      return;
    }

    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      // Check if email already exists
      const emailExists = await checkEmailExists(formData.email);
      if (emailExists) {
        setError("This email is already on our waitlist!");
        return;
      }

      // Add to waitlist and immediately navigate to thank-you page
      await addToWaitlist(formData.name, formData.email, "join-waitlist-page");
      router.push("/thank-you");
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
          </div>

          <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Main Content */}
            <div className="mb-16 mt-20">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight font-title">
                Join the
                <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent">
                  Future
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed font-title">
                Be among the first to experience the next generation of city
                discovery. Get early access, updates, and launch offers.
              </p>
            </div>

            {/* Waitlist Form */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
                🚀 Join Our Waitlist
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative group">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your Name"
                      className="w-full px-6 py-4 bg-white/20 border-2 border-white/30 rounded-2xl text-white placeholder-white/70 focus:outline-none focus:border-purple-400 focus:bg-white/30 transition-all duration-300 text-lg"
                      required
                    />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl"></div>
                  </div>

                  <div className="relative group">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Your Email"
                      className="w-full px-6 py-4 bg-white/20 border-2 border-white/30 rounded-2xl text-white placeholder-white/70 focus:outline-none focus:border-purple-400 focus:bg-white/30 transition-all duration-300 text-lg"
                      required
                    />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl"></div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white font-bold text-xl py-5 px-8 rounded-2xl hover:from-purple-700 hover:via-pink-700 hover:to-red-700 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                      Joining Waitlist...
                    </div>
                  ) : (
                    "🎯 Join the Waitlist"
                  )}
                </button>
              </form>

              {/* Status Messages */}
              {message && (
                <div className="mt-6 p-4 bg-green-500/20 border border-green-400/30 rounded-2xl text-green-300">
                  {message}
                </div>
              )}

              {error && (
                <div className="mt-6 p-4 bg-red-500/20 border border-red-400/30 rounded-2xl text-red-300">
                  {error}
                </div>
              )}
            </div>

            {/* Features Preview */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🌍</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Cities
                </h3>
                <p className="text-gray-300">
                  Discover U.S. cities that match your energy
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🔮</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  AI Insights
                </h3>
                <p className="text-gray-300">
                  Powered by ancient wisdom & modern AI
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-pink-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🎬</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Personal Stories
                </h3>
                <p className="text-gray-300">
                  Your journey as a cinematic experience
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <FooterSection />
    </div>
  );
}
