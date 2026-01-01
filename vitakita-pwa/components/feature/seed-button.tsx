"use client";

import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";
import { useAuth } from "@/components/providers/auth-provider";
import { collection, addDoc, serverTimestamp, doc, setDoc } from "firebase/firestore";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export function SeedButton() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleSeed = async () => {
        if (!user) return;
        setLoading(true);
        try {
            // 1. Add some journal entries
            await addDoc(collection(db, "users", user.uid, "journal"), {
                title: "First Day",
                content: "Feeling better today.",
                createdAt: serverTimestamp()
            });

            // 2. Add some daily logs for the graph
            const days = [0, 1, 2, 3, 4]; // Past 5 days
            for (const d of days) {
                const date = new Date();
                date.setDate(date.getDate() - d);
                await addDoc(collection(db, "users", user.uid, "daily_logs"), {
                    date: date,
                    moodScore: Math.floor(Math.random() * 5) + 5, // Random 5-10
                    journalEntry: true
                });
            }

            toast.success("Added dummy data! Refresh the page.");
            window.location.reload();
        } catch (e) {
            console.error(e);
            toast.error("Failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button onClick={handleSeed} variant="outline" size="sm" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={16} /> : "Seed Test Data"}
        </Button>
    );
}
