// lib/videoData.ts
import {
  collection,
  addDoc,
  getDocs,
  Timestamp,
  doc,
  setDoc,
} from "firebase/firestore";
import { db } from "./firebase";

export interface videoData {
  sessionId: string;
  bgm: bgmData;
  images: ImageData[];
  createdAt: Timestamp;
}

export interface ImageData {
  name: string;
  url: string;
  landmark?: string;
  searchQuery?: string;
}

export interface bgmData {
  path: string;
  url: string;
  category: string;
  createdAt: Timestamp;
}

/**
 * Store images in Firebase following the schema: video-making -> document -> image -> image -> document -> name, url
 */
export const storeImagesToFirebase = async (
  sessionId: string,
  images: ImageData[]
): Promise<void> => {
  try {
    // Reference to the image sub collection: video-making/{sessionId}/image
    const imageCollectionRef = collection(
      db,
      `video-making/${sessionId}/image`
    );

    const promises = images.map(async (imageData, index) => {
      await addDoc(imageCollectionRef, {
        name: imageData.name || imageData.landmark || `image_${index}`,
        url: imageData.url,
        landmark: imageData.landmark,
        searchQuery: imageData.searchQuery,
        order: index,
        createdAt: Timestamp.now(),
      });
    });

    await Promise.all(promises);
    console.log(`✅ Stored ${images.length} images for session ${sessionId}`);
  } catch (error) {
    console.error("❌ Error storing images:", error);
    throw error;
  }
};

/**
 * Store BGM to Firebase following the schema: video-making -> document -> bgm
 */
export const storeBgmToFirebase = async (
  sessionId: string,
  bgmData: bgmData
): Promise<void> => {
  const bgmCollectionRef = collection(db, `video-making/${sessionId}/bgm`);

  // Use addDoc to create a new document with a unique ID for the BGM,
  // which is safer and avoids issues with invalid characters in paths.
  await addDoc(bgmCollectionRef, {
    path: bgmData.path,
    url: bgmData.url,
    category: bgmData.category,
    createdAt: Timestamp.now(),
  });

  console.log(`✅ Stored BGM for session ${sessionId}`);
};

/**
 * Read images from Firebase following the schema
 */
export const readFromFirebase = async (
  sessionId: string
): Promise<ImageData[]> => {
  try {
    // Reference to the image subcollection
    const imageCollectionRef = collection(
      db,
      `video-making/${sessionId}/image`
    );

    // Get all image documents
    const querySnapshot = await getDocs(imageCollectionRef);

    const images: ImageData[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      images.push({
        name: data.name,
        url: data.url,
        landmark: data.landmark,
        searchQuery: data.searchQuery,
      });
    });

    // Sort by order if available
    images.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

    console.log(`✅ Loaded ${images.length} images from session ${sessionId}`);
    return images;
  } catch (error) {
    console.error("❌ Error reading images:", error);
    throw error;
  }
};

/**
 * Generate a unique session ID
 */
export const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
