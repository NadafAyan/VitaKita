"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { AlertTriangle, MapPin, Phone, MessageCircle } from "lucide-react";
import { useState } from "react";
import { FakeCallScreen } from "./fake-call";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/auth-provider";


export function EmergencySOS() {
    const { userData } = useAuth();
    const [fakeCallActive, setFakeCallActive] = useState(false);

    const contactName = userData?.emergencyContactName || "Emergency Services";
    // Default to 112 if no contact set
    const contactNumber = userData?.emergencyContactNumber || "112";

    const handleShareLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser.");
            return;
        }

        toast.info("Acquiring location...");

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const mapLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
                const message = `HELP! I need assistance. My location: ${mapLink}`;

                window.open(`sms:${contactNumber}?body=${encodeURIComponent(message)}`, "_blank");
                toast.success(`SMS drafted to ${contactName}.`);
            },
            (error) => {
                toast.error("Unable to retrieve location.");
            }
        );
    };

    if (fakeCallActive) {
        return <FakeCallScreen onEndCall={() => setFakeCallActive(false)} />;
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="destructive" size="icon" className="rounded-full shadow-lg h-12 w-12 animate-pulse">
                    <AlertTriangle className="h-6 w-6" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md border-red-200 bg-red-50">
                <DialogHeader>
                    <DialogTitle className="text-red-700 flex items-center gap-2">
                        <AlertTriangle className="fill-red-100" />
                        Emergency SOS
                    </DialogTitle>
                    <DialogDescription className="text-red-600">
                        Contacting: <span className="font-bold">{contactName}</span> ({contactNumber})
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4 py-4">

                    <Button
                        variant="outline"
                        className="h-24 flex flex-col gap-2 border-red-300 hover:bg-red-100 hover:text-red-900"
                        onClick={() => window.open(`tel:${contactNumber}`)}
                    >
                        <Phone className="h-8 w-8 text-red-600" />
                        <span className="font-bold">Call {contactName}</span>
                    </Button>

                    <Button
                        variant="outline"
                        className="h-24 flex flex-col gap-2 border-red-300 hover:bg-red-100 hover:text-red-900"
                        onClick={handleShareLocation}
                    >
                        <MapPin className="h-8 w-8 text-red-600" />
                        <span className="font-bold">Share Location</span>
                    </Button>

                    <Button
                        variant="outline"
                        className="h-24 flex flex-col gap-2 border-blue-300 hover:bg-blue-100 hover:text-blue-900 col-span-2"
                        onClick={() => setFakeCallActive(true)}
                    >
                        <Phone className="h-8 w-8 text-blue-600 animate-bounce" />
                        <span className="font-bold">Trigger Fake Call (Exit Strategy)</span>
                    </Button>

                </div>

                <div className="text-xs text-center text-gray-500">
                    Your location is never tracked without your explicit action.
                </div>
            </DialogContent>
        </Dialog>
    );
}
