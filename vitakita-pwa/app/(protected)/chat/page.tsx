"use client";

import { useState } from "react";
import { useChat } from '@ai-sdk/react';
import { useAuth } from '@/components/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Bot, User as UserIcon, Loader2, Sparkles } from 'lucide-react';

export default function ChatPage() {
    const { userData } = useAuth();
    const [inputValue, setInputValue] = useState("");

    // Cast to any to bypass TS errors about missing properties
    const chatHelpers = useChat({
        onError: (e: Error) => {
            console.error("Chat error:", e);
            alert(`Error: ${e.message}`);
        }
    }) as any;

    const { messages, append, isLoading } = chatHelpers;

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const currentInput = inputValue;
        setInputValue(""); // Clear immediately

        if (append && typeof append === 'function') {
            await append({
                role: 'user',
                content: currentInput
            }, {
                body: {
                    severity: userData?.currentSeverity,
                    userId: userData?.uid || useAuth().user?.uid
                }
            });
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] bg-white rounded-lg shadow border">
            <div className="p-4 border-b flex items-center justify-between bg-blue-50/50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white shadow-sm">
                        <Sparkles size={20} />
                    </div>
                    <div>
                        <h1 className="font-bold text-gray-900">Vita - Your AI Companion</h1>
                        <p className="text-xs text-blue-600 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            Online & Ready to Help
                            <span className="ml-2 text-gray-400">({messages?.length || 0} msgs)</span>
                        </p>
                    </div>
                </div>
            </div>

            <ScrollArea className="flex-1 p-4">
                {(!messages || messages.length === 0) && (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-50 mt-20">
                        <Bot size={48} className="mb-4 text-blue-300" />
                        <p className="text-lg font-medium">How can I support you today?</p>
                        <p className="text-sm">I can help with stress, resources, or just chat.</p>
                    </div>
                )}

                <div className="space-y-4">
                    {messages && messages.map((m: any) => (
                        <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {m.role !== 'user' && (
                                <Avatar className="w-8 h-8 border">
                                    <AvatarFallback className="bg-blue-100 text-blue-600">AI</AvatarFallback>
                                </Avatar>
                            )}
                            <div
                                className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ${m.role === 'user'
                                    ? 'bg-blue-600 text-white rounded-br-none'
                                    : 'bg-gray-100 text-gray-800 rounded-bl-none'
                                    }`}
                            >
                                {m.content}
                                {m.toolInvocations?.map((toolInvocation: any) => {
                                    const toolCallId = toolInvocation.toolCallId;
                                    // Render tool results if any
                                    if ('result' in toolInvocation) {
                                        return (
                                            <div key={toolCallId} className="mt-2 text-xs bg-white/50 p-2 rounded border border-black/5 italic">
                                                ✅ Action: {toolInvocation.result}
                                            </div>
                                        )
                                    }
                                    return (
                                        <div key={toolCallId} className="mt-2 text-xs bg-white/50 p-2 rounded border border-black/5 italic animate-pulse">
                                            ⚙️ Processing request...
                                        </div>
                                    )
                                })}
                            </div>
                            {m.role === 'user' && (
                                <Avatar className="w-8 h-8 border">
                                    <AvatarFallback className="bg-gray-100 text-gray-600">Me</AvatarFallback>
                                </Avatar>
                            )}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start gap-3">
                            <Avatar className="w-8 h-8 border">
                                <AvatarFallback className="bg-blue-100 text-blue-600">AI</AvatarFallback>
                            </Avatar>
                            <div className="bg-gray-100 rounded-2xl rounded-bl-none px-4 py-2 flex items-center">
                                <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>

            <form onSubmit={onSubmit} className="p-4 border-t bg-gray-50/50 flex gap-2">
                <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your message..."
                    className="bg-white"
                    disabled={isLoading}
                />
                <Button type="submit" disabled={isLoading || !inputValue.trim()} className="bg-blue-600 hover:bg-blue-700">
                    <Send size={18} />
                </Button>
            </form>
        </div>
    );
}
