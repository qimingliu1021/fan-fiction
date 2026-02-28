// Bingbing Ma 2025-08-13
import {
  doc,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";

export interface HexagramResult {
  id?: string;
  timestamp: Date;
  coinResults: string[]; // ["yang", "yin", "yang", "yin", "yang", "yang"]
  binary: string; // "101010"
  hexagram: string; // The hexagram name/number
  description?: string;
  userLocation?: {
    city: string;
    state: string;
    latitude: number;
    longitude: number;
  };
  fortuneData?: {
    journey?: string;
    currentCityImpact?: string;
    destinationCityTraits?: string;
    directionalGuidance?: {
      direction: string;
      meaning: string;
      recommendedCities: string[];
    };
  };
}

/**
 * Save hexagram result to user's subcollection
 */
export const saveHexagramResult = async (
  userId: string,
  hexagramData: Omit<HexagramResult, "id" | "timestamp">
): Promise<string> => {
  try {
    const userDocRef = doc(db, "users", userId);
    const hexagramCollectionRef = collection(userDocRef, "hexagrams");

    const result = await addDoc(hexagramCollectionRef, {
      ...hexagramData,
      timestamp: Timestamp.now(),
    });

    // Update user's reading count in main document
    await updateUserReadingCount(userId);

    return result.id;
  } catch (error) {
    console.error("Error saving hexagram result:", error);
    throw new Error("Failed to save hexagram result");
  }
};

/**
 * Get user's hexagram history
 */
export const getUserHexagramHistory = async (
  userId: string,
  limitCount: number = 10
): Promise<HexagramResult[]> => {
  try {
    const userDocRef = doc(db, "users", userId);
    const hexagramCollectionRef = collection(userDocRef, "hexagrams");

    const q = query(
      hexagramCollectionRef,
      orderBy("timestamp", "desc"),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    const results: HexagramResult[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      results.push({
        id: doc.id,
        timestamp: data.timestamp.toDate(),
        coinResults: data.coinResults,
        binary: data.binary,
        hexagram: data.hexagram,
        description: data.description,
        userLocation: data.userLocation,
        fortuneData: data.fortuneData,
      });
    });

    return results;
  } catch (error) {
    console.error("Error getting hexagram history:", error);
    throw new Error("Failed to get hexagram history");
  }
};

/**
 * Get a specific hexagram result by ID
 */
export const getHexagramResult = async (
  userId: string,
  hexagramId: string
): Promise<HexagramResult | null> => {
  try {
    const userDocRef = doc(db, "users", userId);
    // const hexagramDocRef = doc(userDocRef, "hexagrams", hexagramId);

    const docSnap = await getDocs(collection(userDocRef, "hexagrams"));
    const targetDoc = docSnap.docs.find((doc) => doc.id === hexagramId);

    if (targetDoc) {
      const data = targetDoc.data();
      return {
        id: targetDoc.id,
        timestamp: data.timestamp.toDate(),
        coinResults: data.coinResults,
        binary: data.binary,
        hexagram: data.hexagram,
        description: data.description,
        userLocation: data.userLocation,
        fortuneData: data.fortuneData,
      };
    }

    return null;
  } catch (error) {
    console.error("Error getting hexagram result:", error);
    throw new Error("Failed to get hexagram result");
  }
};

/**
 * Get the count of hexagram readings for a user
 */
export const getUserReadingCount = async (userId: string): Promise<number> => {
  try {
    const userDocRef = doc(db, "users", userId);
    const hexagramCollectionRef = collection(userDocRef, "hexagrams");

    const querySnapshot = await getDocs(hexagramCollectionRef);
    return querySnapshot.size;
  } catch (error) {
    console.error("Error getting reading count:", error);
    return 0;
  }
};

/**
 * Get user's hexagram history with count
 */
export const getUserHexagramHistoryWithCount = async (
  userId: string,
  limitCount: number = 10
): Promise<{ history: HexagramResult[]; totalCount: number }> => {
  try {
    const userDocRef = doc(db, "users", userId);
    const hexagramCollectionRef = collection(userDocRef, "hexagrams");

    // Get total count
    const allDocs = await getDocs(hexagramCollectionRef);
    const totalCount = allDocs.size;

    // Get limited history
    const q = query(
      hexagramCollectionRef,
      orderBy("timestamp", "desc"),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    const results: HexagramResult[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      results.push({
        id: doc.id,
        timestamp: data.timestamp.toDate(),
        coinResults: data.coinResults,
        binary: data.binary,
        hexagram: data.hexagram,
        description: data.description,
        userLocation: data.userLocation,
        fortuneData: data.fortuneData,
      });
    });

    return { history: results, totalCount };
  } catch (error) {
    console.error("Error getting hexagram history with count:", error);
    throw new Error("Failed to get hexagram history with count");
  }
};

/**
 * Update user's reading count in the main user document
 */
export const updateUserReadingCount = async (userId: string): Promise<void> => {
  try {
    const userDocRef = doc(db, "users", userId);
    const hexagramCollectionRef = collection(userDocRef, "hexagrams");

    // Get current count
    const querySnapshot = await getDocs(hexagramCollectionRef);
    const readingCount = querySnapshot.size;

    // Update user document with reading count
    await updateDoc(userDocRef, {
      readingCount: readingCount,
      lastUpdated: new Date().toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    });
  } catch (error) {
    console.error("Error updating user reading count:", error);
    throw new Error("Failed to update user reading count");
  }
};

/**
 * Initialize reading count for existing users (run once)
 */
export const initializeExistingUsersReadingCount = async (): Promise<void> => {
  try {
    const usersCollectionRef = collection(db, "users");
    const usersSnapshot = await getDocs(usersCollectionRef);

    const updatePromises = usersSnapshot.docs.map(async (userDoc) => {
      const userId = userDoc.id;
      await updateUserReadingCount(userId);
    });

    await Promise.all(updatePromises);
    console.log("Initialized reading count for all existing users");
  } catch (error) {
    console.error(
      "Error initializing reading count for existing users:",
      error
    );
    throw new Error("Failed to initialize reading count for existing users");
  }
};

/**
 * Clean up existing users: remove cityAnalysisStarted and fix lastLogin timezone
 */
export const cleanupExistingUsers = async (): Promise<void> => {
  try {
    const usersCollectionRef = collection(db, "users");
    const usersSnapshot = await getDocs(usersCollectionRef);

    const updatePromises = usersSnapshot.docs.map(async (userDoc) => {
      const userId = userDoc.id;
      const userData = userDoc.data();

      // 准备更新数据
      const updateData: any = {};

      // 删除 cityAnalysisStarted 字段
      if ("cityAnalysisStarted" in userData) {
        updateData.cityAnalysisStarted = null; // 设置为 null 来删除字段
      }

      // 修复 lastLogin 时区（如果存在且是 ISO 格式）
      if (
        userData.lastLogin &&
        typeof userData.lastLogin === "string" &&
        userData.lastLogin.includes("T")
      ) {
        // 如果是 ISO 格式，转换为本地时间
        const date = new Date(userData.lastLogin);
        updateData.lastLogin = date.toLocaleString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
      }

      // 如果有需要更新的数据，则更新文档
      if (Object.keys(updateData).length > 0) {
        await updateDoc(doc(db, "users", userId), updateData);
        console.log(`Updated user ${userId}:`, updateData);
      }
    });

    await Promise.all(updatePromises);
    console.log("Cleaned up all existing users");
  } catch (error) {
    console.error("Error cleaning up existing users:", error);
    throw new Error("Failed to cleanup existing users");
  }
};
