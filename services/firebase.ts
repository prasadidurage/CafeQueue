import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// @ts-ignore
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBZQgbTeo_KdroSu_jm17tliaw_1sWIcck",
  authDomain: "cafequeue-79211.firebaseapp.com",
  projectId: "cafequeue-79211",
  storageBucket: "cafequeue-79211.firebasestorage.app",
  messagingSenderId: "366489149179",
  appId: "1:366489149179:web:361d50ebbb80054ed9da5e",
  measurementId: "G-8DHLVZ2L5R",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth =
  getApps().length > 0
    ? getAuth(app)
    : initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });

export const db = getFirestore(app);
