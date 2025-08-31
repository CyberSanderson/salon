'use client'

import { useEffect, useState } from 'react'

type Message = {
  text: string;
  sender: 'user' | 'bot';
};

type BotSettings = {
  welcome_message?: string;
  primary_color?: string;
};

export default function ChatWidget({ settings }: { settings: BotSettings | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');

  // Use the color from settings, or a default teal color
  const primaryColor = settings?.primary_color || '#14B8A6'; // Default to teal

  useEffect(() => {
    if (settings?.welcome_message) {
      setMessages([{ text: settings.welcome_message, sender: 'bot' }]);
    } else {
      setMessages([{ text: "Hello! How can I help you today?", sender: 'bot' }]);
    }
  }, [settings]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim() === '') return;

    const userMessage: Message = { text: userInput, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setUserInput('');

    setTimeout(() => {
      const botMessage: Message = {
        text: "Thanks for your message! This is a simulated reply.",
        sender: 'bot',
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    }, 1000);
  };

  return (
    <>
      {/* The Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-5 w-96 h-[32rem] bg-white rounded-lg shadow-2xl flex flex-col">
          {/* Header - Now uses dynamic color */}
          <div style={{ backgroundColor: primaryColor }} className="text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="font-bold text-lg">Local Lead Bot</h3>
            <button onClick={() => setIsOpen(false)} className="hover:opacity-75">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
          </div>

          {/* Message Area - User message bubble now uses dynamic color */}
          <div className="flex-grow p-4 overflow-y-auto space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  style={{ 
                    backgroundColor: message.sender === 'user' ? primaryColor : undefined 
                  }} 
                  className={`px-4 py-2 rounded-lg max-w-xs ${message.sender === 'user' ? 'text-white' : 'bg-gray-200 text-gray-800'}`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Area - Send button now uses dynamic color */}
          <form onSubmit={handleSendMessage} className="p-4 border-t bg-gray-50 rounded-b-lg flex gap-2">
            <input
              type="text"
              placeholder="Type your message..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="flex-grow px-3 py-2 border rounded-md"
            />
            <button type="submit" style={{ backgroundColor: primaryColor }} className="px-4 py-2 text-white rounded-md">
              Send
            </button>
          </form>
        </div>
      )}

      {/* The Floating Bubble Button - Now uses dynamic color */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{ backgroundColor: primaryColor }}
        className="fixed bottom-5 right-5 text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
        </svg>
      </button>
    </>
  )
}