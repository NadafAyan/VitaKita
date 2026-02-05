import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCDiXYUV33li8xlmUFUvlxm6q7oWjgNHtw",
    authDomain: "vitakita-c587a.firebaseapp.com",
    projectId: "vitakita-c587a",
    storageBucket: "vitakita-c587a.firebasestorage.app",
    messagingSenderId: "880691647526",
    appId: "1:880691647526:web:c4fdcaf213ab9062e242e7",
    measurementId: "G-5TYTHHFDVV"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, googleProvider };
