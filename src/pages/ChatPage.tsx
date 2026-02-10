import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Send, Bot, User, AlertTriangle, Heart, Loader2 } from "lucide-react";

/* =========================
   Backend API Call
========================= */
async function sendToBackend(message) {
  const response = await fetch("http://127.0.0.1:8000/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    throw new Error("Backend error");
  }

  return await response.json();
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
      },
    ]);

    setInputMessage("");
    setIsLoading(true);

    try {
      const data = await sendToBackend(userText);

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: data.reply,
          timestamp: new Date(),
          isEmergency: data.label === "Crisis",
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: "⚠️ Unable to connect to the server. Please try again.",
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
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex items-start gap-3 max-w-[80%] ${
                  message.sender === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`p-2 rounded-full ${
                    message.sender === "user"
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
                  className={`shadow-gentle transition-gentle ${
                    message.sender === "user"
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
