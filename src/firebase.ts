import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

const firebaseConfig = {
  apiKey: "AIzaSyCDiXYUV33li8xlmUFUvlxm6q7oWjgNHtw",
  authDomain: "vitakita-c587a.firebaseapp.com",
  projectId: "vitakita-c587a",
  storageBucket: "vitakita-c587a.appspot.com",
  messagingSenderId: "880691647526",
  appId: "1:880691647526:web:c4fdcaf213ab9062e242e7",
  measurementId: "G-5TYTHHFDVV"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

// Set persistence only once
setPersistence(auth, browserLocalPersistence);

export { app, auth };

function useFirebaseAuth() {
  const [user, setUser] = useState<any | null>(undefined); // undefined = loading

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser || null);
    });
    return () => unsubscribe();
  }, []);

  return user;
}