/* eslint-disable react/no-unescaped-entities */
"use client";

import Link from "next/link";
import { ArrowLeft, HelpCircle, Sparkles } from "lucide-react";

export default function FAQPage() {
  return (
    <div className="flex-1 w-full flex flex-col items-center gap-8 p-8 min-h-screen">
      {/* Navigation */}
      <div className="w-full max-w-4xl flex justify-between items-center">
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2 bg-purple-100 hover:bg-purple-200 rounded-lg transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          ❓ Frequently Asked Questions
        </h1>

        <Link
          href="/coin-tossing"
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 hover:from-indigo-200 hover:to-purple-200 rounded-lg transition-colors"
        >
          Start Reading
          <Sparkles size={16} />
        </Link>
      </div>

      {/* FAQ Content */}
      <div className="w-full max-w-4xl space-y-8">
        {/* Question 1 */}
        <div className="bg-white rounded-lg border p-8 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-start gap-4">
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-3 rounded-full">
              <HelpCircle className="text-purple-600" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-purple-700 mb-4">
                Q1: How do you analyze my current state?
              </h3>
              <p className="text-gray-700 leading-relaxed">
                We use the traditional coin divination method from the I Ching
                to generate one of 64 hexagrams with a probability of 1/4096.
                Our AI precisely analyzes the meaning of your unique hexagram,
                comparing it to your recent emotions, life circumstances,
                interpersonal relationships, and current fortune patterns to
                provide deep insights into your present moment.
              </p>
            </div>
          </div>
        </div>

        {/* Question 2 */}
        <div className="bg-white rounded-lg border p-8 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-start gap-4">
            <div className="bg-gradient-to-r from-blue-100 to-teal-100 p-3 rounded-full">
              <HelpCircle className="text-blue-600" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-blue-700 mb-4">
                Q2: How do you determine my destiny city?
              </h3>
              <p className="text-gray-700 leading-relaxed">
                We map the "Later Heaven Eight Trigrams directions" from the I
                Ching to the cultural atmosphere, climate characteristics, and
                social rhythm of various American cities. For example: if your
                hexagram reveals "Kan (water) energy with challenges above but
                continuous flow," we might recommend cities like Seattle or
                Boston—northern places that may seem cold but offer deep healing
                and growth potential that aligns with your energy patterns.
              </p>
            </div>
          </div>
        </div>

        {/* Question 3 */}
        <div className="bg-white rounded-lg border p-8 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-start gap-4">
            <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-3 rounded-full">
              <HelpCircle className="text-green-600" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-green-700 mb-4">
                Q3: How do I know if the analysis is accurate?
              </h3>
              <p className="text-gray-700 leading-relaxed">
                We don't claim to provide absolute answers, but rather help you
                discover the wisdom that already exists within you. When you
                read the analysis, if you experience that moment of
                recognition—that feeling of "yes, that resonates, I understand
                now"—that's your inner knowing confirming the truth. The I Ching
                works by reflecting your subconscious understanding back to your
                conscious mind.
              </p>
            </div>
          </div>
        </div>

        {/* Question 4 */}
        <div className="bg-white rounded-lg border p-8 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-start gap-4">
            <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-3 rounded-full">
              <HelpCircle className="text-amber-600" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-amber-700 mb-4">
                Q4: What exactly do I get from this service?
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Your complete Destiny Lens experience includes:
              </p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-purple-400 mr-3 mt-1">🔮</span>
                  <span>
                    <strong>Comprehensive Life Analysis:</strong> Deep insights
                    into your personality, current phase, and life path based on
                    your unique hexagram
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-3 mt-1">🏙️</span>
                  <span>
                    <strong>City Evaluation:</strong> Analysis of how your
                    current location supports or challenges your growth, plus
                    personalized city recommendations
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-3 mt-1">🧭</span>
                  <span>
                    <strong>Clear Direction:</strong> Actionable guidance on
                    timing, relationships, career moves, and personal
                    development
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-400 mr-3 mt-1">📜</span>
                  <span>
                    <strong>Personalized Wisdom:</strong> Ancient insights
                    translated into modern, practical advice for your specific
                    situation
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-400 mr-3 mt-1">🎬</span>
                  <span>
                    <strong>Shareable Video Journey:</strong> A beautiful,
                    personalized video you can save, share, and revisit whenever
                    you need guidance
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Question 5 */}
        <div className="bg-white rounded-lg border p-8 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-start gap-4">
            <div className="bg-gradient-to-r from-rose-100 to-red-100 p-3 rounded-full">
              <HelpCircle className="text-rose-600" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-rose-700 mb-4">
                Q5: Is this just a city recommendation system?
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Not at all. While we use city data, the core lies in
                hexagram-based insight that reads your inner state and aligns it
                with I Ching wisdom. This isn't about telling you where to
                go—it's about helping you feel why a place resonates with your
                current self. It's not logistical guidance; it's emotional,
                energetic, and poetic discovery of truths you may not have fully
                realized.
              </p>
            </div>
          </div>
        </div>

        {/* Question 6 */}
        <div className="bg-white rounded-lg border p-8 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-start gap-4">
            <div className="bg-gradient-to-r from-indigo-100 to-violet-100 p-3 rounded-full">
              <HelpCircle className="text-indigo-600" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-indigo-700 mb-4">
                Q6: Is this fortune-telling? Does it define my fate?
              </h3>
              <p className="text-gray-700 leading-relaxed">
                No—and that's the point. This isn't about predicting the future;
                it's about awakening to the present. The I Ching serves as a
                mirror to reveal what's quietly shifting within you. Sometimes
                we struggle not because of fate, but because we haven't
                understood ourselves clearly. Your fate isn't fixed—it moves
                when you do. This system helps you start moving from within.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="w-full max-w-4xl bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-8 text-center">
        <h3 className="text-2xl font-semibold text-purple-700 mb-4">
          Ready to Discover Your Destiny?
        </h3>
        <p className="text-gray-700 mb-6 leading-relaxed">
          Join thousands who have found clarity and direction through the
          ancient wisdom of the I Ching combined with modern AI insights.
        </p>
        <Link
          href="/coin-tossing"
          className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-lg"
        >
          <Sparkles size={20} />
          Start Your Reading Now
        </Link>
      </div>

      {/* Contact Section */}
      <div className="w-full max-w-4xl text-center pt-8 border-t border-gray-200">
        <p className="text-gray-600 mb-4">
          Still have questions? We're here to help.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/support"
            className="text-purple-600 hover:text-purple-800 transition-colors font-medium"
          >
            Contact Support
          </Link>
          <span className="text-gray-400">•</span>
          <Link
            href="/about"
            className="text-purple-600 hover:text-purple-800 transition-colors font-medium"
          >
            Learn More About Us
          </Link>
        </div>
      </div>
    </div>
  );
}
