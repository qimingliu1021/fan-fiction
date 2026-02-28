// experiments/importCities.ts

import * as admin from "firebase-admin";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

// Path to your converted JSON data file
import citiesData from "./us_cities_rtdb.json";

// Initialize Firebase Admin SDK using environment variables
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
  });
}

const db = admin.firestore();

// Define your target collection
const collectionName = "uscities";

// Convert the JSON object to an array
const citiesArray = Object.values(citiesData);

// Function to upload data
async function uploadCities() {
  console.log(`Starting data upload to collection: ${collectionName}`);
  let writeCount = 0;
  let batchCount = 0;

  const BATCH_SIZE = 500; // Max batch size is 500 operations

  for (let i = 0; i < citiesArray.length; i += BATCH_SIZE) {
    const batch = db.batch();
    const endIndex = Math.min(i + BATCH_SIZE, citiesArray.length);

    console.log(
      `Processing batch ${++batchCount}: items ${i + 1} to ${endIndex}`
    );

    for (let j = i; j < endIndex; j++) {
      const city = citiesArray[j];

      console.log("current city: ", city.city);

      // Create document reference with auto-generated ID or use city.id if available
      const docRef = db.collection(collectionName).doc();

      batch.set(docRef, city);
      writeCount++;
    }

    try {
      await batch.commit();
      console.log(
        `✅ Batch ${batchCount} committed. Total documents processed: ${writeCount}`
      );
    } catch (error) {
      console.error(`❌ Error committing batch ${batchCount}:`, error);
      process.exit(1);
    }

    // Add small delay between batches to avoid rate limiting
    if (endIndex < citiesArray.length) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  console.log(
    `🎉 Data upload complete! Total ${writeCount} documents added/updated.`
  );
  process.exit(0);
}

// Run the upload function
uploadCities().catch((error) => {
  console.error("💥 An error occurred during upload:", error);
  process.exit(1);
});
