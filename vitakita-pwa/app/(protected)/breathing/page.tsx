"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Square, RefreshCcw } from "lucide-react";
import { motion } from "framer-motion";

export default function BreathingPage() {
    const [isActive, setIsActive] = useState(false);
    const [text, setText] = useState("Ready?");
    const [phase, setPhase] = useState<"inhale" | "hold" | "exhale" | "idle">("idle");

    useEffect(() => {
        if (!isActive) {
            setPhase("idle");
            setText("Ready?");
            return;
        }

        // 4-7-8 Technique
        // Total cycle: 19s
        const cycle = async () => {
            if (!isActive) return;

            // Inhale (4s)
            setPhase("inhale");
            setText("Inhale...");
            await new Promise(r => setTimeout(r, 4000));
            if (!isActive) return;

            // Hold (7s)
            setPhase("hold");
            setText("Hold");
            await new Promise(r => setTimeout(r, 7000));
            if (!isActive) return;

            // Exhale (8s)
            setPhase("exhale");
            setText("Exhale...");
            await new Promise(r => setTimeout(r, 8000));
            if (!isActive) return;

            cycle(); // Loop
        };

        cycle();

        return () => { };
    }, [isActive]);

    const variants = {
        idle: { scale: 1, opacity: 0.8 },
        inhale: { scale: 1.5, opacity: 1, transition: { duration: 4 } },
        hold: { scale: 1.5, opacity: 1, transition: { duration: 7 } }, // Stay expanded
        exhale: { scale: 1, opacity: 0.8, transition: { duration: 8 } }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] gap-12">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-gray-900">Breathing Exercises</h1>
                <p className="text-gray-500">4-7-8 Technique for Anxiety Relief</p>
            </div>

            <div className="relative flex items-center justify-center w-64 h-64">
                {/* Ripple Effect Background */}
                <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-20" style={{ animationDuration: '3s' }} />

                <motion.div
                    className="w-40 h-40 bg-blue-500 rounded-full flex items-center justify-center shadow-2xl z-10"
                    variants={variants}
                    animate={phase}
                >
                    <span className="text-white text-xl font-medium">{text}</span>
                </motion.div>
            </div>

            <div className="flex gap-4">
                {!isActive ? (
                    <Button size="lg" className="gap-2 bg-green-600 hover:bg-green-700 w-32" onClick={() => setIsActive(true)}>
                        <Play size={20} /> Start
                    </Button>
                ) : (
                    <Button size="lg" variant="destructive" className="gap-2 w-32" onClick={() => setIsActive(false)}>
                        <Square size={20} /> Stop
                    </Button>
                )}
            </div>
        </div>
    );
}
