
import { google } from '@ai-sdk/google';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, limit, orderBy, addDoc, where, doc, getDoc } from 'firebase/firestore';

export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages, severity, userId } = await req.json();

    const systemPrompt = `You are VitaKita's AI Wellness Companion.
  Your goal is to support the student's mental well-being using their personal data to guide them.
  
  User Context:
  - Severity: ${severity || "Unknown"}
  - User ID: ${userId || "Anonymous"}
  
  Tone: Empathetic, supportive, professional but friendly.
  
  Capabilities (MCP Tools):
  1. **getJournalEntries**: READ user's private journal to understand their recent thoughts/feelings. USE THIS whenever they reference "last time" or "my diary".
  2. **getMedications**: CHECK if they took their meds today or see what they are prescribed.
  3. **bookAppointment**: SCHEDULE a session with a therapist if they are stressed or ask for it.
  4. **suggestResources**: General wellness tips.
  
  Safety:
  If the user says they are in immediate danger or mentions suicide/self-harm, you MUST respond with the emergency contact info and suggest they call SOS immediately.
  `;

    const result = await streamText({
        model: google('gemini-1.5-flash'),
        system: systemPrompt,
        messages,
        tools: {
            getJournalEntries: tool({
                description: 'Fetch the users recent journal entries',
                parameters: z.object({}),
                execute: async () => {
                    if (!userId) return "User not logged in.";
                    try {
                        const q = query(collection(db, "users", userId, "journal"), orderBy("createdAt", "desc"), limit(3));
                        const snapshot = await getDocs(q);
                        if (snapshot.empty) return "No journal entries found.";
                        return snapshot.docs.map(d => `[${d.data().createdAt?.toDate()?.toLocaleDateString()}] ${d.data().title}: ${d.data().content}`).join("\n\n");
                    } catch (e) {
                        return "Failed to fetch journal entries.";
                    }
                },
            }),
            getMedications: tool({
                description: 'Check users medication list and status for today',
                parameters: z.object({}),
                execute: async () => {
                    if (!userId) return "User not logged in.";
                    try {
                        // 1. Get Meds
                        const medsSnap = await getDocs(collection(db, "users", userId, "medications"));
                        if (medsSnap.empty) return "No medications prescribed.";
                        const meds = medsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

                        // 2. Get Today's Log
                        const todayStr = new Date().toISOString().split('T')[0];
                        const logSnap = await getDoc(doc(db, "users", userId, "medication_logs", todayStr));
                        const takenIds = logSnap.exists() ? logSnap.data().takenIds || [] : [];

                        return meds.map((m: any) =>
                            `- ${m.name} (${m.dosage}): ${takenIds.includes(m.id) ? "TAKEN ✅" : "NOT TAKEN ❌"}`
                        ).join("\n");
                    } catch (e) {
                        return "Failed to fetch medication status.";
                    }
                }
            }),
            bookAppointment: tool({
                description: 'Book a counseling appointment for the user',
                parameters: z.object({
                    reason: z.string().describe('The reason for the appointment'),
                    date: z.string().describe('Preferred date (e.g., "tomorrow at 2pm")'),
                }),
                execute: async ({ reason, date }) => {
                    if (!userId) return "User not logged in.";
                    try {
                        await addDoc(collection(db, "users", userId, "appointments"), {
                            reason,
                            date,
                            status: "pending",
                            createdAt: new Date().toISOString()
                        });
                        return `Appointment request for "${reason}" on ${date} has been saved. A counselor will confirm shortly.`;
                    } catch (e) {
                        return "Failed to book appointment.";
                    }
                },
            }),
            suggestResources: tool({
                description: 'Get wellness resources based on a topic',
                parameters: z.object({
                    topic: z.string().describe('Topic like anxiety, sleep, stress'),
                }),
                execute: async ({ topic }) => {
                    return `Here are some resources for ${topic}: [Article 1], [Video 2]`;
                },
            }),
            getAvailableSlots: tool({
                description: 'Check available appointment slots for counseling',
                parameters: z.object({}),
                execute: async () => {
                    // In a real app, query a "doctors" collection or Calendar API
                    return "Available slots: \n- Tomorrow 10:00 AM\n- Tomorrow 2:00 PM\n- Friday 4:30 PM";
                }
            })
        },
    });

    return result.toTextStreamResponse();
}
