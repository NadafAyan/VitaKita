"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { Card, CardContent, CardTitle, CardDescription, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Newspaper, MessageSquare, Phone, Activity, Calendar, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, query, orderBy, limit, onSnapshot, where, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function DashboardPage() {
    const { user, userData } = useAuth();
    const [moodData, setMoodData] = useState<any[]>([]);
    const [stats, setStats] = useState({
        streak: 0,
        journalCount: 0,
        chatCount: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        // 1. Fetch Mood History (Last 7 days from daily_logs)
        // Note: You'll need to create a mechanism to save 'daily_logs' to populate this.
        const logsRef = collection(db, "users", user.uid, "daily_logs");
        const qLogs = query(logsRef, orderBy("date", "desc"), limit(7));

        const unsubscribeLogs = onSnapshot(qLogs, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                day: new Date(doc.data().date.toDate()).toLocaleDateString('en-US', { weekday: 'short' }),
                score: doc.data().moodScore || 0,
                originalDate: doc.data().date
            })).reverse();
            setMoodData(data);
        });

        // 2. Fetch Stats (Aggregations)
        // For now, calculating from client-side counts or specific docs to denote 'Real-time'
        const journalRef = collection(db, "users", user.uid, "journal");
        const unsubscribeJournal = onSnapshot(journalRef, (snap) => {
            setStats(prev => ({ ...prev, journalCount: snap.size }));
        });

        // Chats count (assuming a subcollection or just mock for now if not implemented)
        // const chatsRef = collection(db, "users", user.uid, "chats");
        // const unsubscribeChats = onSnapshot(chatsRef, (snap) => setStats(prev => ({...prev, chatCount: snap.size})));

        setLoading(false);

        return () => {
            unsubscribeLogs();
            unsubscribeJournal();
        };
    }, [user]);

    const severity = userData?.currentSeverity || "Unknown";
    const severityColor =
        severity === "Severe" ? "text-red-600 bg-red-100" :
            severity === "Moderately Severe" ? "text-orange-600 bg-orange-100" :
                severity === "Moderate" ? "text-yellow-600 bg-yellow-100" :
                    "text-green-600 bg-green-100";

    if (loading) return <div className="flex h-full items-center justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Welcome back, {userData?.name?.split(" ")[0] || "Friend"}
                    </h1>
                    <p className="text-gray-500">Here's your wellness overview for today.</p>
                </div>
                <div className={`px-4 py-2 rounded-full font-medium w-fit ${severityColor}`}>
                    Status: {severity}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                        <Activity className="w-8 h-8 text-blue-500 mb-2" />
                        <div className="text-2xl font-bold">{stats.streak}</div>
                        <div className="text-xs text-muted-foreground">Day Streak</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                        <Newspaper className="w-8 h-8 text-purple-500 mb-2" />
                        <div className="text-2xl font-bold">{stats.journalCount}</div>
                        <div className="text-xs text-muted-foreground">Journal Entries</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                        <MessageSquare className="w-8 h-8 text-green-500 mb-2" />
                        <div className="text-2xl font-bold">12+</div>
                        <div className="text-xs text-muted-foreground">AI Interactions</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                        <Calendar className="w-8 h-8 text-orange-500 mb-2" />
                        <div className="text-2xl font-bold">0</div>
                        <div className="text-xs text-muted-foreground">Appointments</div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Area */}
            <div className="grid md:grid-cols-3 gap-6">
                {/* Mood Chart */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Mood History</CardTitle>
                        <CardDescription>Your emotional trends (Last 7 Entries)</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        {moodData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={moodData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="day" tickLine={false} axisLine={false} />
                                    <YAxis hide domain={[0, 10]} />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: "#3b82f6" }} />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-400">
                                No mood data available yet using.
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <div className="space-y-6">
                    <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
                        <CardHeader>
                            <CardTitle>Need someone to talk to?</CardTitle>
                            <CardDescription className="text-blue-100">Our AI companion is here 24/7.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Link href="/chat">
                                <Button variant="secondary" className="w-full text-blue-600 font-bold">Start Chat</Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Upcoming</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 bg-gray-50 text-center text-sm text-gray-500 rounded-lg">
                                No appointments scheduled.
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
