import { NextRequest, NextResponse } from "next/server";
import * as admin from "firebase-admin";
import { invokeGemini } from "@/lib/gemini"; // Add this line

// Initialize admin (add this near the top)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const db = admin.firestore();

// Direction to angle mapping (degrees)
const directionAngles: Record<string, number> = {
  North: 0,
  Northeast: 45,
  East: 90,
  Southeast: 135,
  South: 180,
  Southwest: 225,
  West: 270,
  Northwest: 315,
};

// Helper function to calculate bearing between two points
function calculateBearing(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const lat1Rad = (lat1 * Math.PI) / 180;
  const lat2Rad = (lat2 * Math.PI) / 180;

  const y = Math.sin(dLon) * Math.cos(lat2Rad);
  const x =
    Math.cos(lat1Rad) * Math.sin(lat2Rad) -
    Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);

  let bearing = (Math.atan2(y, x) * 180) / Math.PI;
  return (bearing + 360) % 360;
}

// Helper function to check if city is in the given direction
function isInDirection(
  userLat: number,
  userLon: number,
  cityLat: number,
  cityLon: number,
  targetDirection: string
): boolean {
  const bearing = calculateBearing(userLat, userLon, cityLat, cityLon);
  const targetAngle = directionAngles[targetDirection];
  const tolerance = 45;

  let minAngle = targetAngle - tolerance;
  let maxAngle = targetAngle + tolerance;

  if (minAngle < 0) {
    return bearing >= 360 + minAngle || bearing <= maxAngle;
  }
  if (maxAngle > 360) {
    return bearing >= minAngle || bearing <= maxAngle - 360;
  }

  return bearing >= minAngle && bearing <= maxAngle;
}

export async function POST(req: NextRequest) {
  try {
    const { direction, userCity, userState, latitude, longitude } =
      await req.json();

    // Validate input
    if (!direction || !directionAngles[direction]) {
      return NextResponse.json(
        { error: "Valid direction is required" },
        { status: 400 }
      );
    }

    if (!latitude || !longitude) {
      return NextResponse.json(
        { error: "User location coordinates are required" },
        { status: 400 }
      );
    }

    // Get cities from Firebase
    console.log("🔍 Fetching cities from Firebase...");
    const citiesCollection = db.collection("uscities");
    const citySnapshot = await citiesCollection.get();
    const cities = citySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log(`📊 Found ${cities.length} cities in database`);

    // Filter cities based on direction from user's location
    const filteredCities = cities.filter((city: any) => {
      const cityLat = parseFloat(city.lat);
      const cityLon = parseFloat(city.lon);

      if (isNaN(cityLat) || isNaN(cityLon)) return false;
      if (city.city?.toLowerCase() === userCity?.toLowerCase()) return false;

      return isInDirection(latitude, longitude, cityLat, cityLon, direction);
    });

    console.log(
      `🎯 Found ${filteredCities.length} cities in ${direction} direction`
    );

    if (filteredCities.length === 0) {
      return NextResponse.json({
        success: false,
        error: `No cities found in ${direction} direction from your location`,
        direction,
        totalCitiesInDatabase: cities.length,
      });
    }

    // Select random city
    const randomIndex = Math.floor(Math.random() * filteredCities.length);
    const selectedCity: any = filteredCities[randomIndex];

    const recommendedCity = {
      name: selectedCity.city,
      state: selectedCity.state,
      latitude: parseFloat(selectedCity.lat),
      longitude: parseFloat(selectedCity.lon),
    };

    console.log(
      `🏙️ Selected city: ${recommendedCity.name}, ${recommendedCity.state}`
    );

    // Generate AI analysis using Gemini
    console.log("🤖 Generating AI analysis with Gemini...");

    const prompt = `Analyze ${recommendedCity.name}, ${recommendedCity.state} and compare it to ${userCity}, ${userState}. 

Please provide a detailed analysis in JSON format with this exact structure:

{
  "elementalMatch": {
    "primaryElement": "Fire|Water|Earth|Metal|Wood",
    "supportingElements": ["Element1", "Element2"],
    "matchReason": "Why this city matches these elements based on I Ching principles"
  },
  "geographicInfluence": {
    "directionalTraits": "How this city embodies ${direction} directional energy",
    "climateAlignment": "Climate and weather patterns alignment"
  },
  "environmentReading": {
    "landscapeBreakdown": "Description of landscape, elevation, natural features, geography",
    "lifestyleEffects": "How the environment affects daily life and wellbeing"
  },
  "industrialEnergy": {
    "dominantIndustries": "Main industries and economic drivers",
    "spiritualAlignment": "How the economic energy aligns with personal growth"
  },
  "nameElementAnalysis": {
    "symbolism": "Symbolic meaning of the city name",
    "poeticInterpretation": "Poetic interpretation of what this city represents"
  },
  "balanceHealing": {
    "elementalGaps": "What elemental energies this city can help balance",
    "healingOpportunity": "Personal growth and healing opportunities this city offers"
  },
  "birthplaceContrast": "Detailed comparison with ${userCity}, ${userState} highlighting key differences in lifestyle, opportunities, culture, and environment"
}

Keep each field concise but meaningful (2-3 sentences each).`;

    // The invokeGemini function is no longer needed as it's not part of the new_code.
    // The prompt is now directly passed to the Gemini API.
    const aiResponse = await invokeGemini(prompt);

    let analysis;
    try {
      analysis = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      analysis = {
        elementalMatch: {
          primaryElement: "Earth",
          supportingElements: ["Metal", "Water"],
          matchReason: "Default element assignment",
        },
        geographicInfluence: {
          directionalTraits: "Directional traits not available",
          climateAlignment: "Climate alignment not available",
        },
        environmentReading: {
          landscapeBreakdown: "Landscape information not available",
          lifestyleEffects: "Lifestyle effects not available",
        },
        industrialEnergy: {
          dominantIndustries: "Industry information not available",
          spiritualAlignment: "Spiritual alignment not available",
        },
        nameElementAnalysis: {
          symbolism: "Symbolism not available",
          poeticInterpretation: "Interpretation not available",
        },
        balanceHealing: {
          elementalGaps: "Elemental gaps not available",
          healingOpportunity: "Healing opportunity not available",
        },
        birthplaceContrast: "Comparison not available",
      };
    }

    console.log("✅ City analysis completed successfully");

    return NextResponse.json({
      success: true,
      direction,
      userLocation: { city: userCity, state: userState, latitude, longitude },
      recommendedCity,
      analysis, // ← ADD THIS BACK
      totalCitiesInDirection: filteredCities.length,
      totalCitiesInDatabase: cities.length,
    });
  } catch (error) {
    console.error("💥 Fortune City API error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate city analysis",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
