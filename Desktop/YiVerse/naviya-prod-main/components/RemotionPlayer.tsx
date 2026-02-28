"use client";
import { Player } from "@remotion/player";
import { Slideshow } from "@/app/remotion/Slideshow";
import { useState, useRef, useMemo, useEffect } from "react";
import { Play } from "lucide-react";

interface PoemData {
  poem: string;
  audioFile: string;
  audioUrl: string;
  timestamp: number;
  fileSize: number;
}

interface RemotionPlayerProps {
  imageUrls?: string[];
  lifePoemData?: PoemData | null;
  cityPoemData?: PoemData | null;
  showText?: boolean;
}

// Function to estimate audio duration based on text length
function estimateAudioDuration(text: string): number {
  if (!text) return 30; // Default 30 seconds

  // Average speaking rate: ~150 words per minute (2.5 words per second)
  const words = text.trim().split(/\s+/).length;
  const estimatedSeconds = Math.max(words / 2.5, 30); // Minimum 30 seconds

  // Add some buffer time for pauses and emphasis
  return Math.ceil(estimatedSeconds * 1.2);
}

// Function to get actual audio duration
async function getAudioDuration(audioUrl: string): Promise<number> {
  return new Promise((resolve) => {
    const audio = new Audio(audioUrl);
    audio.addEventListener("loadedmetadata", () => {
      resolve(audio.duration || 30);
    });
    audio.addEventListener("error", () => {
      resolve(30); // Fallback to 30 seconds
    });
    setTimeout(() => resolve(30), 3000);
  });
}

