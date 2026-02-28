import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const VOICE_ID = "s81iyjtwYqJ1l1FBPUxm"; // Your specific voice ID

interface FortuneLifeData {
  hexagram?: string;
  description?: string;
  personalTraits?: string;
  struggles?: string;
  currentCityImpact?: string;
  destinationCityTraits?: string;
  directionalGuidance?: {
    direction: string;
    meaning: string;
    recommendedCities: string[];
  };
}

// Function to generate poem using Claude API
async function generatePoemWithClaude(
  fortuneData: FortuneLifeData
): Promise<string> {
  if (!ANTHROPIC_API_KEY) {
    throw new Error("Anthropic API key not configured");
  }

  const prompt = `Based on the following I Ching fortune reading, create a beautiful, inspirational poem that speaks directly to the person. The poem should be personal, mystical, and guidance-oriented.

Fortune Details:
- Hexagram: ${fortuneData.hexagram || "Ancient Wisdom"}
- Description: ${fortuneData.description || "A time of transformation"}
- Personal Traits: ${fortuneData.personalTraits || "hidden strengths"}
- Current Struggles: ${fortuneData.struggles || "inner challenges"}
- Current City Impact: ${
    fortuneData.currentCityImpact || "environmental influence"
  }
- Destination City Traits: ${
    fortuneData.destinationCityTraits || "seeking new horizons"
  }
- Direction: ${fortuneData.directionalGuidance?.direction || "unknown paths"}
- Direction Meaning: ${
    fortuneData.directionalGuidance?.meaning || "journey of discovery"
  }
- Recommended Cities: ${
    fortuneData.directionalGuidance?.recommendedCities?.join(", ") ||
    "distant places"
  }

Create a 4-stanza poem (16 lines total) that:
1. References the hexagram and its wisdom
2. Acknowledges their personal traits and struggles
3. Speaks about their current situation and the need for change
4. Offers guidance about their destined direction and future

The tone should be mystical, encouraging, and deeply personal. Use imagery related to destiny, ancient wisdom, and geographical movement. Make it feel like the universe is speaking directly to them.

Return only the poem, no additional text or formatting.`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Claude API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.content[0].text.trim();
  } catch (error) {
    console.error("Claude API error:", error);
    // Fallback to original template if Claude fails
    return generateFallbackPoem(fortuneData);
  }
}

// Fallback poem function (original template)
function generateFallbackPoem(fortuneData: FortuneLifeData): string {
  const hexagram = fortuneData.hexagram || "Ancient Wisdom";
  const direction =
    fortuneData.directionalGuidance?.direction || "unknown paths";
  const traits = fortuneData.personalTraits || "hidden strengths";
  const struggles = fortuneData.struggles || "inner challenges";

  return `
In the realm of ${hexagram}, where destinies unfold,
Your spirit seeks direction, stories yet untold.
${direction} calls to you, like whispers in the wind,
Where ${traits} shall guide you, and new journeys begin.

Through shadows of ${struggles}, you've learned to see,
The strength that lies within, waiting to be free.
The city that holds you may shape your days,
But destiny calls forth to distant ways.

Listen to the ancient wisdom, let it light your path,
Beyond the veil of present, beyond tomorrow's wrath.
For in the dance of hexagrams, your future lies,
Where dreams meet reality, and the spirit flies.

${direction} awaits you, with arms open wide,
Trust in the journey, let wisdom be your guide.
For you are the author of your destiny's song,
And in the right direction, you'll find where you belong.
`.trim();
}

// Function to convert text to speech using ElevenLabs
async function textToSpeech(text: string): Promise<Buffer> {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
    {
      method: "POST",
      headers: {
        Accept: "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": ELEVENLABS_API_KEY!,
      },
      body: JSON.stringify({
        text: text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.75,
          similarity_boost: 0.75,
          style: 0.5,
          use_speaker_boost: true,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export async function POST(req: NextRequest) {
  try {
    // Check if required API keys are configured
    if (!ELEVENLABS_API_KEY) {
      return NextResponse.json(
        { error: "ElevenLabs API key not configured" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { fortuneLifeData } = body;

    if (!fortuneLifeData) {
      return NextResponse.json(
        { error: "Fortune life data is required" },
        { status: 400 }
      );
    }

    console.log("🎭 Generating personalized poem with Claude...");

    // Generate poem using Claude API (with fallback)
    const poem = await generatePoemWithClaude(fortuneLifeData);
    console.log("📝 Poem generated:", poem.substring(0, 100) + "...");

    // Convert poem to speech using ElevenLabs
    console.log("🎤 Converting poem to speech with ElevenLabs...");
    const audioBuffer = await textToSpeech(poem);

    // Save audio file to public directory
    const timestamp = Date.now();
    const filename = `poem_${timestamp}.mp3`;
    const filePath = path.join(process.cwd(), "public/poems/life", filename);

    // Ensure public directory exists
    const publicDir = path.join(process.cwd(), "public");
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // Write audio file
    fs.writeFileSync(filePath, audioBuffer);
    console.log("💾 Audio file saved:", filename);

    // Return response with poem text and audio file URL
    return NextResponse.json({
      success: true,
      poem: poem,
      audioUrl: `/${filename}`,
      audioFile: filename,
      voiceId: VOICE_ID,
      timestamp: timestamp,
      fileSize: audioBuffer.length,
      generatedBy: ANTHROPIC_API_KEY ? "claude" : "fallback",
    });
  } catch (error) {
    console.error("💥 Poem of Life API error:", error);

    return NextResponse.json(
      {
        error: "Failed to generate poem audio",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
