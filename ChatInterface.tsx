"use client";

import { useEffect, useRef, useState } from "react";
import {  useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Loader2, Stethoscope, Sparkles } from "lucide-react"; // Added Sparkles
import ReactMarkdown from 'react-markdown'; // Import ReactMarkdown

interface Message {
    role: "user" | "assistant";
    content: string;
}

export default function ChatInterface() {
    const { user } = useUser();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput("");
        setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
        setIsLoading(true);

        // Enrich the prompt
        const enrichedPrompt = `
You are MediMate, a helpful AI assistant specializing in providing general health information and guidance.
You are empathetic, knowledgeable, and prioritize safety.
Always remind the user that you are not a substitute for professional medical advice and encourage them to consult a healthcare provider for diagnosis or treatment.
Format your responses clearly using markdown. Use headings, lists, and bold text where appropriate to improve readability.
Do not provide specific diagnoses or treatment plans. Focus on general information, potential causes, symptom management tips (non-pharmacological), and when to seek professional help.

User's query: ${userMessage}
        `.trim();

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: enrichedPrompt }), // Send enriched prompt
            });

            const data = await response.json();
            if (response.ok) {
                setMessages((prev) => [
                    ...prev,
                    { role: "assistant", content: data.response },
                ]);
            } else {
                throw new Error(data.error || "Failed to get response");
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // TODO: Replace with your desired medical background image URL
  const backgroundImageUrl = "url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"; // Example URL

  return (
    <div
      className="flex flex-col h-screen min-h-screen overflow-hidden bg-cover bg-center bg-fixed"
      style={{ backgroundImage: backgroundImageUrl }}
    >
      {/* Overlay to darken the background image */}
      <div className="absolute inset-0 bg-black/60 z-0"></div>

      {/* Chat container - adjusted for full height and mobile scroll, ensure content is above overlay */}
      <div className="flex-1 overflow-hidden pt-16 px-4 pb-2 flex flex-col z-10 relative">
        <Card className="relative flex-1 bg-blue-950/50 backdrop-blur-xl border-blue-500/30 overflow-hidden shadow-2xl shadow-blue-900/30">
          <ScrollArea className="h-full w-full pr-4 pb-4">
            <div className="space-y-4 p-4"> {/* Increased padding */}
              {/* Medical Disclaimer Banner - Always visible */}
              <div className="bg-yellow-600/30 border border-yellow-500/40 rounded-lg p-3 mb-4 text-center shadow-md">
                <p className="text-yellow-100 text-sm font-medium">
                  Note: MediMate provides general health information only.
                  Always consult a healthcare professional for diagnosis or treatment.
                </p>
              </div>

              {/* Empty State UI - Shown only when no messages and not loading */}
              {!isLoading && messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-[calc(100%-100px)] text-center text-blue-200/80 p-6">
                   <Stethoscope className="h-16 w-16 text-blue-400 mb-4 animate-pulse" />
                   <h2 className="text-2xl font-semibold text-blue-100 mb-2">Welcome to MediMate</h2>
                   <p className="mb-6 max-w-md">
                     Your AI health assistant. How can I help you today?
                     Describe your symptoms or ask a general health question.
                   </p>
                   <div className="space-y-2 text-sm">
                     <p className="font-medium text-blue-200">You can ask things like:</p>
                     <ul className="list-none space-y-1 text-blue-300/90">
                        <li>"What are common causes of headaches?"</li>
                        <li>"Tell me about managing stress."</li>
                        <li>"Explain the benefits of a balanced diet."</li>
                     </ul>
                   </div>
                </div>
              )}

              {/* Messages List - Shown when messages exist */}
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 ${
                    message.role === "assistant" ? "flex-row" : "flex-row-reverse"
                  }`}
                >
                  {message.role === "assistant" ? (
                    <Avatar className="border-2 border-blue-500/50">
                      <AvatarFallback className="bg-blue-700">
                        <Stethoscope className="h-5 w-5 text-blue-200" />
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <Avatar className="border-2 border-teal-500/50">
                      <AvatarImage src={user?.imageUrl} />
                      <AvatarFallback className="bg-teal-700 text-white">
                        {user?.firstName?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    // Correctly merged classes
                    className={`rounded-xl px-4 py-3 max-w-[85%] backdrop-blur-md shadow-lg ${ // Increased rounding, padding, max-width, blur, shadow
                      message.role === "assistant"
                        ? "bg-gradient-to-br from-blue-800/70 to-blue-950/80 text-blue-50 shadow-blue-900/30 prose prose-invert prose-sm prose-p:text-blue-100 prose-headings:text-blue-200 prose-strong:text-blue-100 prose-li:marker:text-blue-400" // Enhanced assistant style + prose tuning
                        : "bg-gradient-to-r from-teal-600/90 to-blue-600/90 text-white ml-auto shadow-teal-900/30" // Enhanced user style
                    }`}
                  >
                    {message.role === 'assistant' ? (
                      <ReactMarkdown
                        components={{ // Customize markdown rendering if needed
                          // Example: Add styling to links
                          // a: ({node, ...props}) => <a className="text-teal-300 hover:text-teal-200 underline" {...props} />
                        }}
                      >
                        {message.content}
                      </ReactMarkdown> // Use ReactMarkdown for assistant
                    ) : (
                      message.content // Keep plain text for user
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-center gap-2 text-blue-200">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>MediMate is analyzing...</span>
                </div>
              )}
              {/* Invisible div to help with scrolling */}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </Card>
      </div>

      {/* Input form - fixed at bottom, ensure it's above overlay */}
      <form onSubmit={handleSubmit} className="px-4 pb-4 pt-2 bg-transparent z-10 relative">
        <div className="flex gap-3 items-center"> {/* Increased gap and align items */}
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your health concern or ask a question..." // Updated placeholder
            className="flex-1 bg-blue-950/60 border-2 border-blue-500/40 text-white placeholder:text-blue-300/60 backdrop-blur-lg focus:border-blue-400/70 focus:ring-1 focus:ring-blue-400/70 rounded-full px-5 py-3 text-base shadow-inner" // Enhanced input style: rounded, padding, border, shadow
            disabled={isLoading} // Disable input while loading
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()} // Disable if loading or input is empty
            className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 transition-all duration-300 rounded-full p-3 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed" // Enhanced button style: rounded, padding, shadow, disabled state
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" /> // Slightly larger loader
            ) : (
              <Send className="h-5 w-5" /> // Slightly larger icon
            )}
          </Button>
        </div>
      </form>

      {/* Privacy Notice - ensure it's above overlay */}
      <div className="px-4 pb-3 z-10 relative">
        <p className="text-center text-blue-300/80 text-xs font-light">
          HIPAA Compliant | Your conversations are private and secure. MediMate is for informational purposes only.
        </p>
      </div>
    </div>
  );
}
