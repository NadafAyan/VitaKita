from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from dotenv import load_dotenv
from openai import OpenAI
import torch
import numpy as np
import os

# =========================================================
# Load Environment Variables
# =========================================================
load_dotenv()

HF_TOKEN = os.getenv("HF_TOKEN")

if not HF_TOKEN:
    raise RuntimeError("HF_TOKEN missing in .env file")

# =========================================================
# HuggingFace Router LLM Client
# =========================================================
llm_client = OpenAI(
    base_url="https://router.huggingface.co/v1",
    api_key=HF_TOKEN,
)

# =========================================================
# FastAPI Setup
# =========================================================
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================================================
# Global Variables
# =========================================================
MODEL_NAME = "YashKumar11/vitagita-model"

tokenizer = None
model = None
chat_history = []

# =========================================================
# Label Mapping
# =========================================================
id2label = {
    0: "Crisis",
    1: "Depression",
    2: "Neutral",
    3: "Normal",
    4: "Stress"
}

# =========================================================
# Load Model Once at Startup
# =========================================================
@app.on_event("startup")
def load_model():
    global tokenizer, model

    print("Loading VitaGita model from HuggingFace Hub...")

    tokenizer = AutoTokenizer.from_pretrained(
        MODEL_NAME,
        token=HF_TOKEN
    )

    model = AutoModelForSequenceClassification.from_pretrained(
        MODEL_NAME,
        token=HF_TOKEN
    )

    model.eval()

    print("Model loaded successfully ✅")

# =========================================================
# Request / Response Schema
# =========================================================
class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    label: str
    confidence: float
    reply: str

# =========================================================
# ML Prediction
# =========================================================
def predict(text: str):
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True)

    with torch.no_grad():
        outputs = model(**inputs)
        probs = torch.softmax(outputs.logits, dim=1).cpu().numpy()[0]

    idx = int(np.argmax(probs))
    return id2label[idx], float(probs[idx])

# =========================================================
# LLM Response with Memory
# =========================================================
def hf_reply(user_text: str, label: str):
    global chat_history

    system_prompt = f"""
You are a calm, empathetic mental-health support assistant.

Rules:
- Do NOT give medical advice
- Do NOT suggest medication
- Do NOT panic unless user shows real suicidal intent
- Be supportive and short
- Ask gentle follow-up questions
User mental state: {label}
"""

    # Add user message to history
    chat_history.append({"role": "user", "content": user_text})

    messages = [{"role": "system", "content": system_prompt}] + chat_history

    response = llm_client.chat.completions.create(
        model="moonshotai/Kimi-K2-Instruct-0905",
        messages=messages,
        temperature=0.6,
        max_tokens=200,
    )

    reply = response.choices[0].message.content or "I'm here for you."

    # Add assistant reply to history
    chat_history.append({"role": "assistant", "content": reply})

    return reply

# =========================================================
# Crisis Detection
# =========================================================
CRISIS_KEYWORDS = [
    "kill myself",
    "suicide",
    "end my life",
    "hang myself",
    "overdose",
    "jump off"
]

# =========================================================
# Chat Endpoint
# =========================================================
@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):

    text = req.message.lower().strip()

    # -------- Crisis Immediate Override --------
    if any(k in text for k in CRISIS_KEYWORDS):
        return ChatResponse(
            label="Crisis",
            confidence=99.0,
            reply=(
                "🚨 I’m really sorry you’re feeling this way.\n\n"
                "Please reach out immediately:\n"
                "📞 India Suicide Helpline: 9152987821\n"
                "📞 AASRA: 91-9820466726\n"
                "📞 Emergency: 112\n\n"
                "You are not alone. Help is available."
            )
        )

    # -------- ML Prediction --------
    label, confidence = predict(req.message)

    # -------- Generate LLM Reply --------
    reply = hf_reply(req.message, label)

    return ChatResponse(
        label=label,
        confidence=round(confidence * 100, 2),
        reply=reply
    )
