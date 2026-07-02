import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCVasMLe9Y1K5x8RhnHZKesi1pDc8xtepI",
  authDomain: "lexai-auth-9402d.firebaseapp.com",
  projectId: "lexai-auth-9402d",
  storageBucket: "lexai-auth-9402d.firebasestorage.app",
  messagingSenderId: "333372361809",
  appId: "1:333372361809:web:8385dcd76c64034364fc70",
  measurementId: "G-Y3N83XX1BJ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
