'use client';

import { useState, useEffect } from 'react';
import { useChatStore, Message } from '@/lib/store';
import ReactMarkdown from 'react-markdown';

export function Chat() {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { messages, addMessage, clearMessages } = useChatStore();

  useEffect(() => {
    clearMessages();
  }, [clearMessages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = {
      text: input,
      sender: 'user' as const,
    };
    addMessage(userMessage);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.text,
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      addMessage({
        text: data.reply,
        sender: 'bot' as const,
      });
    } catch (error) {
      addMessage({
        text: "I'm sorry, I encountered an error. Please try again.",
        sender: 'bot' as const,
      });
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg h-[600px] flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 rounded-lg px-4 py-2">
              <TypingIndicator />
            </div>
          </div>
        )}
      </div>
      
      <form onSubmit={handleSend} className="border-t p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:border-blue-500"
            style={{ color: 'black' }}
            disabled={isTyping}
          />
          <button
            type="submit"
            className={`px-6 py-2 rounded-lg transition-colors ${
              isTyping || !input.trim()
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
            disabled={isTyping || !input.trim()}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const [formattedTime, setFormattedTime] = useState('');

  useEffect(() => {
    const date = new Date(message.timestamp);
    setFormattedTime(date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  }, [message.timestamp]); // Ensures it updates when timestamp changes

  return (
    <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-lg px-4 py-2 ${
          message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'
        }`}
      >
        <ReactMarkdown className="prose prose-sm max-w-none">
          {message.text}
        </ReactMarkdown>
        <div className="text-xs mt-1 opacity-70">{formattedTime}</div>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex space-x-2">
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  );
}