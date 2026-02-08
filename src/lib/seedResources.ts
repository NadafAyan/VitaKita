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

export const seedResources = async () => {
    const resourcesRef = collection(db, "resources");

    // Check if already seeded to avoid duplicates
    const q = query(resourcesRef, limit(1));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
        console.log("Resources already seeded.");
        return false;
    }

    console.log("Seeding resources...");
    for (const resource of resourcesData) {
        await addDoc(resourcesRef, resource);
    }
    console.log("Seeding complete!");
    return true;
};
