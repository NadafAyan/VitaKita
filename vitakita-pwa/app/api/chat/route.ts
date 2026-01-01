
import { google } from '@ai-sdk/google';
import { streamText, tool } from 'ai';
import { z } from 'zod';

export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages, severity } = await req.json();

    const systemPrompt = `You are VitaKita's AI Wellness Companion.
  Your goal is to support the student's mental well-being.
  The user's current diagnostic severity is: ${severity || "Unknown"}.
  
  Tone: Empathetic, supportive, professional but friendly.
  
  Capabilities (MCP Tools):
  - You can access "journal_entries" to remember what the user wrote.
  - You can "book_appointment" if the user is in distress or asks for help.
  - You can suggest "breathing_exercises".
  
  If the user says they are in immediate danger or mentions suicide/self-harm, you MUST respond with the emergency contact info and suggest they call SOS immediately.
  `;

    const result = await streamText({
        model: google('gemini-1.5-flash'),
        system: systemPrompt,
        messages,
        tools: {
            bookAppointment: tool({
                description: 'Book a counseling appointment for the user',
                parameters: z.object({
                    reason: z.string().describe('The reason for the appointment'),
                    date: z.string().describe('Preferred date (optional)'),
                }),
                execute: async ({ reason, date }) => {
                    // In a real app, this would save to Firestore 'appointments' collection
                    return `Appointment request for "${reason}" has been noted. A counselor will confirm shortly.`;
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
        },
    });

    return result.toDataStreamResponse();
}
