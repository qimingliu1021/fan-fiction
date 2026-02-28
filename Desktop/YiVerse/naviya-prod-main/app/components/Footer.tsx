import React, { JSX } from "react";
import Image from "next/image";

export default function FooterSection() {
  return (
    <footer className="w-full py-8 bg-gradient-to-b from-[rgba(38,51,86,1)] to-[rgba(192,144,142,1)]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-row justify-between items-start gap-12">
          {/* Brand and Description (Left side) */}
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-amber-50 font-title">
              Yiverse <br />
            </h2>
            <p className="text-xl text-amber-100 font-title max-w-md">
              A soul-guided journey through the wisdom of I Ching, takes you to
              the city where your energy belongs.
            </p>
          </div>

          {/* Links + Legal + Social (Right side) */}
          <div className="flex flex-col gap-8">
            {/* Links and Legal in a row */}
            <div className="flex flex-row gap-10">
              {/* Links */}
              <div className="space-y-1">
                <h3 className="text-xl md:text-3xl text-white font-body font-semibold">
                  Links
                </h3>
                <nav className="flex flex-col space-y-2">
                  <a
                    href="/join-waitlist"
                    className="text-white text-xl md:text-2xl font-title hover:text-amber-200 transition-colors"
                  >
                    Join waitlist
                  </a>
                  <a
                    href="/apply"
                    className="text-white text-xl md:text-2xl font-title hover:text-amber-200 transition-colors"
                  >
                    Be a local guide
                  </a>
                </nav>
              </div>

              {/* Legal */}
              <div className="space-y-1">
                <h3 className="text-2xl md:text-3xl text-white font-body font-semibold">
                  Legal
                </h3>
                <nav className="flex flex-col space-y-2">
                  <a
                    href="#"
                    className="text-xl md:text-2xl text-white font-title hover:text-amber-200 transition-colors"
                  >
                    Terms of Service
                  </a>
                  <a
                    href="#"
                    className="text-xl md:text-2xl text-white font-title hover:text-amber-200 transition-colors"
                  >
                    Privacy Policy
                  </a>
                </nav>
              </div>
            </div>

            {/* Social Media Icons */}
            <div className="flex flex-row gap-6 items-center justify-start">
              <a
                href="https://www.instagram.com/yi.universe"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-110 hover:opacity-80"
              >
                <Image
                  src="/svgs/instagram.svg"
                  alt="Instagram"
                  width={32}
                  height={32}
                  className="w-8 h-8 filter brightness-0 invert"
                />
              </a>
              <a
                href="https://www.tiktok.com/@yiuniverse?lang=en"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-110 hover:opacity-80"
              >
                <Image
                  src="/svgs/tiktok.svg"
                  alt="TikTok"
                  width={32}
                  height={32}
                  className="w-8 h-8 filter brightness-0 invert"
                />
              </a>
              <a
                href="https://discord.gg/r2HgwjUC"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-110 hover:opacity-80"
              >
                <Image
                  src="/svgs/discord.svg"
                  alt="Discord"
                  width={32}
                  height={32}
                  className="w-8 h-8 filter brightness-0 invert"
                />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <p className="text-white text-xl font-normal">
          © 2025 YIVERSE Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
