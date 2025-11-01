import { useState, useRef, useEffect } from "react";
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

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

type Msg = { role: "user" | "assistant"; content: string };

async function streamChat({
  messages,
  onDelta,
  onDone,
  onError,
}: {
  messages: Msg[];
  onDelta: (deltaText: string) => void;
  onDone: () => void;
  onError: (error: string) => void;
}) {
  try {
    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ messages }),
    });

    if (!resp.ok) {
      const errorData = await resp.json().catch(() => ({ error: "Unknown error" }));
      onError(errorData.error || `Server error: ${resp.status}`);
      return;
    }

    if (!resp.body) {
      onError("No response body");
      return;
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = "";
    let streamDone = false;

    while (!streamDone) {
      const { done, value } = await reader.read();
      if (done) break;
      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);

        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") {
          streamDone = true;
          break;
        }

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) onDelta(content);
        } catch {
          textBuffer = line + "\n" + textBuffer;
          break;
        }
      }
    }

    if (textBuffer.trim()) {
      for (let raw of textBuffer.split("\n")) {
        if (!raw) continue;
        if (raw.endsWith("\r")) raw = raw.slice(0, -1);
        if (raw.startsWith(":") || raw.trim() === "") continue;
        if (!raw.startsWith("data: ")) continue;
        const jsonStr = raw.slice(6).trim();
        if (jsonStr === "[DONE]") continue;
        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) onDelta(content);
        } catch {}
      }
    }

    onDone();
  } catch (error) {
    console.error("Stream error:", error);
    onError(error instanceof Error ? error.message : "Connection error");
  }
}

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your VITAKITA AI companion. I'm here to provide supportive guidance and coping strategies. How are you feeling today?",
      sender: 'ai',
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    const conversationHistory: Msg[] = messages.map(m => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text
    }));

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    let assistantText = "";
    const assistantId = Date.now().toString();
    
    const updateAssistantMessage = (text: string) => {
      assistantText = text;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.id === assistantId) {
          return prev.map(m => m.id === assistantId ? { ...m, text: assistantText } : m);
        }
        return [...prev, {
          id: assistantId,
          text: assistantText,
          sender: 'ai' as const,
          timestamp: new Date(),
          isEmergency: false
        }];
      });
    };

    try {
      await streamChat({
        messages: [...conversationHistory, { role: 'user', content: inputMessage }],
        onDelta: (chunk) => updateAssistantMessage(assistantText + chunk),
        onDone: () => {
          setIsLoading(false);
          
          // Check for crisis keywords
          const crisisKeywords = ['suicide', 'kill myself', 'end my life', 'self-harm', 'hurt myself', 'emergency', '911', '988'];
          const hasCrisis = crisisKeywords.some(keyword => 
            assistantText.toLowerCase().includes(keyword)
          );
          
          if (hasCrisis) {
            setMessages(prev => prev.map(m => 
              m.id === assistantId ? { ...m, isEmergency: true } : m
            ));
            toast({
              title: "Crisis Support Available",
              description: "Professional help is available 24/7. You are not alone.",
              variant: "destructive",
            });
          }
        },
        onError: (error) => {
          setIsLoading(false);
          toast({
            title: "Connection Error",
            description: error,
            variant: "destructive",
          });
        }
      });
    } catch (error) {
      setIsLoading(false);
      console.error("Chat error:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

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
              Confidential, empathetic support available 24/7. Remember, this is a supportive tool - if you're in crisis, please contact emergency services or your counseling center.
            </p>
          </CardContent>
        </Card>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start gap-3 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`p-2 rounded-full ${
                  message.sender === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : message.isEmergency 
                      ? 'bg-destructive text-destructive-foreground'
                      : 'bg-secondary text-secondary-foreground'
                }`}>
                  {message.sender === 'user' ? <User size={16} /> : 
                   message.isEmergency ? <AlertTriangle size={16} /> : <Bot size={16} />}
                </div>
                <Card className={`shadow-gentle transition-gentle ${
                  message.sender === 'user' 
                    ? 'bg-primary text-primary-foreground border-primary/20' 
                    : message.isEmergency
                      ? 'bg-destructive/10 border-destructive/20'
                      : 'bg-card border-border/20'
                }`}>
                  <CardContent className="p-4">
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                    <p className={`text-xs mt-2 opacity-70 ${
                      message.sender === 'user' ? 'text-primary-foreground' : 'text-muted-foreground'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
          
          {isLoading && messages.length > 0 && messages[messages.length - 1].sender === 'user' && (
            <div className="flex justify-start">
              <div className="flex items-start gap-3 max-w-[80%]">
                <div className="p-2 rounded-full bg-secondary text-secondary-foreground animate-pulse">
                  <Loader2 size={16} className="animate-spin" />
                </div>
                <Card className="bg-card border-border/20 shadow-gentle">
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">Thinking...</p>
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
                className="shadow-gentle transition-therapeutic"
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