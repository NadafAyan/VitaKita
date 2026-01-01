"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { doc, updateDoc, arrayUnion, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/components/providers/auth-provider";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const questions = [
    {
        id: "q1",
        text: "Little interest or pleasure in doing things",
    },
    {
        id: "q2",
        text: "Feeling down, depressed, or hopeless",
    },
    {
        id: "q3",
        text: "Trouble falling or staying asleep, or sleeping too much",
    },
    {
        id: "q4",
        text: "Feeling tired or having little energy",
    },
    {
        id: "q5",
        text: "Poor appetite or overeating",
    },
    {
        id: "q6",
        text: "Feeling bad about yourself - or that you are a failure or have let yourself or your family down",
    },
    {
        id: "q7",
        text: "Trouble concentrating on things, such as reading the newspaper or watching television",
    },
];

const options = [
    { value: "0", label: "Not at all" },
    { value: "1", label: "Several days" },
    { value: "2", label: "More than half the days" },
    { value: "3", label: "Nearly every day" },
];

export function DiagnosticTest() {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useAuth();
    const router = useRouter();

    const [contactName, setContactName] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const isContactStep = currentStep === questions.length;

    const handleAnswer = (val: string) => {
        setAnswers(prev => ({ ...prev, [questions[currentStep].id]: parseInt(val) }));
    };

    const handleNext = () => {
        if (currentStep < questions.length && questions[currentStep].id in answers) {
            setCurrentStep(prev => prev + 1);
        } else if (isContactStep) {
            if (contactName && contactNumber) {
                handleSubmit();
            } else {
                toast.error("Please fill in emergency contact details.");
            }
        }
    };

    const handleSubmit = async () => {
        if (!user) return;
        setIsSubmitting(true);

        const score = Object.values(answers).reduce((a, b) => a + b, 0);
        let severity = "None";
        if (score >= 5) severity = "Mild";
        if (score >= 10) severity = "Moderate";
        if (score >= 15) severity = "Moderately Severe";
        if (score >= 20) severity = "Severe";

        try {
            // Save result to Firestore
            const userRef = doc(db, "users", user.uid);
            const assessmentData = {
                date: new Date().toISOString(),
                score,
                severity,
                type: "PHQ-9",
                answers
            };

            await updateDoc(userRef, {
                assessments: arrayUnion(assessmentData),
                lastAssessmentDate: serverTimestamp(),
                currentSeverity: severity,
                emergencyContactName: contactName,
                emergencyContactNumber: contactNumber
            });

            toast.success("Assessment complete. Updating your dashboard...");
            router.push("/dashboard");
        } catch (error) {
            console.error(error);
            toast.error("Failed to save results. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const progress = ((currentStep + 1) / (questions.length + 1)) * 100;

    return (
        <Card className="w-full max-w-lg mx-auto shadow-lg border-0">
            <CardHeader>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-muted-foreground mr-4">
                        {isContactStep ? "Final Step" : `Question ${currentStep + 1} of ${questions.length}`}
                    </span>
                    <span className="text-sm font-medium text-blue-600">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />

                {isContactStep ? (
                    <>
                        <CardTitle className="mt-6 text-xl">Emergency Contact</CardTitle>
                        <CardDescription>
                            Please provide a trusted contact (Guardian, Therapist, or Best Friend) for emergency situations.
                        </CardDescription>
                    </>
                ) : (
                    <>
                        <CardTitle className="mt-6 text-xl">{questions[currentStep].text}</CardTitle>
                        <CardDescription>Over the last 2 weeks, how often have you been bothered by this?</CardDescription>
                    </>
                )}
            </CardHeader>
            <CardContent>
                {isContactStep ? (
                    <div className="space-y-4 pt-2">
                        <div className="space-y-2">
                            <Label>Contact Name</Label>
                            <input
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="e.g. Mom, Dr. Smith"
                                value={contactName}
                                onChange={(e) => setContactName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Phone Number</Label>
                            <input
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="+1234567890"
                                value={contactNumber}
                                onChange={(e) => setContactNumber(e.target.value)}
                            />
                        </div>
                    </div>
                ) : (
                    <RadioGroup onValueChange={handleAnswer} className="space-y-3" value={answers[questions[currentStep].id]?.toString()}>
                        {options.map((opt) => (
                            <div key={opt.value} className={`flex items-center space-x-2 border rounded-lg p-3 cursor-pointer transition-colors ${answers[questions[currentStep].id] === parseInt(opt.value) ? 'border-blue-600 bg-blue-50' : 'hover:bg-gray-50'}`}>
                                <RadioGroupItem value={opt.value} id={`opt-${opt.value}`} />
                                <Label htmlFor={`opt-${opt.value}`} className="flex-1 cursor-pointer">{opt.label}</Label>
                            </div>
                        ))}
                    </RadioGroup>
                )}
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button
                    variant="ghost"
                    disabled={currentStep === 0}
                    onClick={() => setCurrentStep(prev => prev - 1)}
                >
                    Back
                </Button>
                <Button
                    onClick={handleNext}
                    disabled={(!isContactStep && !(questions[currentStep].id in answers)) || isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700"
                >
                    {isSubmitting ? "Saving..." : isContactStep ? "Finish" : "Next"}
                </Button>
            </CardFooter>
        </Card>
    );
}
