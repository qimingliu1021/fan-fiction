import { NextRequest, NextResponse } from "next/server";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

interface CityAnalysisRequest {
  cityName: string;
  state: string;
  direction: string;
  userLocation?: {
    city: string;
    state: string;
  };
  binary?: string;
}

interface CityAnalysisResponse {
  success: boolean;
  cityAnalysis: {
    elementalMatch: {
      primaryElement: string;
      supportingElements: string[];
      matchReason: string;
    };
    geographicInfluence: {
      directionalTraits: string;
      climateAlignment: string;
    };
    environmentReading: {
      landscapeBreakdown: string;
      lifestyleEffects: string;
    };
    industrialEnergy: {
      dominantIndustries: string;
      spiritualAlignment: string;
    };
    nameElementAnalysis: {
      symbolism: string;
      poeticInterpretation: string;
    };
    balanceHealing: {
      elementalGaps: string;
      healingOpportunity: string;
    };
    birthplaceContrast?: string;
    poemInputs: {
      primaryElement: string;
      landscape: string;
      tone: string;
      keywords: string[];
    };
  };
  poem?: string;
}

// Five Elements city mapping
const cityElementMapping: Record<
  string,
  { primary: string; supporting: string[]; traits: string }
> = {
  "New York": {
    primary: "Fire",
    supporting: ["Metal", "Earth"],
    traits: "Intense energy, ambition, speed",
  },
  Boston: {
    primary: "Water",
    supporting: ["Wood", "Metal"],
    traits: "Wisdom, flow, intellectual depth",
  },
  "San Francisco": {
    primary: "Metal",
    supporting: ["Water", "Earth"],
    traits: "Innovation, precision, clarity",
  },
  Seattle: {
    primary: "Water",
    supporting: ["Wood"],
    traits: "Flow, creativity, natural harmony",
  },
  Chicago: {
    primary: "Earth",
    supporting: ["Metal", "Fire"],
    traits: "Stability, structure, growth",
  },
  Miami: {
    primary: "Fire",
    supporting: ["Water"],
    traits: "Passion, warmth, dynamic energy",
  },
  Portland: {
    primary: "Wood",
    supporting: ["Water"],
    traits: "Growth, creativity, natural balance",
  },
  Austin: {
    primary: "Fire",
    supporting: ["Earth"],
    traits: "Creative fire, artistic expression",
  },
  Denver: {
    primary: "Earth",
    supporting: ["Metal"],
    traits: "Grounded strength, mountain energy",
  },
  "Los Angeles": {
    primary: "Fire",
    supporting: ["Earth", "Metal"],
    traits: "Creative expression, showmanship",
  },
};

// Direction-element mapping
const directionElements: Record<string, string> = {
  North: "Water",
  South: "Fire",
  East: "Wood",
  West: "Metal",
  Northeast: "Earth",
  Southeast: "Wood",
  Southwest: "Earth",
  Northwest: "Metal",
};

