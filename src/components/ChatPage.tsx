import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Send, Bot, User, AlertTriangle, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isEmergency?: boolean;
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

  // Mock AI response function (would integrate with Gemini API via Supabase)
  const generateAIResponse = (userMessage: string): Message => {
    const lowercaseMessage = userMessage.toLowerCase();
    
    // Crisis detection keywords
    const crisisKeywords = ['kill', 'suicide', 'die', 'hurt myself', 'end it', 'cant go on'];
    const isEmergency = crisisKeywords.some(keyword => lowercaseMessage.includes(keyword));

    if (isEmergency) {
      return {
        id: Date.now().toString(),
        text: "I'm concerned about what you've shared. Your life has value, and there are people who want to help. Please reach out immediately:\n\n• National Suicide Prevention Lifeline: 988\n• Crisis Text Line: Text HOME to 741741\n• Emergency: 911\n\nYou don't have to face this alone. Professional counselors at your school are also available to provide support.",
        sender: 'ai',
        timestamp: new Date(),
        isEmergency: true,
      };
    }

    // Supportive responses based on common themes
    const supportiveResponses = [
      "It sounds like you're going through a challenging time. That takes courage to share. What specific aspects of this situation feel most overwhelming right now?",
      "I hear that you're struggling, and I want you to know that your feelings are valid. Have you tried any coping strategies recently that have helped, even a little?",
      "Thank you for trusting me with this. It's completely normal to feel this way during your studies. Let's explore some gentle techniques that might help you feel more grounded.",
      "I can sense the weight you're carrying. Remember that seeking support is a sign of strength. What would feel like a small, manageable first step for you right now?",
    ];

    return {
      id: Date.now().toString(),
      text: supportiveResponses[Math.floor(Math.random() * supportiveResponses.length)],
      sender: 'ai',
      timestamp: new Date(),
    };
  };

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

    // Simulate API delay
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage);
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);

      if (aiResponse.isEmergency) {
        toast({
          title: "Crisis Support Available",
          description: "Professional help is available 24/7. You are not alone.",
          variant: "destructive",
        });
      }
    }, 1000);
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
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start gap-3 max-w-[80%]">
                <div className="p-2 rounded-full bg-secondary text-secondary-foreground">
                  <Bot size={16} />
                </div>
                <Card className="bg-card border-border/20 shadow-gentle">
                  <CardContent className="p-4">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
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