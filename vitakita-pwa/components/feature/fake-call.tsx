"use client";

import { Phone, PhoneOff, Mic, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function FakeCallScreen({ onEndCall }: { onEndCall: () => void }) {
    const [status, setStatus] = useState("Incoming Call...");

    useEffect(() => {
        const timer = setTimeout(() => {
            setStatus("00:00");
            // Simulate answering automatically or just wait for user interaction to 'answer' in a real app
            // For this feature, we simulate an *active* call logic if we wanted, 
            // but usually 'Fake Call' starts ringing.
            // Let's simplify: It renders as an "Active Call" immediately to fake an excuse.
            setStatus("00:01");
        }, 1000);

        // Timer increment
        const interval = setInterval(() => {
            setStatus(prev => {
                if (prev.includes(":")) {
                    const [mins, secs] = prev.split(":").map(Number);
                    const newSecs = secs + 1;
                    return `00:${newSecs < 10 ? '0' + newSecs : newSecs}`;
                }
                return prev;
            })
        }, 1000);

        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        }
    }, []);

    return (
        <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col items-center justify-between py-20 text-white">
            <div className="flex flex-col items-center gap-4 mt-10">
                <Avatar className="w-32 h-32 border-4 border-gray-700">
                    <AvatarFallback className="bg-gray-800 text-4xl">Mom</AvatarFallback>
                </Avatar>
                <div className="text-center">
                    <h1 className="text-4xl font-semibold">Mom</h1>
                    <p className="text-gray-400 text-lg mt-2">{status}</p>
                </div>
            </div>

            <div className="w-full max-w-sm grid grid-cols-3 gap-8 px-8">
                <Button variant="ghost" className="flex flex-col gap-2 h-auto hover:bg-transparent">
                    <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center">
                        <Mic size={24} />
                    </div>
                    <span className="text-xs text-gray-400">Mute</span>
                </Button>
                <Button variant="ghost" className="flex flex-col gap-2 h-auto hover:bg-transparent">
                    <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center">
                        <User size={24} />
                    </div>
                    <span className="text-xs text-gray-400">Keypad</span>
                </Button>
                <Button variant="ghost" className="flex flex-col gap-2 h-auto hover:bg-transparent">
                    <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center">
                        <Mic size={24} />
                    </div>
                    <span className="text-xs text-gray-400">Speaker</span>
                </Button>
            </div>

            <div className="flex justify-center mb-10">
                <Button
                    onClick={onEndCall}
                    className="w-20 h-20 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center"
                >
                    <PhoneOff size={32} />
                </Button>
            </div>
        </div>
    );
}
