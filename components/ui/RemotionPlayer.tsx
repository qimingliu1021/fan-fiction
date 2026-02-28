"use client";
import { Player } from "@remotion/player";
import { Slideshow } from "../../app/remotion/Slideshow";
import { useState } from "react";
import { Play } from "lucide-react";

interface RemotionPlayerProps {
  imageUrls?: string[];
}

export default function RemotionPlayer({ imageUrls }: RemotionPlayerProps) {
  const [hasStarted, setHasStarted] = useState(false);

  console.log("RemotionPlayer is on");

  return (
    <div className="relative w-full max-w-[800px] aspect-video">
      {!hasStarted && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 rounded-lg">
          <button
            onClick={() => setHasStarted(true)}
            className="flex items-center gap-3 bg-white bg-opacity-90 text-black px-8 py-4 rounded-full font-semibold text-lg hover:bg-opacity-100 transition-all duration-300 shadow-lg"
          >
            <Play size={24} fill="currentColor" />
            Click to Start Your Journey
          </button>
        </div>
      )}

      <Player
        component={Slideshow}
        inputProps={{
          imageUrls: imageUrls,
        }}
        durationInFrames={1800}
        compositionWidth={1920}
        compositionHeight={1080}
        fps={30}
        style={{
          width: "100%",
          aspectRatio: "16/9",
          borderRadius: "8px",
        }}
        controls
        loop
        showVolumeControls
        allowFullscreen
        clickToPlay
        doubleClickToFullscreen
        spaceKeyToPlayOrPause
        acknowledgeRemotionLicense
      />
    </div>
  );
}
