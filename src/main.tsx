import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";

// const firebaseConfig = {
//   apiKey: "AIzaSyCDiXYUV33li8xlmUFUvlxm6q7oWjgNHtw",
//   authDomain: "vitakita-c587a.firebaseapp.com",
//   projectId: "vitakita-c587a",
//   storageBucket: "vitakita-c587a.appspot.com", // Corrected: should be .appspot.com
//   messagingSenderId: "880691647526",
//   appId: "1:880691647526:web:c4fdcaf213ab9062e242e7",
//   measurementId: "G-5TYTHHFDVV"
// };

// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);

// export { app, auth };

createRoot(document.getElementById("root")!).render(<App />);
