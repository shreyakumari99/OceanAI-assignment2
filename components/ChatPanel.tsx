import React, { useRef, useEffect, useState } from 'react';
import { Email, ChatMessage, AgentPrompts } from '../types';
import { chatWithAgent } from '../services/geminiService';
import { Send, X, Bot, User, RefreshCw, Loader2 } from 'lucide-react';
import { GenerateContentResponse } from "@google/genai";

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentEmail: Email | null;
  prompts: AgentPrompts;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ isOpen, onClose, currentEmail, prompts }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hello! I can help you process this email or answer questions about your inbox tasks. How can I assist?' }
  ]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Reset chat when email context significantly changes? 
  // For this demo, let's keep history but user might want to clear it.
  
  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsStreaming(true);

    try {
      // Convert format for API
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const streamResult = await chatWithAgent(history, userMsg, currentEmail, prompts.persona);
      
      let fullResponse = "";
      setMessages(prev => [...prev, { role: 'model', text: '' }]); // Placeholder

      for await (const chunk of streamResult) {
          const c = chunk as GenerateContentResponse;
          const text = c.text;
          if (text) {
            fullResponse += text;
            setMessages(prev => {
                const newArr = [...prev];
                newArr[newArr.length - 1] = { role: 'model', text: fullResponse };
                return newArr;
            });
          }
      }

    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error processing that request." }]);
    } finally {
      setIsStreaming(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-96 bg-white shadow-2xl border-l z-40 flex flex-col transform transition-transform duration-300 ease-in-out">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
            <Bot size={18} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">Agent Chat</h3>
            <p className="text-xs text-slate-500">
              {currentEmail ? 'Context: Current Email' : 'Context: General'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={() => setMessages([{ role: 'model', text: 'Context cleared. How can I help?' }])}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200"
                title="Clear Chat"
            >
                <RefreshCw size={16} />
            </button>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600">
            <X size={20} />
            </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
              msg.role === 'user' ? 'bg-slate-200 text-slate-600' : 'bg-indigo-600 text-white'
            }`}>
              {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
            </div>
            <div className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${
              msg.role === 'user' 
                ? 'bg-white text-slate-800 rounded-tr-none' 
                : 'bg-indigo-600 text-white rounded-tl-none'
            }`}>
              <p className="whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {isStreaming && (
            <div className="flex gap-3">
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white">
                    <Loader2 size={14} className="animate-spin" />
                </div>
                <div className="bg-indigo-600 text-white p-3 rounded-2xl rounded-tl-none text-sm opacity-70">
                    Thinking...
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about this email..."
            className="w-full pl-4 pr-12 py-3 bg-slate-100 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-0 rounded-xl text-sm transition-all"
            disabled={isStreaming}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isStreaming}
            className="absolute right-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;