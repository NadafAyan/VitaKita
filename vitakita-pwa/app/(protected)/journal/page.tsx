"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { NewJournalEntry } from "@/components/feature/journal-entry";
import { Calendar, Clock, BookOpen } from "lucide-react";

export default function JournalPage() {
    const { user } = useAuth();
    const [entries, setEntries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const q = query(
            collection(db, "users", user.uid, "journal"),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            setEntries(snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate()
            })));
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    if (loading) return <div>Loading journals...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Personal Journal</h1>
                    <p className="text-gray-500">A safe space for your thoughts. Only you and your counselor can see this.</p>
                </div>
                <NewJournalEntry />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {entries.length === 0 ? (
                    <div className="col-span-full text-center py-12 bg-white rounded-lg border border-dashed">
                        <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-gray-900">No entries yet</h3>
                        <p className="text-gray-500">Start writing to track your journey.</p>
                    </div>
                ) : (
                    entries.map((entry) => (
                        <Card key={entry.id} className="hover:shadow-md transition-shadow">
                            <CardHeader>
                                <CardTitle className="line-clamp-1">{entry.title}</CardTitle>
                                <CardDescription className="flex items-center gap-2 text-xs">
                                    <Calendar size={12} />
                                    {entry.createdAt?.toLocaleDateString()}
                                    <Clock size={12} className="ml-2" />
                                    {entry.createdAt?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 line-clamp-4 text-sm whitespace-pre-line">
                                    {entry.content}
                                </p>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
