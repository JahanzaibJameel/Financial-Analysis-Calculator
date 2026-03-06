'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  Send,
  Bot,
  User,
  AlertCircle,
  Clock,
  Sparkles,
  Zap,
} from 'lucide-react';
import { openaiAPI, OpenAIMessage } from '@/utils/api';
import { useTheme } from '@/components/ThemeProvider';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

export default function AIAssistant() {
  const { resolvedTheme } = useTheme();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: `👋 Hello! I'm your AI financial assistant. I can help you with:

📊 **Investment Analysis**
- Portfolio performance insights
- Risk assessment guidance
- Asset allocation strategies

💡 **Financial Concepts**
- Investment terminology explained
- Market trend analysis
- Economic indicators

🎯 **Personalized Guidance**
- Goal-based planning
- Retirement strategies
- Tax-efficient investing

*Please note: I provide educational information and should not be considered as personalized financial advice. Always consult with qualified professionals for important financial decisions.*

How can I help you today?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rateLimitCooldown, setRateLimitCooldown] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when messages change
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Countdown for rate limit cooldown
  useEffect(() => {
    if (rateLimitCooldown > 0) {
      const timer = setTimeout(() => {
        setRateLimitCooldown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [rateLimitCooldown]);

  // Typing indicator simulation
  useEffect(() => {
    if (isLoading) {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading || rateLimitCooldown > 0) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Convert to OpenAI format
      const openAIMessages: OpenAIMessage[] = messages
        .map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        }));

      openAIMessages.push({
        role: 'user',
        content: userMessage.content,
      });

      const response = await openaiAPI.chat(openAIMessages);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: unknown) {
      console.error('Chat error:', error);
      
      let errorMessage = 'I apologize, but I encountered an error. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('rate_limit')) {
          setRateLimitCooldown(30);
          errorMessage = '⏰ Rate limit reached. Please wait 30 seconds before trying again.';
        } else if (error.message.includes('API key')) {
          errorMessage = '🔑 AI service is not properly configured. Please check the API setup.';
        } else if (error.message.includes('Network')) {
          errorMessage = '🌐 Network connection issue. Please check your internet connection.';
        } else if (error.message.includes('quota')) {
          errorMessage = '💳 API quota exceeded. Please check your billing settings.';
        }
      }

      const error_message: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: errorMessage,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, error_message]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleResize = () => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  };

  useEffect(() => {
    handleResize();
  }, [input]);

  // Quick action suggestions
  const suggestions = [
    'Explain compound interest',
    'How to diversify portfolio?',
    'Risk management strategies',
    'Retirement planning basics',
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card glass h-[600px] flex flex-col"
    >
      <div className="card-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <MessageCircle className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="card-title">AI Financial Assistant</h2>
              <p className="card-description">
                Get expert financial guidance and insights
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {rateLimitCooldown > 0 && (
              <div className="flex items-center space-x-1 text-sm text-orange-500">
                <Clock className="w-4 h-4" />
                <span>{rateLimitCooldown}s</span>
              </div>
            )}
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`} />
              <span className="text-sm text-muted-foreground">
                {isLoading ? 'Thinking...' : 'Online'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="card-content flex-1 flex flex-col min-h-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 mb-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-2 max-w-[80%] ${
                  message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  <div className={`p-2 rounded-lg ${
                    message.role === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {message.role === 'assistant' ? (
                      <Bot className="w-4 h-4" />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                  </div>
                  
                  <div className={`chat-message ${
                    message.role === 'user' 
                      ? 'chat-message-user' 
                      : 'chat-message-assistant'
                  }`}>
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {message.content}
                    </div>
                    <div className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex items-start space-x-2">
                <div className="p-2 rounded-lg bg-muted">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="chat-message chat-message-assistant">
                  <div className="loading-dots">
                    <div className="loading-dot"></div>
                    <div className="loading-dot"></div>
                    <div className="loading-dot"></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="space-y-3">
          {/* Suggestions */}
          {!isLoading && rateLimitCooldown === 0 && messages.length === 1 && (
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setInput(suggestion)}
                  className="btn btn-outline btn-sm text-xs"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  rateLimitCooldown > 0 
                    ? `Wait ${rateLimitCooldown} seconds...`
                    : "Ask about investments, financial concepts, or market analysis..."
                }
                className="input min-h-[44px] max-h-[120px] resize-none pr-10"
                disabled={isLoading || rateLimitCooldown > 0}
                rows={1}
              />
              
              {input.length > 0 && (
                <button
                  onClick={() => setInput('')}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  ×
                </button>
              )}
            </div>
            
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading || rateLimitCooldown > 0}
              className="btn btn-primary px-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="loading-dots">
                  <div className="loading-dot"></div>
                  <div className="loading-dot"></div>
                  <div className="loading-dot"></div>
                </div>
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Status Bar */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-3 h-3" />
              <span>Powered by AI • Not financial advice</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-3 h-3" />
              <span>{input.length}/1000</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}