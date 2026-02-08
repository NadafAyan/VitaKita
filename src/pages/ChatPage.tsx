import { useState, useRef, useEffect } from "react";
import Groq from "groq-sdk";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Send, Bot, User, AlertTriangle, Heart, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isEmergency?: boolean;
}

// --- Groq Setup (Logic) ---
const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true // Required for client-side usage
});

const AI_INSTRUCTION = "You are a close friend to the user. Talk exactly like a close friend, be casual, supportive, and informal.";

const fetchAIResponse = async (history: { role: "user" | "assistant" | "system"; content: string }[]): Promise<Message> => {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: history,
      model: "openai/gpt-oss-120b",
      temperature: 1,
      max_completion_tokens: 8192,
      top_p: 1,
      stream: false,
      reasoning_effort: "medium",
      stop: null,
    });

    const aiText = chatCompletion.choices[0]?.message?.content || "Sorry, I couldn't understand that.";

    return {
      id: Date.now().toString(),
      text: aiText,
      sender: "ai",
      timestamp: new Date(),
      isEmergency: false,
    };
  } catch (error: any) {
    console.error("Groq API error:", error);
    return {
      id: Date.now().toString(),
      text: "Sorry, there was a problem connecting to the AI service.",
      sender: "ai",
      timestamp: new Date(),
    };
  }
};

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm VitaBot. I'm here to provide supportive guidance and coping strategies. How are you feeling today?",
      sender: 'ai',
      timestamp: new Date(),
      isEmergency: false,
    }
  ]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    // Prepare history for Groq (OpenAI format)
    const conversationHistory = messages.slice(-10).map(msg => ({
      role: (msg.sender === 'user' ? 'user' : 'assistant') as "user" | "assistant",
      content: msg.text
    }));

    const newHistory = [
      { role: "system" as const, content: AI_INSTRUCTION },
      ...conversationHistory,
      { role: "user" as const, content: inputMessage }
    ];

    const aiResponse = await fetchAIResponse(newHistory);

    setMessages(prev => [...prev, aiResponse]);
    setIsLoading(false);

    if (aiResponse.isEmergency) {
      toast({
        title: "Crisis Support Available",
        description: "Professional help is available 24/7. You are not alone.",
        variant: "destructive",
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] bg-gradient-to-b from-slate-50 to-white text-slate-900 overflow-hidden">
      <div className="max-w-3xl mx-auto h-full flex flex-col p-4 sm:p-6">
        <Card className="mb-4 shadow-md border-0">
          <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart size={24} className="text-primary" />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-semibold">AI Support Chat</h1>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl">
                  Confidential, empathetic support available 24/7. If you're in crisis, please contact emergency services or your counseling center.
                </p>
              </div>
            </div>
            <div className="ml-auto hidden sm:block">
              <p className="text-xs text-muted-foreground">You and the AI can chat freely — your privacy matters.</p>
            </div>
          </CardContent>
        </Card>

        <main className="flex-1 overflow-hidden flex flex-col rounded-md">
          <div
            className="flex-1 overflow-y-auto px-2 sm:px-4 py-3 space-y-4"
            role="log"
            aria-live="polite"
            aria-relevant="additions"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} px-1`}
              >
                <div className={`flex items-start gap-3 max-w-full ${message.sender === 'user' ? 'sm:ml-auto sm:mr-0' : ''}`}>
                  <div className={`p-2 rounded-full shrink-0 ${message.sender === 'user' ? 'bg-primary text-primary-foreground' : message.isEmergency ? 'bg-destructive text-destructive-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                    {message.sender === 'user' ? <User size={16} /> :
                      message.isEmergency ? <AlertTriangle size={16} /> : <Bot size={16} />}
                  </div>

                  <Card className={`shadow-sm transition-colors ${message.sender === 'user' ? 'bg-primary text-primary-foreground' : message.isEmergency ? 'bg-destructive/10' : 'bg-card'} max-w-[92%] sm:max-w-[70%]`}>
                    <CardContent className={`p-3 sm:p-4 ${message.sender === 'user' ? 'border-primary/10' : 'border-border/10'}`}>
                      <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words">{message.text}</p>
                      <p className="text-xs mt-2 opacity-70 text-muted-foreground">{message.timestamp.toLocaleTimeString()}</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))
            }

            {isLoading && (
              <div className="flex justify-start px-1">
                <div className="flex items-start gap-3 max-w-[92%] sm:max-w-[70%]">
                  <div className="p-2 rounded-full bg-secondary text-secondary-foreground">
                    <Loader2 size={16} className="animate-spin" />
                  </div>
                  <Card className="bg-card border-border/20 shadow-sm">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        <span className="text-xs text-muted-foreground ml-2">Thinking...</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="sticky bottom-0 bg-gradient-to-t from-white/80 via-white/60 to-transparent pt-3">
            <Card className="shadow-lg border-0 rounded-t-md mx-0">
              <CardContent className="p-3 sm:p-4">
                <div className="flex gap-3 items-center">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Share what's on your mind..."
                    className="flex-1 border-0 bg-transparent focus:ring-2 focus:ring-primary/20 text-sm sm:text-base"
                    disabled={isLoading}
                    aria-label="Message input"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    size="icon"
                    className="shadow-gentle transition-therapeutic"
                    aria-label="Send message"
                  >
                    <Send size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ChatPage;