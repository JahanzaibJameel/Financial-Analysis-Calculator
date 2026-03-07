'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  Send,
  Bot,
  User,
  Clock,
} from 'lucide-react';
import { openaiAPI, OpenAIMessage } from '@/utils/api';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

export default function AIAssistant() {
  const [useMockMode, setUseMockMode] = useState(false);
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
  const [mounted, setMounted] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

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
      // If mock mode is enabled, provide a mock response
      if (useMockMode) {
        const mockResponses = [
          'Based on your question about compound interest, the formula is A = P(1 + r/n)^nt where A is the final amount, P is principal, r is annual interest rate, n is times compounded per year, and t is time in years.',
          'For portfolio diversification, consider spreading investments across different asset classes like stocks, bonds, real estate, and commodities to reduce overall risk.',
          'The 4% rule for retirement savings suggests saving 4% of your annual income for retirement. If you start at age 30, you could retire comfortably by 65.',
          'Emergency funds should cover 3-6 months of essential expenses and be kept in liquid accounts like high-yield savings or money market funds.'
        ];
        
        setTimeout(() => {
          const mockMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: `🤖 **Mock Mode Response** - ${mockResponses[Math.floor(Math.random() * mockResponses.length)]}\n\n*This is a simulated response. Toggle "Live Mode" for real AI assistance.*`,
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, mockMessage]);
          setIsLoading(false);
        }, 1000);
        return;
      }

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
        if (error.message.includes('rate_limit') || error.message.includes('Rate limit exceeded')) {
          setRateLimitCooldown(30);
          errorMessage = '⏰ Rate limit reached. Providing a demo response instead. Please wait 30 seconds before trying again.';
          
          // Add a demo response to maintain user experience
          const demoResponses = [
            'Compound interest is the addition of interest to the principal sum, where interest also earns interest. This creates exponential growth over time.',
            'Diversification is a risk management strategy that spreads investments across various assets to reduce portfolio volatility.',
            'The 50/30/20 rule suggests allocating 50% to needs, 30% to wants, and 20% to savings and debt repayment.',
            'Emergency funds should typically cover 3-6 months of living expenses and be kept in easily accessible accounts.'
          ];
          
          const demoMessage: ChatMessage = {
            id: (Date.now() + 2).toString(),
            role: 'assistant',
            content: `🤖 **Demo Mode** - ${demoResponses[Math.floor(Math.random() * demoResponses.length)]}\n\n*This is a sample response. Please wait for the rate limit to reset to get personalized AI responses.*`,
            timestamp: new Date(),
          };
          
          setMessages(prev => [...prev, demoMessage]);
        } else if (error.message.includes('API key')) {
          errorMessage = '🔑 AI service is not properly configured. Please check your API setup.';
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
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          AI Financial Assistant
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Get expert financial guidance and insights
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">AI Assistant</h3>
                <p className="text-blue-100 text-sm">
                  Financial guidance powered by AI
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setUseMockMode(!useMockMode)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  useMockMode 
                    ? 'bg-green-500 text-white' 
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {useMockMode ? 'Mock Mode' : 'Live Mode'}
              </button>
              {rateLimitCooldown > 0 && (
                <div className="flex items-center space-x-1 text-sm bg-white/20 px-3 py-1 rounded-full">
                  <Clock className="w-4 h-4" />
                  <span>{rateLimitCooldown}s</span>
                </div>
              )}
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-300 animate-pulse' : 'bg-green-300'}`} />
                <span className="text-sm">
                  {isLoading ? 'Thinking...' : 'Online'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-gray-900/50">
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
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                  }`}>
                    {message.role === 'assistant' ? (
                      <Bot className="w-4 h-4" />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                  </div>
                  
                  <div className={`p-4 rounded-2xl ${
                    message.role === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                  }`}>
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {message.content}
                    </div>
                    <div className={`text-xs mt-2 opacity-70 ${
                      message.role === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {mounted ? message.timestamp.toLocaleTimeString() : 'Loading...'}
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
                <div className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <Bot className="w-4 h-4 text-gray-900 dark:text-white" />
                </div>
                <div className="p-4 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          {/* Suggestions */}
          {!isLoading && rateLimitCooldown === 0 && messages.length === 1 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setInput(suggestion)}
                  className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
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
                    : "Ask me anything about finance..."
                }
                disabled={isLoading || rateLimitCooldown > 0}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                rows={1}
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading || rateLimitCooldown > 0}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}