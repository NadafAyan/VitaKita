"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Loader2 } from "lucide-react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/components/providers/auth-provider";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

export function NewJournalEntry() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const { user } = useAuth();

    const handleSave = async () => {
        if (!user || !title.trim() || !content.trim()) return;

        setLoading(true);
        try {
            await addDoc(collection(db, "users", user.uid, "journal"), {
                title,
                content,
                createdAt: serverTimestamp(),
            });
            toast.success("Entry saved to your private journal.");
            setOpen(false);
            setTitle("");
            setContent("");
        } catch (error) {
            toast.error("Failed to save entry.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                    <Plus size={18} />
                    New Entry
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>New Journal Entry</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                            placeholder="How are you feeling?"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Thoughts</Label>
                        <Textarea
                            className="min-h-[150px]"
                            placeholder="Write your thoughts here..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave} disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Entry
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
