import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "../../../lib/supabase";

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
  return (bearing + 360) % 360; // Normalize to 0-360
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

  // Allow 45 degree tolerance on each side
  const tolerance = 45;
  let minAngle = targetAngle - tolerance;
  let maxAngle = targetAngle + tolerance;

  // Handle wraparound (e.g., North direction)
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
    const { binary, direction, userCity, userState, latitude, longitude } =
      await req.json();

    // Validate input
    if (!binary || binary.length !== 6) {
      return NextResponse.json(
        { error: "Invalid binary code" },
        { status: 400 }
      );
    }

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

    // Get cities from Supabase
    let cities = [];
    let supabaseError = null;
    let successfulTableName = null;

    if (supabaseServer) {
      try {
        const { data, error } = await supabaseServer
          .from("us_city") // Using correct table name
          .select("*");

        if (!error && data) {
          cities = data;
          successfulTableName = "us_ctiy";
        } else {
          supabaseError = error?.message || "Unknown error";
        }
      } catch (error) {
        console.error("Supabase error:", error);
        supabaseError = error.message;
      }
    } else {
      supabaseError = "Supabase not configured";
    }

    // Filter cities based on direction from user's location
    let filteredCities = [];

    if (cities.length > 0) {
      filteredCities = cities.filter((city) => {
        // Check if city has valid coordinates
        const cityLat = parseFloat(city.lat);
        const cityLon = parseFloat(city.lon);

        if (isNaN(cityLat) || isNaN(cityLon)) {
          return false;
        }

        // Skip if it's the same city as user's location
        if (city.city?.toLowerCase() === userCity?.toLowerCase()) {
          return false;
        }

        return isInDirection(latitude, longitude, cityLat, cityLon, direction);
      });
    }

    // Select a random city from filtered results
    let recommendedCity = null;
    if (filteredCities.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredCities.length);
      const rawCity = filteredCities[randomIndex];

      recommendedCity = {
        name: rawCity.city,
        state: rawCity.state,
        latitude: parseFloat(rawCity.lat),
        longitude: parseFloat(rawCity.lon),
      };
    }

    return NextResponse.json({
      success: true,
      direction,
      userLocation: {
        city: userCity,
        state: userState,
        latitude,
        longitude,
      },
      recommendedCity,
      totalCitiesInDirection: filteredCities.length,
      totalCitiesInDatabase: cities.length,
      successfulTableName,
      supabaseError,
      binary,
    });
  } catch (error) {
    console.error("Fortune City API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
