import {
  AbsoluteFill,
  Img,
  interpolate,
  useCurrentFrame,
  Audio,
  staticFile,
  useVideoConfig,
} from "remotion";
import { useEffect, useState } from "react";

// Fallback images
const fallbackImages = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
  "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800",
  "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800",
];

interface PoemData {
  poem: string;
  audioFile: string;
  audioUrl: string;
  timestamp: number;
  fileSize: number;
}

export const Slideshow: React.FC<{
  imageUrls?: string[];
  lifePoemData?: PoemData | null;
  cityPoemData?: PoemData | null;
  showText?: boolean;
  lifeDuration?: number;
  cityDuration?: number;
  totalDuration?: number;
}> = ({
  imageUrls,
  lifePoemData,
  cityPoemData,
  showText = true,
  lifeDuration = 30,
  cityDuration = 30,
  totalDuration = 60,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [hasLogged, setHasLogged] = useState(false);

  // Calculate timing for sequential poems
  const lifeDurationFrames = lifeDuration * fps;
  const transitionFrames = 3 * fps; // 3 seconds transition
  const cityStartFrame = lifeDurationFrames + transitionFrames;
  const cityDurationFrames = cityDuration * fps;
  const cityEndFrame = cityStartFrame + cityDurationFrames;

  // Determine current phase
  const currentPhase =
    frame < lifeDurationFrames
      ? "life"
      : frame < cityStartFrame
      ? "transition"
      : frame < cityEndFrame
      ? "city"
      : "ending";

  // Use provided image URLs or fallback
  const images = imageUrls && imageUrls.length > 0 ? imageUrls : fallbackImages;

  // Calculate dynamic image duration based on total duration
  const totalImages = images.length;
  const imageDuration = Math.max(
    Math.floor((totalDuration * fps) / totalImages),
    fps * 3 // Minimum 3 seconds per image
  );

  const currentIndex = Math.floor(frame / imageDuration) % images.length;
  const currentImage = images[currentIndex];
  const localFrame = frame % imageDuration;

  // Image effects
  const fadeIn = interpolate(localFrame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(
    localFrame,
    [imageDuration - 30, imageDuration],
    [1, 0],
    {
      extrapolateRight: "clamp",
    }
  );
  const opacity = Math.min(fadeIn, fadeOut);

  const zoom = interpolate(localFrame, [0, imageDuration], [1, 1.1], {
    extrapolateRight: "clamp",
  });

  // Text opacity based on current phase
  const getTextOpacity = () => {
    switch (currentPhase) {
      case "life":
        return interpolate(frame, [30, 60], [0, 1], {
          extrapolateRight: "clamp",
        });
      case "transition":
        return interpolate(
          frame,
          [lifeDurationFrames, cityStartFrame],
          [1, 0],
          { extrapolateRight: "clamp" }
        );
      case "city":
        return interpolate(
          frame,
          [cityStartFrame, cityStartFrame + 30],
          [0, 1],
          { extrapolateRight: "clamp" }
        );
      case "ending":
        return interpolate(frame, [cityEndFrame - 30, cityEndFrame], [1, 0], {
          extrapolateRight: "clamp",
        });
      default:
        return 0;
    }
  };

  const textOpacity = getTextOpacity();

  // Get current poem data based on phase
  const getCurrentPoem = () => {
    if (currentPhase === "life" && lifePoemData) {
      return {
        data: lifePoemData,
        type: "life",
        title: "🌟 Life Destiny Poem",
      };
    } else if (currentPhase === "city" && cityPoemData) {
      return {
        data: cityPoemData,
        type: "city",
        title: "🏙️ City Destiny Poem",
      };
    }
    return null;
  };

  const currentPoem = getCurrentPoem();
  const poemLines = currentPoem?.data.poem
    ? currentPoem.data.poem.split("\n").filter((line) => line.trim())
    : [];

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        backgroundColor: "#000",
      }}
    >
      {/* Background Image */}
      <Img
        src={currentImage}
        style={{
          transform: `scale(${zoom})`,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity,
        }}
      />

      {/* Dark Overlay for text readability */}
      {showText && currentPoem && (
        <AbsoluteFill
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            opacity: textOpacity,
          }}
        />
      )}

      {/* Sequential Poem Text Overlay */}
      {showText && currentPoem && (
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "80px",
            opacity: textOpacity,
          }}
        >
          <div
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              padding: "40px",
              borderRadius: "20px",
              border: "2px solid rgba(255, 255, 255, 0.3)",
              maxWidth: "80%",
              textAlign: "center",
            }}
          >
            {/* Current Poem Title */}
            <div
              style={{
                color: "#FFD700",
                fontSize: "20px",
                fontWeight: "bold",
                marginBottom: "20px",
                textTransform: "uppercase",
                letterSpacing: "2px",
              }}
            >
              {currentPoem.title}
            </div>

            {/* Poem Text */}
            {poemLines.map((line, index) => (
              <div
                key={index}
                style={{
                  color: "#ffffff",
                  fontSize: "32px",
                  fontFamily: "serif",
                  lineHeight: "1.6",
                  marginBottom: index < poemLines.length - 1 ? "12px" : "0",
                  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
                  fontWeight: "400",
                }}
              >
                {line}
              </div>
            ))}
          </div>
        </AbsoluteFill>
      )}

      {/* Phase Indicator (optional) */}
      {currentPhase === "transition" && (
        <AbsoluteFill
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              color: "#FFD700",
              fontSize: "24px",
              fontWeight: "bold",
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
            }}
          >
            ✨ Transitioning to Your City Destiny ✨
          </div>
        </AbsoluteFill>
      )}

      {/* Sequential Audio Playback */}

      {/* Life Poem Audio - plays from start */}
      {lifePoemData?.audioFile && (
        <Audio
          src={staticFile("poems/life/poem_1753660796571.mp3")}
          volume={frame < lifeDurationFrames ? 0.8 : 0}
          acceptableTimeShiftInSeconds={0.2}
          allowAmplificationDuringRender={false}
          onError={(error) => {
            console.error("Life poem audio error:", error);
          }}
        />
      )}

      {/* City Poem Audio - plays after transition */}
      {cityPoemData?.audioFile && (
        <Audio
          src={staticFile("poems/city/city_poem_1753660823031.mp3")}
          volume={frame >= cityStartFrame && frame < cityEndFrame ? 0.8 : 0}
          acceptableTimeShiftInSeconds={0.2}
          allowAmplificationDuringRender={false}
          onError={(error) => {
            console.error("City poem audio error:", error);
            console.log("Error for path:", staticFile(cityPoemData.audioFile));
          }}
        />
      )}

      {/* Background music - continuous but lower volume during poems */}
      <Audio
        src={staticFile("BGM/tianxingjiuge.mp3")}
        volume={
          currentPhase === "transition" || currentPhase === "ending" ? 0.4 : 0.2
        }
        loop
        acceptableTimeShiftInSeconds={0.2}
        allowAmplificationDuringRender={false}
        onError={(error) => {
          console.error("Background music error:", error);
        }}
      />
    </AbsoluteFill>
  );
};