async function generateCityAnalysisWithClaude(
  cityData: CityAnalysisRequest
): Promise<string> {
  if (!ANTHROPIC_API_KEY) {
    throw new Error("Anthropic API key not configured");
  }

  const prompt = `Based on Five Elements (Wu Xing) theory and I Ching wisdom, create a detailed city analysis for ${
    cityData.cityName
  }, ${cityData.state}.

City Details:
- Location: ${cityData.cityName}, ${cityData.state}
- Direction from user: ${cityData.direction}
- User's current location: ${cityData.userLocation?.city}, ${
    cityData.userLocation?.state
  }

Create a comprehensive analysis covering:

1. ELEMENTAL MATCH SUMMARY
- Primary Five-Element energy of the city
- Supporting elemental influences
- Why this matches the user's needs

2. GEOGRAPHIC & CLIMATIC INFLUENCE  
- Direction-based traits (${cityData.direction} = ${
    directionElements[cityData.direction] || "Mixed"
  } element)
- Climate alignment with elemental energy

3. CITY ENVIRONMENT READING
- Landscape and environment breakdown
- Suggested lifestyle effects

4. INDUSTRIAL ENERGY
- Dominant industries and their elements
- Spiritual alignment for personal growth

5. NAME ELEMENT ANALYSIS
- City name symbolism and characters
- Poetic interpretation

6. BALANCE & HEALING NOTE
- How the city fills elemental gaps
- Healing opportunities for the user

7. CONTRAST WITH BIRTHPLACE
- Compare with user's current location energy

Also create a beautiful, mystical poem about this city that incorporates the elemental analysis and destiny themes. The poem should be 4 stanzas, inspirational, and speak to someone considering this city as their destiny location.

Format as JSON with structure:
{
  "elementalMatch": {
    "primaryElement": "Fire/Water/Wood/Metal/Earth",
    "supportingElements": ["element1", "element2"],
    "matchReason": "explanation"
  },
  "geographicInfluence": {
    "directionalTraits": "description",
    "climateAlignment": "description"
  },
  "environmentReading": {
    "landscapeBreakdown": "description", 
    "lifestyleEffects": "description"
  },
  "industrialEnergy": {
    "dominantIndustries": "description",
    "spiritualAlignment": "description"
  },
  "nameElementAnalysis": {
    "symbolism": "description",
    "poeticInterpretation": "description"
  },
  "balanceHealing": {
    "elementalGaps": "description",
    "healingOpportunity": "description"
  },
  "birthplaceContrast": "comparison with current location",
  "poem": "4-stanza mystical poem about the city",
  "poemInputs": {
    "primaryElement": "element",
    "landscape": "description",
    "tone": "mood",
    "keywords": ["keyword1", "keyword2", "keyword3", "keyword4"]
  }
}`;

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
        max_tokens: 2000,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status}`);
    }

    const data = await response.json();
    return data.content[0].text.trim();
  } catch (error) {
    console.error("Claude API error:", error);
    throw error;
  }
}

function generateFallbackAnalysis(cityData: CityAnalysisRequest): any {
  const cityInfo = cityElementMapping[cityData.cityName] || {
    primary: "Earth",
    supporting: ["Metal"],
    traits: "Balanced energy, growth potential",
  };

  return {
    elementalMatch: {
      primaryElement: cityInfo.primary,
      supportingElements: cityInfo.supporting,
      matchReason: `${cityData.cityName} resonates with ${
        cityInfo.primary
      } energy, which ${cityInfo.traits.toLowerCase()}.`,
    },
    geographicInfluence: {
      directionalTraits: `Located in the ${
        cityData.direction
      }, this city carries ${
        directionElements[cityData.direction] || "balanced"
      } elemental influence.`,
      climateAlignment:
        "The climate supports the city's elemental energy and personal transformation.",
    },
    environmentReading: {
      landscapeBreakdown:
        "Urban landscapes balanced with natural elements create dynamic energy flow.",
      lifestyleEffects:
        "Ideal for individuals seeking growth while maintaining connection to progress.",
    },
    industrialEnergy: {
      dominantIndustries:
        "The city's industries reflect its elemental nature, supporting material and spiritual growth.",
      spiritualAlignment:
        "This environment encourages personal development and purposeful living.",
    },
    nameElementAnalysis: {
      symbolism: `The name ${cityData.cityName} carries energy of movement and potential.`,
      poeticInterpretation:
        "This city invites transformation and new beginnings.",
    },
    balanceHealing: {
      elementalGaps:
        "The city's energy helps balance elemental deficiencies in your personal energy.",
      healingOpportunity:
        "Living here offers opportunities for holistic growth and healing.",
    },
    birthplaceContrast: `Compared to ${
      cityData.userLocation?.city || "your current location"
    }, this city offers complementary energy for your journey.`,
    poem: `In the realm of ${cityInfo.primary}, where destinies align,
${cityData.cityName} calls to you, through space and time.
${cityData.direction} winds carry ancient wisdom here,
Where ${cityInfo.traits.toLowerCase()}, and paths become clear.

The elements dance in urban symphony,
${cityInfo.supporting.join(" and ")} join ${cityInfo.primary}'s harmony.
Streets pulse with energy, both old and new,
A destiny city, perfectly suited for you.

Feel the ${cityInfo.primary} energy rise within your soul,
As this city's power makes your spirit whole.
Here transformation meets opportunity's door,
Your journey continues, stronger than before.

${cityData.cityName} awaits, with arms open wide,
Trust in the elements, let them be your guide.
For in this city's heart, your future lies,
Where dreams take flight under destiny's skies.`,
    poemInputs: {
      primaryElement: cityInfo.primary,
      landscape: "Urban cityscape with elemental influences",
      tone: "Mystical, encouraging, transformative",
      keywords: [
        cityInfo.primary.toLowerCase(),
        "destiny",
        "transformation",
        cityData.direction.toLowerCase(),
      ],
    },
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { cityName, state, direction, userLocation, binary } = body;

    if (!cityName || !direction) {
      return NextResponse.json(
        { error: "City name and direction are required" },
        { status: 400 }
      );
    }

    console.log("🏙️ Generating city analysis for:", cityName, state);

    let analysisData;

    try {
      // Try to generate with Claude
      const claudeResponse = await generateCityAnalysisWithClaude({
        cityName,
        state,
        direction,
        userLocation,
        binary,
      });

      // Parse Claude's JSON response
      const jsonMatch = claudeResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Could not parse Claude response");
      }
    } catch (error) {
      console.error("Claude analysis failed, using fallback:", error);
      // Use fallback analysis
      analysisData = generateFallbackAnalysis({
        cityName,
        state,
        direction,
        userLocation,
        binary,
      });
    }

    return NextResponse.json({
      success: true,
      cityAnalysis: analysisData,
      poem: analysisData.poem,
      generatedBy:
        analysisData === generateFallbackAnalysis ? "fallback" : "claude",
    });
  } catch (error) {
    console.error("💥 City analysis API error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate city analysis",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
