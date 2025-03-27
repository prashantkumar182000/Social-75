import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyAAPTwd303-GgS8FTSWzHQGTKFFQui8mn4",
  authDomain: "social75-6c1f6.firebaseapp.com",
  projectId: "social75-6c1f6",
  storageBucket: "social75-6c1f6.firebasestorage.app",
  messagingSenderId: "169337104734",
  appId: "1:169337104734:web:42ba9b7434cc9fd3e907cf",
  measurementId: "G-03FZEZZ0MQ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);