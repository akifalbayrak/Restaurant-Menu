import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBXYILTviGdxT_T0RyHeoaWcLbysujBVpA",
    authDomain: "food-order-d51fb.firebaseapp.com",
    projectId: "food-order-d51fb",
    storageBucket: "food-order-d51fb.appspot.com",
    messagingSenderId: "100874619758",
    appId: "1:100874619758:web:5e47d0dbc82514e3b6cf7f",
    measurementId: "G-8LPRFYYQJK",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
