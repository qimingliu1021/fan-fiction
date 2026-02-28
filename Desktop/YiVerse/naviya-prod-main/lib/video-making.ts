// This file is for getting video elements ready from database
// BGM choosing is at bgmService.ts, as it's a server side code

export const imageFetching = async (
  city: string,
  state: string,
  setImageSessionId: any
) => {
  try {
    const response = await fetch("/api/image-fetching", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        city: city,
        state: state,
      }),
    });
    if (response.ok) {
      const imageData = await response.json();
      console.log("✅ Images fetched:", imageData);
      // Store the session ID to prevent re-fetching
      setImageSessionId(imageData.sessionId);
    } else {
      console.error("❌ Failed to fetch images");
    }
  } catch (error) {
    console.error("❌ Error fetching images:", error);
  }
};

export const chooseBgm = async (sessionId: string, mood: string) => {
  try {
    const response = await fetch("/api/choose-bgm", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sessionId,
        mood,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("✅ BGM chosen and stored:", data);
    } else {
      console.error("❌ Failed to choose BGM:", await response.text());
    }
  } catch (error) {
    console.error("❌ Error choosing BGM:", error);
  }
};

export const poemOfLifeWriting = async () => {
  // TODO: Implement poem writing
};

export const poemOfCityWriting = async () => {
  // TODO: Implement poem writing
};

export const poemReadingAudio = async () => {};
