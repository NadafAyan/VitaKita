"use client";

import { useState, useEffect } from "react";
import { Plus, Pill, Check, Trash2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/providers/auth-provider";
import { addDoc, collection, onSnapshot, query, deleteDoc, doc, updateDoc, where, getDocs, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function MedicationPage() {
    const { user } = useAuth();
    const [meds, setMeds] = useState<any[]>([]);
    const [open, setOpen] = useState(false);

    // New Med Form
    const [name, setName] = useState("");
    const [dosage, setDosage] = useState("");
    const [time, setTime] = useState("");

    // Today's log
    const [takenMeds, setTakenMeds] = useState<string[]>([]);

    useEffect(() => {
        if (!user) return;

        // 1. Fetch Medications
        const qMeds = query(collection(db, "users", user.uid, "medications"));
        const unsubMeds = onSnapshot(qMeds, (snap) => {
            setMeds(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        });

        // 2. Fetch Today's Log
        const todayStr = new Date().toISOString().split('T')[0];
        const logRef = doc(db, "users", user.uid, "medication_logs", todayStr);

        // Check if log exists, strict read
        // Real-time listener for today's log
        const unsubLog = onSnapshot(logRef, (docSnap) => {
            if (docSnap.exists()) {
                setTakenMeds(docSnap.data().takenIds || []);
            } else {
                setTakenMeds([]);
            }
        });

        return () => {
            unsubMeds();
            unsubLog();
        }
    }, [user]);

    const addMedication = async () => {
        if (!user || !name || !dosage || !time) return;
        try {
            await addDoc(collection(db, "users", user.uid, "medications"), {
                name,
                dosage,
                time,
                frequency: "daily"
            });
            toast.success("Medication added");
            setOpen(false);
            setName(""); setDosage(""); setTime("");
        } catch (e) {
            toast.error("Failed to add medication");
        }
    };

    const deleteMed = async (id: string) => {
        if (!user) return;
        try {
            await deleteDoc(doc(db, "users", user.uid, "medications", id));
            toast.success("Medication removed");
        } catch (e) {
            toast.error("Failed to delete");
        }
    }

    const toggleTaken = async (medId: string) => {
        if (!user) return;
        const todayStr = new Date().toISOString().split('T')[0];
        const logRef = doc(db, "users", user.uid, "medication_logs", todayStr);

        const isTaken = takenMeds.includes(medId);
        const newTaken = isTaken
            ? takenMeds.filter(id => id !== medId)
            : [...takenMeds, medId];

        try {
            await setDoc(logRef, {
                date: todayStr,
                takenIds: newTaken
            }, { merge: true });

            if (!isTaken) toast.success("Marked as taken!");
        } catch (e) {
            toast.error("Failed to update status");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Medications</h1>
                    <p className="text-gray-500">Track your daily prescriptions and supplements.</p>
                </div>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                            <Plus size={18} />
                            Add Medication
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Medication</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Medicine Name</Label>
                                <Input placeholder="e.g. Sertraline" value={name} onChange={e => setName(e.target.value)} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Dosage</Label>
                                    <Input placeholder="e.g. 50mg" value={dosage} onChange={e => setDosage(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Time</Label>
                                    <Input type="time" value={time} onChange={e => setTime(e.target.value)} />
                                </div>
                            </div>
                        </div>
                        <Button onClick={addMedication} className="w-full">Save Medication</Button>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4">
                {meds.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg border border-dashed text-gray-400">
                        <Pill className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No medications added yet.</p>
                    </div>
                ) : (
                    meds.map(med => {
                        const isTaken = takenMeds.includes(med.id);
                        return (
                            <div key={med.id} className={cn(
                                "flex items-center justify-between p-4 rounded-xl border transition-all",
                                isTaken ? "bg-green-50 border-green-200" : "bg-white border-gray-200 hover:border-blue-300"
                            )}>
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                                        isTaken ? "bg-green-100 text-green-700" : "bg-blue-50 text-blue-600"
                                    )}>
                                        <Pill size={20} />
                                    </div>
                                    <div>
                                        <h3 className={cn("font-semibold", isTaken && "text-green-800")}>{med.name}</h3>
                                        <div className="flex items-center gap-3 text-sm text-gray-500">
                                            <span>{med.dosage}</span>
                                            <span className="w-1 h-1 rounded-full bg-gray-300" />
                                            <span className="flex items-center gap-1">
                                                <Clock size={12} />
                                                {med.time}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="text-gray-400 hover:text-red-500"
                                        onClick={() => deleteMed(med.id)}
                                    >
                                        <Trash2 size={18} />
                                    </Button>
                                    <Button
                                        className={cn(
                                            "gap-2 transition-all",
                                            isTaken ? "bg-green-600 hover:bg-green-700 text-white" : "variant-outline"
                                        )}
                                        variant={isTaken ? "default" : "outline"}
                                        onClick={() => toggleTaken(med.id)}
                                    >
                                        {isTaken ? <Check size={16} /> : null}
                                        {isTaken ? "Taken" : "Mark as Taken"}
                                    </Button>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    );
}
