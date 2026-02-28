/* eslint-disable react/no-unescaped-entities */
"use client";

import React from "react";
import { ArrowLeft, Mail, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-amber-900/20 to-red-900/30">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-red-400 mb-6">
            Support & Contact
          </h1>
          <p className="text-xl text-amber-200/80 max-w-2xl mx-auto leading-relaxed">
            Need help with your destiny journey? We're here to guide you.
          </p>
        </div>

        <div className="space-y-8">
          <div className="bg-gradient-to-r from-slate-800/50 to-amber-900/30 rounded-2xl p-8 md:p-12 border border-amber-500/20 backdrop-blur-sm">
            <div className="flex items-center mb-6">
              <MessageCircle className="w-6 h-6 text-amber-400 mr-3" />
              <h2 className="text-2xl font-bold text-amber-300">
                Get in Touch
              </h2>
            </div>
            <div className="space-y-4 text-amber-100/90 text-lg leading-relaxed">
              <p>
                For questions about your I Ching readings, city recommendations,
                or technical support, please reach out to us:
              </p>
              <div className="flex items-center gap-3 mt-6">
                <Mail className="w-5 h-5 text-red-400" />
                <a
                  href="mailto:support@destinylens.com"
                  className="text-amber-200 hover:text-amber-100 transition-colors"
                >
                  support@destinylens.com
                </a>
              </div>
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
