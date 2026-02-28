import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { parse } from "csv-parse/sync";
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
  personalTraits?: string;
  struggles?: string;
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

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const body = await req.json();
    const {
      binary,
      userCity = "Unknown",
      userState = "Unknown",
      latitude,
      longitude,
    } = body;

    // Validate required inputs
    if (!binary || typeof binary !== "string" || binary.length !== 6) {
      return NextResponse.json(
        {
          error: "Invalid binary input. Must be a 6-character binary string.",
        },
        { status: 400 }
      );
    }

    if (!ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    // Process hexagram data
    const reversedBinary = binary.split("").reverse().join("");
    const filePath = path.join(process.cwd(), "public", "yijing_fixed.csv");

    let csvRaw: string;
    try {
      csvRaw = await readFile(filePath, "utf-8");
    } catch (fileError) {
      console.error("Error reading CSV file:", fileError);
      return NextResponse.json(
        {
          error: "Unable to read hexagram data",
        },
        { status: 500 }
      );
    }

    const records: HexagramRecord[] = parse(csvRaw, {
      columns: true,
      skip_empty_lines: true,
    });

    const match = records.find((row) => row.binary === reversedBinary);
    if (!match) {
      return NextResponse.json(
        {
          error: "Hexagram not found for binary: " + reversedBinary,
        },
        { status: 404 }
      );
    }

    const title = match.english;
    const description = match.symbolic;
    const summary_initial = match.image;
    const gua_meaning = match.judgement;
    // {'1': {'text': '...', 'comments': '...'}, '2': {'text': '...', 'comments': '...'}, ...}
    // Needs for loop to get it one by one.
    const yao_meaning = match.lines;
    // console.log("yao_meaning:\n", yao_meaning);

    let parsedYaoMeaning;
    try {
      // Use the more robust parsing function
      parsedYaoMeaning = parsePythonDict(yao_meaning);
      // console.log("Successfully parsed yao_meaning:", parsedYaoMeaning);
    } catch (error) {
      console.error("Error parsing yao_meaning:", error);
      parsedYaoMeaning = {};
    }

    // Generate line interpretations
    const lineDescriptions = [
      "Line 1 (Foundation): The beginning of change; initial conditions.",
      "Line 2 (Field/Response): The appropriate response to external action.",
      "Line 3 (Decision Point): Danger of excess or premature action.",
      "Line 4 (Transition): Movement toward resolution, but still unstable.",
      "Line 5 (Ruler/Guide): Power in alignment; effective leadership.",
      "Line 6 (Completion): End of cycle; transcendence or decay.",
    ];

    const enhancedLineDescriptions = [];
    for (let i = 0; i < lineDescriptions.length; i++) {
      const lineNumber = (i + 1).toString(); // Convert to string since JSON keys are strings
      const baseDescription = lineDescriptions[i];

      // Get the yao meaning for this line
      const yaoData = parsedYaoMeaning[lineNumber];

      // console.log("yaoData:\n", yaoData);

      if (yaoData && yaoData.text && yaoData.comments) {
        // Add the original text and comments
        const enhancedDescription = `${baseDescription} Original text: "${yaoData.text}", it means: ${yaoData.comments}`;
        // console.log("enhancedDescription:\n", enhancedDescription);
        enhancedLineDescriptions.push(enhancedDescription);
      } else {
        // If no yao meaning found, use the base description
        // console.log(`No yao data found for line ${lineNumber}`);
        enhancedLineDescriptions.push(baseDescription);
      }
    }

    // Enhanced Claude prompt
    const prompt = `You are a master of the I Ching, especially skilled in interpreting trigrams through the classical Chinese text 《高岛易断》 by 高岛吞象. You act as a fortune teller who reveals hidden truths in a user's life through symbolic reasoning and spiritual insight. You are also able to connect the divination results with real-world factors, such as geography and city environment.

A user from ${userCity}, ${userState} has drawn Hexagram ${title} (${description}), located at coordinates: ${latitude}, ${longitude}.

This hexagram (卦象) consists of the following:
- Summary of the image: ${summary_initial}
- Meaning or judgment of the hexagram (卦辞): ${gua_meaning}
- Interpretation of each line (爻辞):
${enhancedLineDescriptions}

Please fulfill the following tasks based on the above I Ching data:

1. **Personal Traits and Internal Struggles**  
   - Based on the **hexagram meaning**, **line interpretations**, and **symbolic image**, infer the user's **personality, mindset, and inner emotional state**.  
   - Reflect on what kind of psychological phase they are in. Are they experiencing stagnation, breakthrough, confusion, or imbalance?
   - Highlight **invisible causes of their struggles** that are reflected metaphorically in the gua.

2. **Analysis of Current City**  
   - Considering the user's **current physical location and coordinates**, evaluate whether this environment **supports or hinders** their spiritual and personal growth.  
   - Pay attention to aspects like **cultural energy**, **pace of life**, **social energy**, or **elemental mismatch** (e.g., a water person trapped in a fire city).

3. **Traits of Ideal Destination City**  
   - If the hexagram implies the user should relocate, or that their current place is unsuitable, deduce the qualities of a city that would **restore balance and growth** for them.  
   - Use traits like: quiet, fast-paced, nature-rich, ocean-close, intellectually vibrant, historically rooted, etc.

4. **Direction Guidance using 后天八卦 (Later Heaven Trigram Theory)**  
   - Analyze the **symbolic direction** of the user's growth using **trigram placement** and the hexagram structure.  
   - Suggest a **cardinal direction** (e.g., East, Southeast, Northwest) and explain it metaphorically and spiritually.  
   - Then, based on this direction, hint at one or two **real U.S. cities** that represent this destiny path. Describe how they metaphorically and practically align with the user's fate.

Respond strictly in **JSON** format with these fields:
{
  "personalTraits": "Summary of personality, strengths, psychological phase, and internal conflicts.",
  "struggles": "Underlying issues the user may not be aware of, based on the hexagram.",
  "currentCityImpact": "How the current city is affecting their energy, growth, and direction.",
  "destinationCityTraits": "Qualities an ideal city should have to nurture the user.",
  "directionalGuidance": {
    "direction": "East/Southwest/North/etc.",
    "meaning": "What this direction symbolizes spiritually for the user",
    "recommendedCities": ["City Name 1", "City Name 2"]
  }
}`;

    // Call Claude API
    const claudeResponse = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20240620",
        max_tokens: 1500,
        temperature: 0.7,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!claudeResponse.ok) {
      throw new Error(`Claude API error: ${claudeResponse.status}`);
    }

    const result = await claudeResponse.json();
    const responseText = result?.content?.[0]?.text || "";
    // console.log("responseText:\n", responseText);

    if (!responseText) {
      throw new Error("Empty response from Claude API");
    }

    // Parse Claude's JSON response
    let parsedAnalysis;
    try {
      // Clean the response text (remove any markdown formatting)
      let cleanedText = responseText
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();

      const jsonStart = cleanedText.search(/^\s*[\{\[]/);
      if (jsonStart > 0) {
        cleanedText = cleanedText.substring(jsonStart);
      }

      // Alternative: Look for the first { or [ character
      const firstBrace = cleanedText.indexOf("{");
      const firstBracket = cleanedText.indexOf("[");

      if (firstBrace !== -1 || firstBracket !== -1) {
        const jsonStartIndex =
          firstBrace !== -1 && firstBracket !== -1
            ? Math.min(firstBrace, firstBracket)
            : Math.max(firstBrace, firstBracket);

        if (jsonStartIndex > 0) {
          cleanedText = cleanedText.substring(jsonStartIndex);
        }
      }

      // Find the last } or ] to ensure we capture the complete JSON
      const lastBrace = cleanedText.lastIndexOf("}");
      const lastBracket = cleanedText.lastIndexOf("]");

      if (lastBrace !== -1 || lastBracket !== -1) {
        const jsonEndIndex = Math.max(lastBrace, lastBracket);
        cleanedText = cleanedText.substring(0, jsonEndIndex + 1);
      }

      // console.log("Cleaned JSON text:", cleanedText);
      parsedAnalysis = JSON.parse(cleanedText);
      // console.log("parsedAnalysis:", parsedAnalysis);
    } catch (jsonError) {
      console.error("JSON parse error:", jsonError);
      console.error("Raw response:", responseText);

      // Return fallback response with partial data
      return NextResponse.json({
        hexagram: title,
        description,
        error: "Unable to parse AI analysis",
        rawResponse: responseText.substring(0, 300),
        personalTraits: "Personal traits analysis temporarily unavailable.",
        struggles: "Underlying struggles analysis not available",
        currentCityImpact: "Current city impact analysis not available",
        destinationCityTraits: "Destination city traits not available",
        directionalGuidance: {
          direction: "Not determined",
          meaning: "Directional guidance not available",
          recommendedCities: [],
        },
      } as FortuneLifeResponse);
    }

    // Validate parsed response structure
    const finalResponse: FortuneLifeResponse = {
      hexagram: title,
      description,
      personalTraits:
        parsedAnalysis.personalTraits ||
        "Personal traits analysis not available",
      struggles:
        parsedAnalysis.struggles ||
        "Underlying struggles analysis not available",
      currentCityImpact:
        parsedAnalysis.currentCityImpact ||
        "Current city impact analysis not available",
      destinationCityTraits:
        parsedAnalysis.destinationCityTraits ||
        "Destination city traits not available",
      directionalGuidance: parsedAnalysis.directionalGuidance || {
        direction: "Not determined",
        meaning: "Directional guidance not available",
        recommendedCities: [],
      },
    };

    return NextResponse.json(finalResponse);
  } catch (error) {
    console.error("Fortune life API error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Alternative approach: Use eval() to safely parse Python-style dictionaries
function parsePythonDict(pythonDictString: string) {
  try {
    // Create a safe evaluation context
    const safeEval = new Function("return " + pythonDictString);
    return safeEval();
  } catch (error) {
    console.error("Error parsing Python dict with eval:", error);
    return {};
  }
}
