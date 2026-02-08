import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, limit } from "firebase/firestore";
import * as dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.local
dotenv.config({ path: join(__dirname, '../.env.local') });

const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID,
    measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const resourcesData = [
    {
        title: "Understanding Anxiety in College",
        description: "A comprehensive guide on managing academic pressure and social anxiety.",
        type: "Article",
        category: "Anxiety",
        link: "https://www.mentalhealth.org.uk/explore-mental-health/publications/how-manage-and-reduce-stress",
        tags: ["college", "anxiety", "academic"]
    },
    {
        title: "10-Minute Mindful Meditation",
        description: "A quick audio guide to help you find focus and calm during busy days.",
        type: "Audio",
        category: "General Wellness",
        link: "https://www.uclahealth.org/programs/marc/free-guided-meditations/guided-meditations",
        tags: ["meditation", "calm", "focus"]
    },
    {
        title: "Overcoming Procrastination",
        description: "Practical strategies to break the cycle of procrastination and reduce stress.",
        type: "Article",
        category: "Stress",
        link: "https://www.psychologytoday.com/us/basics/procrastination",
        tags: ["procrastination", "productivity", "stress"]
    },
    {
        title: "Deep Breathing Exercises",
        description: "Follow along with this video to master breathing techniques for instant stress relief.",
        type: "Video",
        category: "Anxiety",
        link: "https://www.youtube.com/watch?v=acUZdGd_3Dg",
        tags: ["breathing", "relaxation", "video"]
    },
    {
        title: "Building Healthy Relationships",
        description: "How to maintain positive social connections while balancing studies.",
        type: "Article",
        category: "General Wellness",
        link: "https://www.helpguide.org/articles/relationships-communication/building-healthy-relationships.htm",
        tags: ["relationships", "social", "wellness"]
    }
];

const counselorsData = [
    {
        name: "Dr. Sarah Johnson",
        specialty: "Anxiety & Depression",
        days: "Mon, Wed, Fri",
        modes: ["In-person", "Video", "Phone"],
        rating: 4.9,
        experience: 8
    },
    {
        name: "Dr. Michael Chen",
        specialty: "Stress & Academic Pressure",
        days: "Tue, Thu, Sat",
        modes: ["In-person", "Video"],
        rating: 4.8,
        experience: 6
    },
    {
        name: "Dr. Emily Rodriguez",
        specialty: "Relationship & Social Issues",
        days: "Mon–Thu",
        modes: ["In-person", "Video"],
        rating: 4.9,
        experience: 10
    }
];

const seedData = async () => {
    console.log("Starting seeding process...");

    // --- Seed Resources ---
    const resourcesRef = collection(db, "resources");
    const resSnapshot = await getDocs(query(resourcesRef, limit(1)));

    if (resSnapshot.empty) {
        console.log("Seeding resources...");
        for (const resource of resourcesData) {
            await addDoc(resourcesRef, resource);
            console.log(`Added resource: ${resource.title}`);
        }
    } else {
        console.log("Resources collection already has data.");
    }

    // --- Seed Counselors ---
    const counselorsRef = collection(db, "counselors");
    const counSnapshot = await getDocs(query(counselorsRef, limit(1)));

    if (counSnapshot.empty) {
        console.log("Seeding counselors...");
        for (const counselor of counselorsData) {
            await addDoc(counselorsRef, counselor);
            console.log(`Added counselor: ${counselor.name}`);
        }
    } else {
        console.log("Counselors collection already has data.");
    }

    console.log("Seeding finished successfully!");
    process.exit(0);
};

seedData().catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
});
