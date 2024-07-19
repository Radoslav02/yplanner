import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCuA73ks9-t0FvaS3Ylr0J2j5k14pb7yOM",
    authDomain: "jplanner-a01af.firebaseapp.com",
    projectId: "jplanner-a01af",
    storageBucket: "jplanner-a01af.appspot.com",
    messagingSenderId: "809530577229",
    appId: "1:809530577229:web:8b8b66ab1292d62ef92704",
    measurementId: "G-3C7D1VTKPR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
