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
    const q = query(collection(db, "forum_posts"), orderBy("timestamp", "desc"));
    return onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
        const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(posts);
    });
};

export const addForumPost = async (post: any) => {
    return await addDoc(collection(db, "forum_posts"), {
        ...post,
        timestamp: serverTimestamp(),
        supportCount: 0
    });
};

export const supportPost = async (postId: string, currentSupport: number) => {
    const postRef = doc(db, "forum_posts", postId);
    return await updateDoc(postRef, {
        supportCount: currentSupport + 1
    });
};

// --- Resources Services ---
export const getResources = async () => {
    const snapshot = await getDocs(collection(db, "resources"));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// --- Counselors & Sessions ---
export const getCounselors = async () => {
    const snapshot = await getDocs(collection(db, "counselors"));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getSessions = async (userId: string) => {
    const q = query(collection(db, "sessions"), where("userId", "==", userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// --- Chat Persistence ---
export const saveChatMessage = async (userId: string, message: any) => {
    const chatRef = doc(db, "chats", userId);
    const messagesRef = collection(chatRef, "messages");
    return await addDoc(messagesRef, {
        ...message,
        timestamp: serverTimestamp()
    });
};

export const getChatHistory = async (userId: string) => {
    const messagesRef = collection(db, "chats", userId, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"), limit(50));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
