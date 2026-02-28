/* eslint-disable react/no-unescaped-entities */
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-amber-900/20 to-red-900/30">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-red-500/10 blur-3xl"></div>
        <div className="relative max-w-4xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-red-400 mb-6">
              Mirror of Destiny
            </h1>
            <p className="text-xl text-amber-200/80 max-w-2xl mx-auto leading-relaxed">
              A reflection of my destiny, and my way of reclaiming myself
            </p>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="max-w-4xl mx-auto px-6 pb-20">
        <div className="bg-gradient-to-r from-slate-800/50 to-amber-900/30 rounded-2xl p-8 md:p-12 border border-amber-500/20 backdrop-blur-sm">
          {/* <div className="space-y-6 text-amber-100/90 text-lg leading-relaxed">
            <p>
              This project — I Ching × Destiny × City Guidance — is a gift I'm
              giving to myself. It represents my journey of breaking free from
              limiting beliefs and embracing my true self.
            </p>

            <p>
              In recent times, I've grown distant from my birth family. I've
              blocked my mother twice, because she tried — with "good
              intentions" — to persuade me into accepting choices that
              diminished my self-worth. What she didn't understand is that such
              advice feels like throwing mud on a finely crafted piece of
              jewelry, burying it in darkness forever.
            </p>

            <p>
              I also cut ties with my stepfather, Guo Xinwen, and blocked my
              father. Since August 2023, he's been sending me 3,000 RMB per
              month — his way of trying to "make up" for the past. But I still
              can't forgive his absence during my childhood. Money cannot
              replace love that was never given.
            </p>

            <p>
              These were not impulsive decisions. They were my way of breaking
              away from the mindset of poverty, from narrow family values, and
              from an identity shaped by self-denial. I'm pursuing a broader
              path in life — one that truly belongs to the person I want to
              become.
            </p>

            <p>
              I've always loved classical Chinese culture, texts, and wisdom.
              Since I was young, I've dreamed of becoming a woman of
              extraordinary charm — strong yet graceful, alluring yet powerful.
              A woman who inspires others to protect, to explore, to follow;
              someone who radiates a unique brilliance and leads others with her
              light.
            </p>

            <p>
              But where I grew up, every form of my expression was denied. They
              tried to mold me into the opposite of who I am. They feared my
              brilliance, and so they covered it with rules like "You should be
              more low-key," or "You can't act like that," throwing dust upon
              me.
            </p>

            <p className="text-amber-200 font-medium italic text-xl">
              But I know I'm not made for dirt — I belong in a jewel box, among
              treasures.
            </p>

            <p>
              Those who tried to dim my light will eventually see that all the
              suppression, hurt, and rejection didn't destroy me. Instead, they
              made my essence tougher, my shine deeper.
            </p>

            <p>
              Since childhood, I longed to leave — to go to America. Not because
              its economy is stronger, but because in every American film I
              watched, the female lead could love boldly and be loved bravely.
              And those male leads — mature, gentle, courageous, and unwavering
              — are the kind of presence my heart has always yearned for.
            </p>

            <p>
              Perhaps this longing was never just a "dream to go abroad." It was
              a calling from the depths of my soul — for freedom, authenticity,
              and love. Other places — Canada, Australia, the UK, Europe — they
              never appealed to me the way America did. My vision has always
              been clear: I wanted to go somewhere that encourages me to be
              myself, to express my truth, and to live out my unique value.
            </p>

            <p>
              In terms of destiny, my BaZi (Eight Characters) chart contains an
              excess of "Yin" energy — like a golden hairpin rich with talent,
              buried beneath sand and mud. But I'm no longer waiting for someone
              to uncover me. I will rise on my own, walk out of the mud by
              myself.
            </p>

            <p>
              That is the origin of Mirror of Destiny — a tool that uses I Ching
              hexagrams and geographic resonance to help people find their most
              fitting city, their direction, their source of energy.
            </p>

            <p className="text-amber-200 font-medium text-xl">
              I dedicate this to those like me — those who have wandered in
              confusion, longed for growth, and yearned to break free from fate.
            </p>

            <p className="text-amber-300 font-medium text-xl text-center pt-6">
              It is a reflection of my destiny, and my way of reclaiming myself.
            </p>
          </div> */}
        </div>

        {/* Back to Home */}
        <div className="text-center pt-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-amber-300 hover:text-amber-200 transition-colors duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
