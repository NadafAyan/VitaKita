import {
    collection,
    addDoc,
    getDocs,
    query,
    orderBy,
    limit,
    onSnapshot,
    doc,
    updateDoc,
    where,
    serverTimestamp,
    type DocumentData,
    type QuerySnapshot
} from "firebase/firestore";
import { db } from "@/config/firebase";

// --- Forum Services ---
export const subscribeToForumPosts = (callback: (posts: any[]) => void) => {
    try {
        const q = query(collection(db, "forum_posts"), orderBy("timestamp", "desc"));
        return onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
            const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            callback(posts);
        }, (error) => {
            console.error("Forum subscription error:", error);
            callback([]);
        });
    } catch (error) {
        console.error("Error setting up forum subscription:", error);
        return () => { };
    }
};

export const addForumPost = async (post: any) => {
    try {
        return await addDoc(collection(db, "forum_posts"), {
            ...post,
            timestamp: serverTimestamp(),
            supportCount: 0
        });
    } catch (error) {
        console.error("Error adding forum post:", error);
        throw error;
    }
};

export const supportPost = async (postId: string, currentSupport: number) => {
    try {
        const postRef = doc(db, "forum_posts", postId);
        return await updateDoc(postRef, {
            supportCount: currentSupport + 1
        });
    } catch (error) {
        console.error("Error supporting post:", error);
        throw error;
    }
};

// --- Resources Services ---
export const getResources = async () => {
    try {
        const snapshot = await getDocs(collection(db, "resources"));
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error getting resources:", error);
        return [];
    }
};

// --- Counselors & Sessions ---
export const getCounselors = async () => {
    try {
        const snapshot = await getDocs(collection(db, "counselors"));
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error getting counselors:", error);
        return [];
    }
};

export const getSessions = async (userId: string) => {
    if (!userId) return [];
    try {
        const q = query(collection(db, "sessions"), where("userId", "==", userId));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error getting sessions:", error);
        return [];
    }
};

// --- Chat Persistence ---
export const saveChatMessage = async (userId: string, message: any) => {
    if (!userId) throw new Error("User ID is required to save chat");
    try {
        const chatRef = doc(db, "chats", userId);
        const messagesRef = collection(chatRef, "messages");
        return await addDoc(messagesRef, {
            ...message,
            timestamp: serverTimestamp()
        });
    } catch (error) {
        console.error("Error saving chat message:", error);
        throw error;
    }
};

export const getChatHistory = async (userId: string) => {
    if (!userId) return [];
    try {
        const messagesRef = collection(db, "chats", userId, "messages");
        const q = query(messagesRef, orderBy("timestamp", "asc"), limit(50));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error getting chat history:", error);
        return [];
    }
};
