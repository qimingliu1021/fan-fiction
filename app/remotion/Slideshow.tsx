import {
  AbsoluteFill,
  Img,
  interpolate,
  useCurrentFrame,
  Audio,
  staticFile,
} from "remotion";
import { useEffect, useState } from "react";

// Fallback images (local)
const fallbackImages = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
  "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800",
  "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800",
];

export const Slideshow: React.FC<{
  imageUrls?: string[];
  poemText?: string;
  poemAudioFile?: string;
  showText?: boolean;
}> = ({ imageUrls, poemText, poemAudioFile, showText = true }) => {
  const frame = useCurrentFrame();
  const [hasLogged, setHasLogged] = useState(false);

  // Extract timestamp from filename
  const getTimestampFromFilename = (
    filename: string | undefined
  ): number | null => {
    if (!filename) return null;

    // Extract timestamp from "poem_1703123456789.mp3"
    const match = filename.match(/poem_(\d+)\.mp3$/);
    return match ? parseInt(match[1], 10) : null;
  };

  const audioTimestamp = getTimestampFromFilename(poemAudioFile);
  const audioCreatedDate = audioTimestamp ? new Date(audioTimestamp) : null;

  // Only log once when component mounts or when poemAudioFile changes
  useEffect(() => {
    if (!hasLogged) {
      console.log("🎵 Audio file:", poemAudioFile);
      console.log("⏰ Audio timestamp:", audioTimestamp);
      console.log("📅 Audio created:", audioCreatedDate?.toLocaleString());
      setHasLogged(true);
    }
  }, [poemAudioFile, audioTimestamp, audioCreatedDate, hasLogged]);

  const imageDuration = 90; // 3 seconds per image at 30fps

  // Use provided image URLs or fallback
  const images = imageUrls && imageUrls.length > 0 ? imageUrls : fallbackImages;

  const currentIndex = Math.floor(frame / imageDuration) % images.length;
  const currentImage = images[currentIndex];

  const localFrame = frame % imageDuration;

  // Fade in/out effect for images
  const fadeIn = interpolate(localFrame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(localFrame, [60, 90], [1, 0], {
    extrapolateRight: "clamp",
  });
  const opacity = Math.min(fadeIn, fadeOut);

  // Zoom effect
  const zoom = interpolate(localFrame, [0, imageDuration], [1, 1.1], {
    extrapolateRight: "clamp",
  });

  // Text animation - fade in text after first few frames
  const textOpacity = interpolate(frame, [60, 120], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Split poem into lines for better display
  const poemLines = poemText
    ? poemText.split("\n").filter((line) => line.trim())
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

      {/* Dark Overlay for better text readability */}
      {showText && poemText && (
        <AbsoluteFill
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            opacity: textOpacity,
          }}
        />
      )}

      {/* Poem Text Overlay */}
      {showText && poemText && (
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

      {/* Audio - Use dynamic poem audio if provided, otherwise fallback */}
      {poemAudioFile ? (
        <Audio src={staticFile("poems/life/" + poemAudioFile)} volume={0.8} />
      ) : (
        <Audio src={staticFile("poem.mp3")} volume={0.8} loop />
      )}

      {/* Background music */}
      <Audio src={staticFile("BGM/tianxingjiuge.mp3")} volume={0.3} loop />
    </AbsoluteFill>
  );
};
