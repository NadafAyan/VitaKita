// import { initializeApp } from "firebase/app";
// import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: "AIzaSyCDiXYUV33li8xlmUFUvlxm6q7oWjgNHtw",
//   authDomain: "YOUR_AUTH_DOMAIN",
//   projectId: "vitakita-c587a",
//   storageBucket: "YOUR_STORAGE_BUCKET",
//   messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
//   appId: "YOUR_APP_ID"
// };

// const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);
// export const db = getFirestore(app);

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCDiXYUV33li8xlmUFUvlxm6q7oWjgNHtw",
  authDomain: "vitakita-c587a.firebaseapp.com",
  projectId: "vitakita-c587a",
  storageBucket: "vitakita-c587a.firebasestorage.app",
  messagingSenderId: "880691647526",
  appId: "1:880691647526:web:c4fdcaf213ab9062e242e7",
  measurementId: "G-5TYTHHFDVV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);