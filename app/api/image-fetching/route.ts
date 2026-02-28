import { NextRequest, NextResponse } from "next/server";

// DuckDuckGo image search logic (no API key needed)
async function duckDuckGoImageSearch(query: string): Promise<string | null> {
  const params = new URLSearchParams({ q: query });
  const tokenRes = await fetch(`https://duckduckgo.com/?${params}`, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
    },
  });
  const tokenText = await tokenRes.text();
  const vqdMatch =
    tokenText.match(/vqd='([\d-]+)'/) || tokenText.match(/vqd=([\d-]+)\&/);
  if (!vqdMatch) {
    console.log("❌ No vqd token found in DuckDuckGo search page.");
    return null;
  }
  const vqd = vqdMatch[1];

  const apiUrl = `https://duckduckgo.com/i.js?${new URLSearchParams({
    l: "us-en",
    o: "json",
    q: query,
    vqd,
    f: "",
    p: "1",
  })}`;
  const res = await fetch(apiUrl, {
    headers: {
      Referer: "https://duckduckgo.com/",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
    },
  });
  if (!res.ok) {
    console.log(`❌ Image API failed for query: ${query}`);
    return null;
  }
  const data = await res.json();
  return data.results?.[0]?.image || null;
}

export async function POST(req: NextRequest) {
  try {
    const { binary, userCity, userState, latitude, longitude, direction } =
      await req.json();

    console.log("🔍 Fetching city from /api/fortune-city");

    // 1. Fetch city from /api/fortune-city with proper parameters
    const fortuneRes = await fetch("http://localhost:3000/api/fortune-city", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        binary,
        direction,
        userCity,
        userState,
        latitude,
        longitude,
      }),
    });

    const fortuneData = await fortuneRes.json();
    console.log("? fortuneRes:", fortuneRes);
    console.log("🔍 Fortune data:", JSON.stringify(fortuneData, null, 2));

    // Extract city from new response format
    const city = fortuneData.recommendedCity?.name || "";
    const state = fortuneData.recommendedCity?.state || "";

    if (!city) {
      console.log("⚠️ No recommended city found from /api/fortune-city.");
      return NextResponse.json(
        { error: "No city found from /api/fortune-city." },
        { status: 400 }
      );
    }

    console.log(`🌆 Target City: ${city}, ${state}`);

    // 2. Create landmarks for the city (since we don't have recommendedPlaces anymore)
    const commonLandmarks = [
      "downtown skyline",
      "city hall",
      "main street",
      "central park",
      "historic district",
      "waterfront",
      "university campus",
      "art museum",
    ];

    // 3. Search for image URLs
    const imageResults = await Promise.all(
      commonLandmarks.slice(0, 8).map(async (landmark, idx) => {
        const searchQuery = `${landmark} ${city} ${state}`;
        console.log(`🔎 Searching image for: "${searchQuery}"`);

        try {
          const imageUrl = await duckDuckGoImageSearch(searchQuery);
          if (!imageUrl) {
            console.log(`❌ No image found for ${landmark}`);
            return null;
          }

          return {
            index: idx,
            landmark,
            imageUrl,
            searchQuery,
          };
        } catch (err) {
          console.error(`❌ Error processing ${landmark}:`, err);
          return null;
        }
      })
    );

    // Filter out null results
    const validImages = imageResults.filter((result) => result !== null);

    // console.log(
    //   "✅ Found image URLs:",
    //   validImages.map((img) => ({
    //     landmark: img.landmark,
    //     url: img.imageUrl,
    //   }))
    // );

    return NextResponse.json({
      city: `${city}, ${state}`,
      images: validImages,
      imageUrls: validImages.map((img) => img.imageUrl),
      count: validImages.length,
    });
  } catch (e) {
    console.error("🔥 Unexpected error in image-fetching route:", e);
    return NextResponse.json(
      { error: "Internal server error", details: String(e) },
      { status: 500 }
    );
  }
}
