import { NextResponse } from "next/server";

export function formatResponse(
  status: number,
  message: string,
  data?: Record<string, any>
) {
  return NextResponse.json(
    {
      message,
      data: data || null,
    },
    { status }
  );
}

export function cleanAndFormatResponse(data: any) {
  if (!data) return null;

  // Helper function to clean text
  const cleanText = (text: string): string => {
    if (!text || typeof text !== "string") return "";
    return text
      .replace(/\*\*/g, "") // Remove markdown bold
      .replace(/\*/g, "") // Remove markdown italic
      .replace(/#{1,6}\s*/g, "") // Remove markdown headers
      .replace(/^\s+|\s+$/g, "") // Trim whitespace
      .replace(/\n\s*\n/g, "\n") // Remove extra newlines
      .trim();
  };

  // Helper function to clean array of strings
  const cleanArray = (arr: any[]): string[] => {
    if (!Array.isArray(arr)) return [];
    return arr
      .filter((item) => typeof item === "string" && item.trim())
      .map((item) => cleanText(item));
  };

  return {
    hexagramAnalysis: data.hexagramAnalysis
      ? {
          name: cleanText(data.hexagramAnalysis.name || ""),
          meaning: cleanText(data.hexagramAnalysis.meaning || ""),
          currentSituation: cleanText(
            data.hexagramAnalysis.currentSituation || ""
          ),
          guidance: cleanText(data.hexagramAnalysis.guidance || ""),
        }
      : null,

    directionalGuidance: data.directionalGuidance
      ? {
          direction: cleanText(data.directionalGuidance.direction || ""),
          significance: cleanText(data.directionalGuidance.significance || ""),
          energyQuality: cleanText(
            data.directionalGuidance.energyQuality || ""
          ),
        }
      : null,

    lifeGuidance: data.lifeGuidance
      ? {
          keyInsight: cleanText(data.lifeGuidance.keyInsight || ""),
          actionSteps: cleanArray(data.lifeGuidance.actionSteps || []),
          timing: cleanText(data.lifeGuidance.timing || ""),
        }
      : null,

    personalReflection: cleanText(data.personalReflection || ""),
  };
}
