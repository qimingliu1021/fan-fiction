import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-amber-900/20 to-red-900/30">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-red-400 mb-6">
            Blog & Insights
          </h1>
          <p className="text-xl text-amber-200/80 max-w-2xl mx-auto leading-relaxed">
            Exploring destiny, wisdom, and the journey of self-discovery
          </p>
        </div>

        <div className="space-y-8">
          <div className="bg-gradient-to-r from-slate-800/50 to-amber-900/30 rounded-2xl p-8 md:p-12 border border-amber-500/20 backdrop-blur-sm">
            <div className="text-center text-amber-100/90 text-lg leading-relaxed">
              <p className="mb-6">
                Welcome to our blog - a space where ancient wisdom meets modern
                insights.
              </p>
              <p className="text-amber-200/80">
                Blog posts coming soon... Stay tuned for articles about I Ching
                wisdom, destiny guidance, and personal transformation stories.
              </p>
            </div>
          </div>

          <div className="text-center pt-8">
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
    </div>
  );
}
