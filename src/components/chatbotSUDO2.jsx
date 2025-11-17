// import { useState, useRef, useEffect } from "react";
// import { GoogleGenerativeAI, Content } from "@google/generative-ai"; 
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent } from "@/components/ui/card";
// import { Send, Bot, User, AlertTriangle, Heart, Loader2 } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";

// interface Message {
//   id: string;
//   text: string;
//   sender: 'user' | 'ai';
//   timestamp: Date;
//   isEmergency?: boolean;
// }

// const GEMINI_API_KEY = "AIzaSyCV37Y5HDXwn9ZLHFEmGobXz52-Ry_GqDA"; 

// // --- Gemini Setup with System Instruction (Logic) ---
// const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
// const AI_INSTRUCTION = "You are a close friend to the user. Talk exactly like a close friend, be casual, supportive, and informal.";

// const model = genAI.getGenerativeModel({ 
//   model: "gemini-2.5-flash",
//   systemInstruction: AI_INSTRUCTION, 
// });

// const fetchAIResponse = async (history: Content[]): Promise<Message> => {
//   try {
//     const result = await model.generateContent({
//       contents: history,
//     });

//     const aiText = result.response.text() || "Sorry, I couldn't understand that.";

//     return {
//       id: Date.now().toString(),
//       text: aiText,
//       sender: "ai",
//       timestamp: new Date(),
//       isEmergency: false,
//     };
//   } catch (error: any) {
//     console.error("Gemini API error:", error);
//     return {
//       id: Date.now().toString(),
//       text: "Sorry, there was a problem connecting to the AI service.",
//       sender: "ai",
//       timestamp: new Date(),
//     };
//   }
// };

// const ChatPage = () => {
//   const [messages, setMessages] = useState<Message[]>([
//     {
//       id: '1',
//       text: "Hello! I'm your VITAKITA AI companion. I'm here to provide supportive guidance and coping strategies. How are you feeling today?",
//       sender: 'ai',
//       timestamp: new Date(),
//       isEmergency: false,
//     }
//   ]);
//   const [inputMessage, setInputMessage] = useState<string>("");
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const { toast } = useToast();

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const handleSendMessage = async () => {
//     if (!inputMessage.trim()) return;

//     const userMessage: Message = {
//       id: Date.now().toString(),
//       text: inputMessage,
//       sender: 'user',
//       timestamp: new Date(),
//     };

//     setMessages(prev => [...prev, userMessage]);
//     setInputMessage("");
//     setIsLoading(true);

//     // Build history for the API call
//     const conversationHistory: Content[] = messages.map(msg => ({
//       role: msg.sender === 'user' ? 'user' : 'model',
//       parts: [{ text: msg.text }]
//     }));

//     const newHistory: Content[] = [
//       ...conversationHistory,
//       { role: 'user' as const, parts: [{ text: inputMessage }] }
//     ];

//     const aiResponse = await fetchAIResponse(newHistory);

//     setMessages(prev => [...prev, aiResponse]);
//     setIsLoading(false);

//     if (aiResponse.isEmergency) {
//       toast({
//         title: "Crisis Support Available",
//         description: "Professional help is available 24/7. You are not alone.",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   return (
//     <div className="min-h-screen pb-24 pt-6">
//       <div className="container mx-auto px-4 h-screen flex flex-col">
//         {/* Header */}
//         <Card className="mb-6 shadow-gentle border-0 gradient-support">
//           <CardContent className="p-6 text-center">
//             <div className="flex items-center justify-center gap-3 mb-3">
//               <div className="p-2 rounded-full bg-primary/10">
//                 <Heart size={24} className="text-primary" />
//               </div>
//               <h1 className="text-2xl font-bold">AI Support Chat</h1>
//             </div>
//             <p className="text-muted-foreground">
//               Confidential, empathetic support available 24/7. Remember, this is a supportive tool - if you're in crisis, please contact emergency services or your counseling center.
//             </p>
//           </CardContent>
//         </Card>

//         {/* Messages */}
//         <div className="flex-1 overflow-y-auto mb-4 space-y-4">
//           {messages.map((message) => (
//             <div
//               key={message.id}
//               className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
//             >
//               <div className={`flex items-start gap-3 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
//                 <div className={`p-2 rounded-full ${
//                   message.sender === 'user' 
//                     ? 'bg-primary text-primary-foreground' 
//                     : message.isEmergency 
//                       ? 'bg-destructive text-destructive-foreground'
//                       : 'bg-secondary text-secondary-foreground'
//                 }`}>
//                   {message.sender === 'user' ? <User size={16} /> : 
//                    message.isEmergency ? <AlertTriangle size={16} /> : <Bot size={16} />}
//                 </div>
//                 <Card className="shadow-gentle transition-gentle">
//                   <CardContent className={`p-4 ${
//                     message.sender === 'user' 
//                       ? 'bg-primary text-primary-foreground border-primary/20' 
//                       : message.isEmergency
//                         ? 'bg-destructive/10 border-destructive/20'
//                         : 'bg-card border-border/20'
//                   }`}>
//                     <p className="text-sm whitespace-pre-wrap">{message.text}</p>
//                     <p className={`text-xs mt-2 opacity-70 ${
//                       message.sender === 'user' ? 'text-primary-foreground' : 'text-muted-foreground'
//                     }`}>
//                       {message.timestamp.toLocaleTimeString()}
//                     </p>
//                   </CardContent>
//                 </Card>
//               </div>
//             </div>
//           ))}
//           
//           {isLoading && (
//             <div className="flex justify-start">
//               <div className="flex items-start gap-3 max-w-[80%]">
//                 <div className="p-2 rounded-full bg-secondary text-secondary-foreground">
//                   <Loader2 size={16} className="animate-spin" />
//                 </div>
//                 <Card className="bg-card border-border/20 shadow-gentle">
//                   <CardContent className="p-4">
//                     <div className="flex space-x-1">
//                       <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
//                       <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
//                       <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>
//             </div>
//           )}
//           <div ref={messagesEndRef} />
//         </div>

//         {/* Input */}
//         <Card className="shadow-gentle border-0 glass-effect">
//           <CardContent className="p-4">
//             <div className="flex gap-3">
//               <Input
//                 value={inputMessage}
//                 onChange={(e) => setInputMessage(e.target.value)}
//                 onKeyPress={handleKeyPress}
//                 placeholder="Share what's on your mind..."
//                 className="flex-1 border-0 bg-transparent focus:ring-2 focus:ring-primary/20"
//                 disabled={isLoading}
//               />
//               <Button 
//                 onClick={handleSendMessage}
//                 disabled={!inputMessage.trim() || isLoading}
//                 size="icon"
//                 className="shadow-gentle transition-therapeutic"
//               >
//                 <Send size={16} />
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default ChatPage;