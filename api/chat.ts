import { VercelRequest, VercelResponse } from '@vercel/node';

const HF_TOKEN = process.env.VITE_HF_TOKEN || process.env.HF_TOKEN;
const CLASSIFICATION_MODEL = "YashKumar11/vitagita-model";
const CHAT_MODEL = "moonshotai/Kimi-K2-Instruct-0905";

const id2label: Record<number, string> = {
    0: "Crisis",
    1: "Depression",
    2: "Neutral",
    3: "Normal",
    4: "Stress"
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { type, message, history, label } = req.body;

    try {
        if (type === 'classify') {
            const response = await fetch(
                `https://api-inference.huggingface.co/models/${CLASSIFICATION_MODEL}`,
                {
                    headers: { Authorization: `Bearer ${HF_TOKEN}` },
                    method: "POST",
                    body: JSON.stringify({ inputs: message }),
                }
            );
            const result = await response.json();

            if (Array.isArray(result) && result[0]) {
                const scores = Array.isArray(result[0]) ? result[0] : result;
                const topClass = scores.reduce((prev: any, current: any) => (prev.score > current.score) ? prev : current);
                const labelIdx = parseInt(topClass.label.replace("LABEL_", ""));
                return res.status(200).json({ label: id2label[labelIdx] || "Neutral", score: topClass.score });
            }
            return res.status(200).json({ label: "Neutral", score: 0.0 });
        }

        if (type === 'chat') {
            const systemPrompt = `You are a calm, empathetic mental-health support assistant.
Rules:
- Do NOT give medical advice
- Do NOT suggest medication
- Do NOT panic unless user shows real suicidal intent
- Be supportive and short
- Ask gentle follow-up questions
User mental state: ${label}`;

            const messages = [
                { role: "system", content: systemPrompt },
                ...history,
                { role: "user", content: message }
            ];

            const response = await fetch("https://router.huggingface.co/v1/chat/completions", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${HF_TOKEN}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: CHAT_MODEL,
                    messages: messages,
                    temperature: 0.6,
                    max_tokens: 200,
                }),
            });

            const data = await response.json();
            return res.status(200).json({ reply: data.choices?.[0]?.message?.content || "I'm here for you." });
        }

        return res.status(400).json({ error: 'Invalid request type' });

    } catch (error: any) {
        console.error("Serverless Error:", error);
        return res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
}
