import { useState, useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, X, Send, Mic, Bot, User } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ChatMessage, ChatIntent } from "@/lib/types";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Initialize with enhanced multilingual welcome message
  useEffect(() => {
    setMessages([
      {
        id: "welcome",
        message: "Hello! I'm your multilingual Crisis Assistant. I can understand locations in multiple Indian languages and scripts. Try these examples:\n\n• \"What's the food situation in तमिलनाडु?\"\n• \"Show shelter in दिल्ली\"\n• \"Resources available in কলকাতা?\"\n• \"Food shortage in TN and MH areas\"\n• \"Emergency in বাংলাদেশ region\"",
        isUser: false,
        createdAt: new Date().toISOString(),
      }
    ]);
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/chat", {
        message,
        sessionId,
      });
      return response.json();
    },
    onSuccess: (data) => {
      const aiMessage: ChatMessage = {
        id: `ai_${Date.now()}`,
        message: data.response,
        isUser: false,
        createdAt: new Date().toISOString(),
      };
      setMessages(prev => [...prev, aiMessage]);

      // Handle intent-based actions
      if (data.intent?.type === 'map_action' && data.intent.entities.length > 0) {
        // Could trigger map navigation to specific location
        toast({
          title: "Map Action",
          description: `Focusing map on ${data.intent.entities.join(', ')}`,
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Chat Error",
        description: error.message || "Failed to send message",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if (!inputMessage.trim() || chatMutation.isPending) return;

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      message: inputMessage,
      isUser: true,
      createdAt: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    chatMutation.mutate(inputMessage);
    setInputMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`rounded-full w-14 h-14 shadow-lg transition-all duration-300 ${isOpen ? 'bg-gray-500' : 'bg-primary hover:bg-blue-700'}`}
      >
        {isOpen ? <X className="text-xl" /> : <MessageCircle className="text-xl" />}
      </Button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 h-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-primary text-white rounded-t-lg">
            <div className="flex items-center space-x-2">
              <Bot className="w-5 h-5" />
              <h3 className="font-semibold">Crisis Assistant</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 hover:bg-blue-600"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-2 ${message.isUser ? 'justify-end' : ''}`}
              >
                {!message.isUser && (
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm flex-shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`rounded-lg p-3 max-w-60 ${
                    message.isUser
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                </div>
                {message.isUser && (
                  <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
            {chatMutation.isPending && (
              <div className="flex items-start space-x-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-gray-100 rounded-lg p-3 max-w-60">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <Input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 text-sm"
                placeholder="Ask about locations or resources..."
                disabled={chatMutation.isPending}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || chatMutation.isPending}
                size="sm"
                className="bg-primary hover:bg-blue-700"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between mt-2">
              <Button variant="ghost" size="sm" className="text-xs text-gray-500 hover:text-gray-700 p-1">
                <Mic className="w-3 h-3 mr-1" />
                Voice input
              </Button>
              <span className="text-xs text-gray-400">Powered by Cohere AI</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}//COHERE_API_KEY=your_actual_cohere_api_key
