import { storage } from "@/lib/firebase-admin";
import { storeBgmToFirebase } from "@/lib/videoData";
import { NextRequest } from "next/server";
import { formatResponse } from "../../../lib/formatResponse";

const getBgmUrl = async (category: string) => {
  try {
    const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
    if (!bucketName) {
      throw new Error("Firebase Storage bucket name is not configured.");
    }
    const bucket = storage.bucket(bucketName);
    const prefix = `BGMs/${category}/`;

    const [allFiles] = await bucket.getFiles({ prefix });

    // Filter out the directory itself, which can be returned by getFiles
    const files = allFiles.filter((file) => !file.name.endsWith("/"));

    if (files.length === 0) {
      throw new Error(`No files found in category: ${category}`);
    }

    const randomFile = files[Math.floor(Math.random() * files.length)];
    const [url] = await randomFile.getSignedUrl({
      action: "read",
      expires: "03-09-2500", // A long expiration date
    });

    console.log("🔍 BGM URL with file name:", url, randomFile.name);

    return {
      url,
      path: randomFile.name,
    };
  } catch (error) {
    console.error(
      `❌ Error accessing Storage for category "${category}":`,
      error
    );
    throw error;
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const { sessionId, mood } = await req.json();

    if (!sessionId || !mood) {
      return formatResponse(400, "Session ID and mood are required");
    }

    const { url, path } = await getBgmUrl(mood);
    const category = mood;

    await storeBgmToFirebase(sessionId, {
      path,
      url,
      category,
      createdAt: new Date() as any, // Firestore timestamp will be set in the function
    });

    console.log("✅ BGM chosen and stored successfully");
    return formatResponse(200, "BGM chosen and stored successfully", {
      bgmUrl: url,
    });
  } catch (error) {
    console.error("❌ Error in choose-bgm route:", error);
    return formatResponse(500, "Internal Server Error");
  }
};
