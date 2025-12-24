// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAm93AfVWj7daaptIqYb4StGV9WkJRo5U4",
  authDomain: "payal-s-kitchen.firebaseapp.com",
  projectId: "payal-s-kitchen",
  storageBucket: "payal-s-kitchen.firebasestorage.app",
  messagingSenderId: "150114881414",
  appId: "1:150114881414:web:834e86ea1c32cf37dd2607",
  measurementId: "G-EVXGYBMWMW",
  databaseURL:
    "https://payal-s-kitchen-default-rtdb.asia-southeast1.firebasedatabase.app",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Realtime Database
import { getDatabase } from "firebase/database";
const database = getDatabase(app);

// Initialize Firebase Authentication
import { getAuth } from "firebase/auth";
const auth = getAuth(app);

// Export for use in other files
export { app, analytics, database, auth };
