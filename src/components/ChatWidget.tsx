'use client'

import { useEffect, useState } from 'react'
import {
  continueAuthenticatedConversation,
  continuePublicConversation,
} from '@/actions/chat'
import type { Content } from '@google/generative-ai'

type Message = Content

type BotSettings = {
  welcome_message?: string
  primary_color?: string
}

export default function ChatWidget({
  settings,
  botId,
}: {
  settings: BotSettings | null
  botId?: string
}) {
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([])
  const [userInput, setUserInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const primaryColor = settings?.primary_color || '#14B8A6'

  useEffect(() => {
    const welcomeText =
      settings?.welcome_message || 'Hello! How can I help you today?'
    setMessages([{ role: 'model', parts: [{ text: welcomeText }] }])
  }, [settings])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim() === '' || isLoading) return;

    const userMessage: Message = { role: 'user', parts: [{ text: userInput }] };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setUserInput('');
    setIsLoading(true);

    try {
      // --- THIS IS THE CRITICAL FIX ---
      // Get the user's local time zone from their browser
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      
      // Create the payload object that includes the new timeZone property
      const payload = { messages: newMessages, botId, timeZone };
      
      // Call the correct server action with the single, complete payload object
      const result = botId
        ? await continuePublicConversation(payload)
        : await continueAuthenticatedConversation(payload);

      if (result.history && result.history.length > 0) {
        setMessages(result.history);
      } else if (result.error) {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: Message = {
        role: 'model',
        parts: [{ text: "Sorry, I'm having trouble connecting. Please try again later." }],
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMinimize = () => {
    window.parent.postMessage('ariah-desk-minimize', '*');
  };

  // This is the full-screen view for the public /book and /chat-embed pages
  if (botId) {
    return (
      <div className="w-full h-full bg-white flex flex-col">
        <div style={{ backgroundColor: primaryColor }} className="text-white p-4 flex justify-between items-center">
          <h3 className="font-bold text-lg">Ariah Desk Assistant</h3>
          <button onClick={handleMinimize} className="hover:opacity-75">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
        </div>
        <div className="flex-grow p-4 overflow-y-auto space-y-4">
          {messages.map((message, index) => {
            const messageText = message.parts[0]?.text;
            if (!messageText) return null;
            return (
              <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div style={{ backgroundColor: message.role === 'user' ? primaryColor : undefined }} className={`px-4 py-2 rounded-lg max-w-xs ${message.role === 'user' ? 'text-white' : 'bg-gray-200 text-gray-800'}`}>
                  {messageText}
                </div>
              </div>
            )
          })}
          {isLoading && (<div className="flex justify-start"><div className="px-4 py-2 rounded-lg max-w-xs bg-gray-200 text-gray-800">Typing...</div></div>)}
        </div>
        <form onSubmit={handleSendMessage} className="p-4 border-t bg-gray-50 flex gap-2">
          <input type="text" placeholder="Type your message..." value={userInput} onChange={(e) => setUserInput(e.target.value)} disabled={isLoading} className="flex-grow px-3 py-2 border rounded-md disabled:bg-gray-100" />
          <button type="submit" disabled={isLoading} style={{ backgroundColor: primaryColor }} className="px-4 py-2 text-white rounded-md disabled:opacity-50">Send</button>
        </form>
      </div>
    )
  }

  // This is the dashboard preview with the floating bubble.
  return (
    <>
      {isDashboardOpen && (
        <div className="fixed bottom-24 right-5 w-96 h-[32rem] bg-white rounded-lg shadow-2xl flex flex-col z-20">
          <div style={{ backgroundColor: primaryColor }} className="text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="font-bold text-lg">Ariah Desk Assistant</h3>
            <button onClick={() => setIsDashboardOpen(false)} className="hover:opacity-75">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
            </button>
          </div>
           <div className="flex-grow p-4 overflow-y-auto space-y-4">
              {messages.map((message, index) => {
                const messageText = message.parts[0]?.text;
                if (!messageText) return null;
                return (
                  <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div style={{ backgroundColor: message.role === 'user' ? primaryColor : undefined }} className={`px-4 py-2 rounded-lg max-w-xs ${message.role === 'user' ? 'text-white' : 'bg-gray-200 text-gray-800'}`}>
                      {messageText}
                    </div>
                  </div>
                )
              })}
              {isLoading && (<div className="flex justify-start"><div className="px-4 py-2 rounded-lg max-w-xs bg-gray-200 text-gray-800">Typing...</div></div>)}
          </div>
          <form onSubmit={handleSendMessage} className="p-4 border-t bg-gray-50 flex gap-2">
            <input type="text" placeholder="Type your message..." value={userInput} onChange={(e) => setUserInput(e.target.value)} disabled={isLoading} className="flex-grow px-3 py-2 border rounded-md disabled:bg-gray-100" />
            <button type="submit" disabled={isLoading} style={{ backgroundColor: primaryColor }} className="px-4 py-2 text-white rounded-md disabled:opacity-50">Send</button>
          </form>
        </div>
      )}
      <button
        onClick={() => setIsDashboardOpen(!isDashboardOpen)}
        style={{ backgroundColor: primaryColor }}
        className="fixed bottom-5 right-5 text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110 z-10"
      >
        {isDashboardOpen ? (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>) : (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" /></svg>)}
      </button>
    </>
  )
}

