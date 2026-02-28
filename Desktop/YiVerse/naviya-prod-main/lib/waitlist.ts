import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit,
  Timestamp 
} from "firebase/firestore";
import { db } from "./firebase";

export interface WaitlistEntry {
  id?: string;
  email: string;
  name: string;
  timestamp: Date;
  source?: string; // 来源页面
  status?: 'pending' | 'contacted' | 'converted';
  notes?: string; // 管理员备注
}

/**
 * Add new email to waitlist
 */
export const addToWaitlist = async (
  email: string, 
  name: string, 
  source: string = 'homepage'
): Promise<string> => {
  try {
    const waitlistCollectionRef = collection(db, "waitlist");
    
    const result = await addDoc(waitlistCollectionRef, {
      email: email.toLowerCase().trim(),
      name: name.trim(),
      timestamp: Timestamp.now(),
      source: source,
      status: 'pending',
      notes: ''
    });
    
    return result.id;
  } catch (error) {
    console.error("Error adding to waitlist:", error);
    throw new Error("Failed to add to waitlist");
  }
};

/**
 * Get all waitlist entries (for admin use)
 */
export const getAllWaitlistEntries = async (
  limitCount: number = 100
): Promise<WaitlistEntry[]> => {
  try {
    const waitlistCollectionRef = collection(db, "waitlist");
    
    const q = query(
      waitlistCollectionRef, 
      orderBy("timestamp", "desc"), 
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const results: WaitlistEntry[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      results.push({
        id: doc.id,
        email: data.email,
        name: data.name,
        timestamp: data.timestamp.toDate(),
        source: data.source,
        status: data.status,
        notes: data.notes
      });
    });
    
    return results;
  } catch (error) {
    console.error("Error getting waitlist entries:", error);
    throw new Error("Failed to get waitlist entries");
  }
};

/**
 * Check if email already exists in waitlist
 */
export const checkEmailExists = async (email: string): Promise<boolean> => {
  try {
    const waitlistCollectionRef = collection(db, "waitlist");
    const q = query(waitlistCollectionRef);
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.some(doc => 
      doc.data().email.toLowerCase() === email.toLowerCase()
    );
  } catch (error) {
    console.error("Error checking email existence:", error);
    return false;
  }
};
