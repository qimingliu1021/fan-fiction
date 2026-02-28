"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    // Create floating bagua symbols
    const createBaguaParticle = () => {
      const symbols = ["☰", "☷", "☳", "☴", "☵", "☶", "☱", "☲"];
      const particle = document.createElement("div");
      particle.className = "bagua-particle";
      particle.textContent = symbols[(Math.random() * symbols.length) | 0];
      particle.style.left = Math.random() * 100 + "%";
      particle.style.animationDuration = Math.random() * 15 + 10 + "s";
      particle.style.animationDelay = Math.random() * 5 + "s";
      particle.style.fontSize = Math.random() * 20 + 20 + "px";
      particle.style.opacity = `${Math.random() * 0.3 + 0.1}`;

      const particlesContainer = document.querySelector(".bagua-particles");
      if (particlesContainer) {
        particlesContainer.appendChild(particle);

        setTimeout(() => {
          particle.remove();
        }, 20000);
      }
    };

    const interval = setInterval(createBaguaParticle, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleEnterDestiny = () => {
    router.push("/coin-tossing");
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-amber-900 to-red-900">
      {/* Floating Bagua Particles */}
      <div className="bagua-particles absolute inset-0 z-0 pointer-events-none"></div>

      {/* Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/3 left-0 w-64 h-64 bg-gradient-to-r from-amber-500/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-0 w-64 h-64 bg-gradient-to-l from-red-500/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-amber-500/10 via-red-500/10 to-amber-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Opening Poetic Title + Call to Action */}
        <div
          className={`min-h-screen flex flex-col items-center justify-center px-6 text-center transition-all duration-1000 ${
            isVisible ? "fade-in-up" : "opacity-0"
          }`}
        >
          <div className="max-w-5xl mx-auto">
            <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 mb-8 shimmer-text">
              Destiny Lens
            </h1>

            <div className="text-3xl md:text-4xl font-serif text-amber-200 mb-6">
              Classic of Mountains and Seas
            </div>

            <blockquote className="text-2xl md:text-3xl font-serif text-amber-100 italic leading-relaxed mb-6 ancient-runes">
              &ldquo;In this vast world, there are countless wonders.
              <br />
              Between mountains and seas, dragons and tigers lie hidden.&rdquo;
            </blockquote>

            <p className="text-xl text-amber-200 mb-8 leading-relaxed">
              Cast the coins of fate and embark on your journey to belonging
            </p>

            <div className="text-center">
              <p className="text-lg text-amber-300 max-w-3xl mx-auto leading-relaxed mb-8">
                Perhaps you&rsquo;re still wandering: Where to go? Where to
                stay?
                <br />
                Instead of endless contemplation, let destiny provide the
                answer.
              </p>
              <p className="text-base text-amber-200 max-w-4xl mx-auto leading-relaxed">
                We combine the wisdom of I Ching with modern city data to divine
                your current state of mind and future path.
                <br />
                Through ancient coins, your voice, and your face, we generate
                your personal destiny poem and city of belonging.
              </p>
            </div>
          </div>
        </div>

        {/* Enter Button */}
        <div className="py-20 px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <Button
              onClick={handleEnterDestiny}
              className="text-2xl px-16 py-8 bg-gradient-to-r from-red-600 via-amber-600 to-red-600 hover:from-red-700 hover:via-amber-700 hover:to-red-700 text-white border-2 border-amber-400 rounded-2xl shadow-2xl transform transition-all duration-300 hover:scale-105 mystical-glow font-serif"
            >
              <span className="mr-4">🔮</span>
              Begin Your Destiny Journey
              <span className="ml-4">🧭</span>
            </Button>

            <p className="text-amber-300 text-lg mt-6 opacity-80">
              Between mountains and seas, dragons and tigers lie hidden. You too
              shall find your place of belonging.
            </p>

            <div className="mt-8 text-amber-400/60 text-sm">
              <p>
                🔐 Want to save your destiny journey? Register an account after
                completing your divination
              </p>
            </div>
          </div>
        </div>

        {/* 2. Feature Description */}
        <div className="px-6 -mt-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-serif text-amber-300 text-center mb-16">
              The Journey of Destiny
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  step: "01",
                  icon: "🪙",
                  title: "Cast Ancient Coins",
                  desc: "Six bronze coins fall to form hexagrams\nGenerate your primary and changing trigrams\nInterpret the symbols of heaven, earth, and humanity",
                  color: "from-amber-600 to-yellow-600",
                },
                {
                  step: "02",
                  icon: "🎭",
                  title: "Emotion & Personality Analysis",
                  desc: "Capture facial expression details\nAnalyze vocal emotional characteristics\nSense your inner spiritual state",
                  color: "from-red-600 to-orange-600",
                },
                {
                  step: "03",
                  icon: "🗺️",
                  title: "City Destiny Matching",
                  desc: "Combine hexagrams with personality\nAI algorithms for precise divination\nFind your city of belonging",
                  color: "from-purple-600 to-pink-600",
                },
                {
                  step: "04",
                  icon: "🎬",
                  title: "Destiny Video Creation",
                  desc: "AI composes exclusive poetry\nSynthesize city landscape imagery\nRecord your destiny trajectory",
                  color: "from-emerald-600 to-teal-600",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-black/30 backdrop-blur-sm rounded-xl border border-amber-500/30 p-6 text-center mystical-glow"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div
                    className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center text-2xl`}
                  >
                    {item.icon}
                  </div>
                  <div className="text-amber-400 text-sm font-mono mb-2">
                    {item.step}
                  </div>
                  <h3 className="text-amber-200 font-serif text-lg mb-3">
                    {item.title}
                  </h3>
                  <p className="text-amber-300 text-sm whitespace-pre-line leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Destiny Example */}
        <div className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-serif text-amber-300 mb-12">
              Real Destiny Trajectory
            </h2>

            <div className="bg-gradient-to-r from-red-900/40 to-amber-900/40 backdrop-blur-sm rounded-2xl border border-amber-500/30 p-8 mb-8">
              <div className="text-6xl mb-6">🌟</div>
              <h3 className="text-2xl text-amber-200 font-serif mb-4">
                Sarah&rsquo;s Journey of Destiny
              </h3>
              <p className="text-amber-300 leading-relaxed mb-6">
                Originally residing in Beijing, Sarah received guidance from the
                &ldquo;Thunder Wind Constancy&rdquo; hexagram during her destiny
                reading&mdash; symbolizing enduring rhythm and distant journeys.
                The AI recommended Portland, a city where nature and art
                intertwine.
              </p>
              <p className="text-amber-200 italic">
                &ldquo;When I finally stepped into this city, I discovered that
                the morning mist was like the Water trigram, the lights in the
                coffee shop windows like the Fire trigram, and the street music
                seemed to thunder endlessly. I finally found my own
                rhythm.&rdquo;
              </p>

              <div className="mt-8 p-4 bg-black/20 rounded-lg">
                <div className="text-amber-400 text-sm mb-2">
                  Generated Destiny Poem Excerpt:
                </div>
                <div className="text-amber-200 font-serif italic">
                  &ldquo;Thunder moves, wind follows the eternal way,
                  <br />
                  Westward ten thousand miles seeking kindred souls.
                  <br />
                  In Portland finding the place of return,
                  <br />
                  In coffee&rsquo;s fragrance, understanding life.&rdquo;
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Project Philosophy */}
        <div className="py-20 px-6 bg-gradient-to-b from-transparent to-black/30">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-serif text-amber-300 mb-12">
              Philosophy & Vision
            </h2>

            <div className="space-y-8">
              <blockquote className="text-xl text-amber-200 italic leading-relaxed">
                &ldquo;It&rsquo;s not that there&rsquo;s something wrong with
                where you are, but whether you are truly understood.&rdquo;
              </blockquote>

              <p className="text-lg text-amber-300 leading-relaxed">
                Every person has a city that belongs to them, just as every soul
                has a corresponding constellation. Modern confusion often stems
                not from lack of opportunity, but from not yet finding an
                environment that truly understands oneself.
              </p>

              <p className="text-base text-amber-200 leading-relaxed">
                The Classic of Mountains and Seas recorded ancient dialogues
                between humans and nature, humans and destiny. Today, we use
                technology to reinterpret this ancient wisdom, allowing everyone
                to find their own &ldquo;Peach Blossom Spring.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
