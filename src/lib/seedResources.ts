import { db } from "@/config/firebase";
import { collection, addDoc, getDocs, query, limit } from "firebase/firestore";

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

export const seedInitialData = async () => {
    // --- Seed Resources ---
    const resourcesRef = collection(db, "resources");
    const resSnapshot = await getDocs(query(resourcesRef, limit(1)));

    if (resSnapshot.empty) {
        console.log("Seeding resources...");
        for (const resource of resourcesData) {
            await addDoc(resourcesRef, resource);
        }
    } else {
        console.log("Resources already seeded.");
    }

    // --- Seed Counselors ---
    const counselorsRef = collection(db, "counselors");
    const counSnapshot = await getDocs(query(counselorsRef, limit(1)));

    if (counSnapshot.empty) {
        console.log("Seeding counselors...");
        for (const counselor of counselorsData) {
            await addDoc(counselorsRef, counselor);
        }
    } else {
        console.log("Counselors already seeded.");
    }

    console.log("Initial data seeding process finished.");
};
