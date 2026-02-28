import { NextRequest, NextResponse } from "next/server";
import { invokeGemini } from "@/lib/gemini";
import fs from "fs";
import path from "path";

interface HexagramRecord {
  binary: string;
  english: string;
  symbolic: string;
  hex_font: string;
  trigram_above: string;
  trigram_below: string;
  [key: string]: string;
}

interface FortuneLifeResponse {
  hexagram: string;
  description: string;
  journey?: string;
  currentCityImpact?: string;
  destinationCityTraits?: string;
  directionalGuidance?: {
    direction: string;
    meaning: string;
    recommendedCities: string[];
  };
  error?: string;
  rawResponse?: string;
}

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

// Enhanced helper function to clean object values
function cleanObjectValues(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(cleanObjectValues);
  } else if (typeof obj === "object" && obj !== null) {
    const cleaned: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === "string") {
        // Clean string values more thoroughly
        cleaned[key] = value
          .replace(/\s+/g, " ") // Normalize whitespace
          .replace(/\b(\w+)\s+\1\b/g, "$1") // Remove duplicate words
          .replace(/["']/g, "") // Remove any stray quotes
          .trim();
      } else {
        cleaned[key] = cleanObjectValues(value);
      }
    }
    return cleaned;
  }
  return obj;
}

// Function to get direction from binary I Ching hexagram
function getDirectionFromBinary(binary: string): string {
  if (!binary || binary.length !== 6) {
    return "North"; // Default fallback
  }

  // Extract upper trigram (first 3 bits) for direction mapping
  const upperTrigram = binary.substring(0, 3);

  // Traditional I Ching trigram to direction mapping
  const trigramDirections: { [key: string]: string } = {
    "111": "Northwest", // 乾 (Heaven)
    "110": "West", // 兌 (Lake)
    "101": "South", // 離 (Fire)
    "100": "East", // 震 (Thunder)
    "011": "Southeast", // 巽 (Wind)
    "010": "North", // 坎 (Water)
    "001": "Northeast", // 艮 (Mountain)
    "000": "Southwest", // 坤 (Earth)
  };

  return trigramDirections[upperTrigram] || "North";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { binary, userCity, userState } = body;

    if (!binary || binary.length !== 6) {
      return NextResponse.json(
        { error: "Binary string must be exactly 6 characters (0s and 1s)" },
        { status: 400 }
      );
    }

    const csvPath = path.join(process.cwd(), "public", "yijing_fixed.csv");
    const csvContent = fs.readFileSync(csvPath, "utf-8");
    const lines = csvContent.trim().split("\n");

    let hexagramData = null;
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      const columns = line.split(",");
      if (columns[2] === binary) {
        hexagramData = {
          number: columns[0],
          name: columns[1],
          title: columns[2],
          description: columns[7],
        };
        break;
      }
    }

    if (!hexagramData) {
      return NextResponse.json(
        { error: "Hexagram not found for the given binary" },
        { status: 404 }
      );
    }

    const { title, description } = hexagramData;

    const prompt = `Based on this I Ching hexagram reading, provide a detailed life analysis in valid JSON format.

    Hexagram: ${title}
    Description: ${description}
    User Location: ${userCity}, ${userState}

    Please respond with ONLY a valid JSON object (no markdown, no extra text) with this exact structure:

    {
      "yourJourney": "string - Analyze the change through first Yao to the Sixth Yao according to the explanation of the hexagram", 
      "currentCityImpact": "string - how current location affects their journey",
      "destinationCityTraits": "string - what kind of city would serve them best",
      "directionalGuidance": {
        "direction": "North/South/East/West/Northeast/Southeast/Southwest/Northwest",
        "meaning": "string - spiritual meaning of this direction",
        "recommendedCities": ["city1", "city2"]
      }
    }

    Important: 
    - Use only plain text in strings (no special characters or control characters)
    - Keep each field concise but meaningful
    - Ensure the JSON is perfectly formatted
    - No duplicate words or phrases`;

    const responseText = await invokeGemini(prompt);

    try {
      const aiResponse = JSON.parse(responseText);

      return NextResponse.json({
        hexagram: title,
        description,
        journey: aiResponse.yourJourney,
        currentCityImpact: aiResponse.currentCityImpact,
        destinationCityTraits: aiResponse.destinationCityTraits,
        directionalGuidance: {
          direction:
            aiResponse.directionalGuidance?.direction ||
            getDirectionFromBinary(binary),
          meaning: aiResponse.directionalGuidance?.meaning || "",
          recommendedCities:
            aiResponse.directionalGuidance?.recommendedCities || [],
        },
        rawResponse: responseText,
      } satisfies FortuneLifeResponse);
    } catch (e) {
      console.error("Failed to parse AI response:", e);
      return NextResponse.json({
        hexagram: title,
        description,
        error: "Unable to parse AI analysis",
        rawResponse: responseText,
        journey: "Underlying struggles analysis not available",
        currentCityImpact: "",
        destinationCityTraits: "",
        directionalGuidance: {
          direction: getDirectionFromBinary(binary),
          meaning: "",
          recommendedCities: [],
        },
      });
    }
  } catch (error) {
    console.error("💥 Fortune Life API error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate life analysis",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