export default function RemotionPlayer({
  imageUrls,
  lifePoemData,
  cityPoemData,
  showText = true,
}: RemotionPlayerProps) {
  const [hasStarted, setHasStarted] = useState(false);
  const [actualDurations, setActualDurations] = useState<{
    life: number | null;
    city: number | null;
  }>({ life: null, city: null });
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [audioReady, setAudioReady] = useState(false);
  const playerRef = useRef<any>(null);

  // Calculate combined video duration for both poems
  const { totalDuration, lifeDuration, cityDuration } = useMemo(() => {
    let lifeDur = 0;
    let cityDur = 0;

    // Use actual durations if available, otherwise estimate
    if (lifePoemData?.poem) {
      lifeDur =
        actualDurations.life || estimateAudioDuration(lifePoemData.poem);
    }

    if (cityPoemData?.poem) {
      cityDur =
        actualDurations.city || estimateAudioDuration(cityPoemData.poem);
    }

    // Add transition time between poems and buffer at the end
    const transitionTime = 3; // 3 seconds between poems
    const bufferTime = 5; // 5 seconds at the end
    const total = lifeDur + cityDur + transitionTime + bufferTime;

    return {
      totalDuration: Math.max(total, 60), // Minimum 60 seconds
      lifeDuration: lifeDur,
      cityDuration: cityDur,
    };
  }, [lifePoemData, cityPoemData, actualDurations]);

  const durationInFrames = Math.round(totalDuration * 30); // Convert seconds to frames (integer)

  // Get actual audio durations when component mounts
  useEffect(() => {
    const getActualDurations = async () => {
      const durations = {
        life: null as number | null,
        city: null as number | null,
      };

      if (lifePoemData?.audioUrl) {
        try {
          durations.life = await getAudioDuration(lifePoemData.audioUrl);
        } catch (error) {
          console.error("Failed to get life poem duration:", error);
        }
      }

      if (cityPoemData?.audioUrl) {
        try {
          durations.city = await getAudioDuration(cityPoemData.audioUrl);
        } catch (error) {
          console.error("Failed to get city poem duration:", error);
        }
      }

      setActualDurations(durations);
    };

    getActualDurations();
  }, [lifePoemData, cityPoemData]);

  // Initialize audio context
  useEffect(() => {
    const initAudioContext = async () => {
      console.log("🔧 Initializing audio context...");

      try {
        // Check if AudioContext is available
        if (typeof window === "undefined") {
          console.log(
            "⚠️ Window not available, setting audioReady to true anyway"
          );
          setAudioReady(true);
          return;
        }

        const AudioContextConstructor =
          window.AudioContext || (window as any).webkitAudioContext;

        if (!AudioContextConstructor) {
          console.log("⚠️ AudioContext not supported, continuing without it");
          setAudioReady(true);
          return;
        }

        const context = new AudioContextConstructor();
        console.log("✅ AudioContext created, state:", context.state);
        setAudioContext(context);

        // Try to resume if suspended
        if (context.state === "suspended") {
          console.log(
            "Audio context is suspended and will be resumed upon user interaction."
          );
        }

        console.log("✅ Audio ready!");
        setAudioReady(true);
      } catch (error) {
        console.error("❌ Audio context initialization failed:", error);
        console.log("⚠️ Continuing without audio context...");
        setAudioReady(true); // Continue anyway
      }
    };

    initAudioContext();
  }, []);

  const handleStart = async () => {
    try {
      if (audioContext && audioContext.state === "suspended") {
        await audioContext.resume();
        console.log("Audio context resumed");
      }

      setHasStarted(true);

      setTimeout(() => {
        if (playerRef.current) {
          try {
            playerRef.current.play();
            console.log("Combined poem video started");
          } catch (playError) {
            console.error("Error starting player:", playError);
          }
        }
      }, 100);
    } catch (error) {
      console.error("Error in handleStart:", error);
      setHasStarted(true);
      if (playerRef.current) {
        playerRef.current.play();
      }
    }
  };

  const getButtonText = () => {
    const durationText = `(${Math.round(totalDuration)}s)`;

    if (lifePoemData && cityPoemData) {
      return `🎭 Play Complete Destiny Journey ${durationText}`;
    } else if (lifePoemData) {
      return `🌟 Play Life Journey ${durationText}`;
    } else if (cityPoemData) {
      return `🏙️ Play City Destiny ${durationText}`;
    }
    return `▶️ Click to Start Your Journey ${durationText}`;
  };

  console.log("Combined RemotionPlayer loaded:", {
    imageCount: imageUrls?.length || 0,
    hasLifePoem: !!lifePoemData,
    hasCityPoem: !!cityPoemData,
    lifeDuration: `${lifeDuration}s`,
    cityDuration: `${cityDuration}s`,
    totalDuration: `${totalDuration}s`,
    durationInFrames,
    showText,
  });

  return (
    <div className="relative w-full max-w-[800px] aspect-video">
      {!hasStarted && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 rounded-lg">
          <button
            onClick={handleStart}
            className="flex items-center gap-3 bg-white bg-opacity-90 text-black px-8 py-4 rounded-full font-semibold text-lg hover:bg-opacity-100 transition-all duration-300 shadow-lg"
            disabled={!audioReady}
          >
            <Play size={24} fill="currentColor" />
            {audioReady ? getButtonText() : "🔄 Preparing Audio..."}
          </button>
        </div>
      )}

      <Player
        ref={playerRef}
        component={Slideshow}
        inputProps={{
          imageUrls: imageUrls,
          lifePoemData: lifePoemData,
          cityPoemData: cityPoemData,
          showText: showText,
          lifeDuration: lifeDuration,
          cityDuration: cityDuration,
          totalDuration: totalDuration,
        }}
        durationInFrames={durationInFrames}
        compositionWidth={1920}
        compositionHeight={1080}
        fps={30}
        style={{
          width: "100%",
          aspectRatio: "16/9",
          borderRadius: "8px",
        }}
        controls={hasStarted}
        showVolumeControls={hasStarted}
        allowFullscreen
        clickToPlay={false}
        doubleClickToFullscreen
        spaceKeyToPlayOrPause
        acknowledgeRemotionLicense
        numberOfSharedAudioTags={0}
      />
    </div>
  );
}
