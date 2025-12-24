// Test Firebase Realtime Database Connection
import { database } from "../../firebase";
import { ref, set, get } from "firebase/database";

export const testDatabaseConnection = async () => {
  try {
    // Try to write a test value
    const testRef = ref(database, "test/connection");
    await set(testRef, {
      message: "Firebase is connected!",
      timestamp: new Date().toISOString(),
    });

    // Try to read it back
    const snapshot = await get(testRef);

    if (snapshot.exists()) {
      console.log("✅ Firebase Realtime Database is CONNECTED!");
      console.log("Test data:", snapshot.val());
      return {
        success: true,
        message: "Database is connected successfully",
        data: snapshot.val(),
      };
    } else {
      console.log("❌ No data found");
      return {
        success: false,
        message: "Could not read data",
      };
    }
  } catch (error) {
    console.error("❌ Firebase Database Connection Error:", error);
    return {
      success: false,
      message: error.message,
      error: error.code,
    };
  }
};
