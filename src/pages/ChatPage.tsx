import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Send, Bot, User, AlertTriangle, Heart, Loader2 } from "lucide-react";

/* =========================
   Serverless AI API Calls (HuggingFace Proxy)
========================= */
const CRISIS_KEYWORDS = [
  "kill myself", "suicide", "end my life", "hang myself", "overdose", "jump off"
];

async function queryClassification(text: string) {
  try {
    const response = await fetch("/api/classify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inputs: text }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const result = await response.json();
    if (Array.isArray(result) && result[0]) {
      const scores = Array.isArray(result[0]) ? result[0] : result;
      const topClass = scores.reduce((prev: any, current: any) => (prev.score > current.score) ? prev : current);
      // Mapping is now handled in frontend for dev simplicity
      const id2label: Record<number, string> = { 0: "Crisis", 1: "Depression", 2: "Neutral", 3: "Normal", 4: "Stress" };
      const labelIdx = parseInt(topClass.label.replace("LABEL_", ""));
      return { label: id2label[labelIdx] || "Neutral", score: topClass.score };
    }
    return { label: "Neutral", score: 0.0 };
  } catch (error: any) {
    console.error("Classification error:", error);
    throw error;
  }
}

async function queryChat(userText: string, label: string, history: any[]) {
  try {
    const CHAT_MODEL = "moonshotai/Kimi-K2-Instruct-0905";
    const systemPrompt = `You are a calm, empathetic mental-health support assistant.
Rules: - Do NOT give medical advice - Do NOT suggest medication - Do NOT panic unless user shows real suicidal intent - Be supportive and short - Ask gentle follow-up questions
User mental state: ${label}`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...history,
      { role: "user", content: userText }
    ];

    const response = await fetch("/api/chat-hf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: CHAT_MODEL,
        messages: messages,
        temperature: 0.6,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "I'm here for you.";
  } catch (error: any) {
    console.error("Chat error:", error);
    throw error;
  }
}

/* =========================
   Chat Component
========================= */
const ChatPage = () => {
  const [messages, setMessages] = useState([
    {
      id: "1",
      sender: "bot",
      text: "Hello! I’m your VitaGita AI companion. How are you feeling today?",
      timestamp: new Date(),
      isEmergency: false,
    },
  ]);

  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  /* Auto scroll */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* =========================
     Send Message
  ========================= */
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userText = inputMessage;

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: "user",
        text: userText,
        timestamp: new Date(),
        isEmergency: false,
      },
    ]);

    setInputMessage("");
    setIsLoading(true);

    try {
      // -------- Crisis Immediate Override --------
      const lowerText = userText.toLowerCase().trim();
      if (CRISIS_KEYWORDS.some(k => lowerText.includes(k))) {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: "bot",
            text: "🚨 I’m really sorry you’re feeling this way.\n\nPlease reach out immediately:\n📞 India Suicide Helpline: 9152987821\n📞 AASRA: 91-9820466726\n📞 Emergency: 112\n\nYou are not alone. Help is available.",
            timestamp: new Date(),
            isEmergency: true,
          },
        ]);
        return;
      }

      // -------- Get Mental State Classification --------
      const { label } = await queryClassification(userText);

      // -------- Get History --------
      const chatHistory = messages.slice(-10).map(msg => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text
      }));

      // -------- Generate AI Response --------
      const reply = await queryChat(userText, label, chatHistory);

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: reply,
          timestamp: new Date(),
          isEmergency: label === "Crisis",
        },
      ]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: "⚠️ Unable to connect to the AI service. Please try again.",
          timestamp: new Date(),
          isEmergency: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  /* =========================
     UI
  ========================= */
  return (
    <div className="min-h-screen pb-24 pt-6">
      <div className="container mx-auto px-4 h-screen flex flex-col">

        {/* Header */}
        <Card className="mb-6 shadow-gentle border-0 gradient-support">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="p-2 rounded-full bg-primary/10">
                <Heart size={24} className="text-primary" />
              </div>
              <h1 className="text-2xl font-bold">AI Support Chat</h1>
            </div>
            <p className="text-muted-foreground">
              Confidential, empathetic support available 24/7.
              If you're in crisis, please contact emergency services.
            </p>
          </CardContent>
        </Card>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"
                }`}
            >
              <div
                className={`flex items-start gap-3 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : ""
                  }`}
              >
                <div
                  className={`p-2 rounded-full ${message.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : message.isEmergency
                      ? "bg-destructive text-destructive-foreground"
                      : "bg-secondary text-secondary-foreground"
                    }`}
                >
                  {message.sender === "user" ? (
                    <User size={16} />
                  ) : message.isEmergency ? (
                    <AlertTriangle size={16} />
                  ) : (
                    <Bot size={16} />
                  )}
                </div>

                <Card
                  className={`shadow-gentle transition-gentle ${message.sender === "user"
                    ? "bg-primary text-primary-foreground border-primary/20"
                    : message.isEmergency
                      ? "bg-destructive/10 border-destructive/20"
                      : "bg-card border-border/20"
                    }`}
                >
                  <CardContent className="p-4">
                    <p className="text-sm whitespace-pre-wrap">
                      {message.text}
                    </p>
                    <p className="text-xs mt-2 opacity-70">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start gap-3 max-w-[80%]">
                <div className="p-2 rounded-full bg-secondary text-secondary-foreground">
                  <Loader2 size={16} className="animate-spin" />
                </div>
                <Card className="bg-card border-border/20 shadow-gentle">
                  <CardContent className="p-4">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                      <div
                        className="w-2 h-2 bg-primary rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <div
                        className="w-2 h-2 bg-primary rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <Card className="shadow-gentle border-0 glass-effect">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Share what's on your mind..."
                className="flex-1 border-0 bg-transparent focus:ring-2 focus:ring-primary/20"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                size="icon"
              >
                <Send size={16} />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChatPage;
