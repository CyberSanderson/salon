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
  // The widget is now always open by default when rendered inside the iframe.
  // The iframe's visibility is controlled by the widget.js script.
  const [isOpen, setIsOpen] = useState(true)
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
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const result = botId
        ? await continuePublicConversation(newMessages, botId, timeZone)
        : await continueAuthenticatedConversation(newMessages, timeZone);

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

  // This function sends a message to the parent window to hide the iframe
  const handleMinimize = () => {
    window.parent.postMessage('ariah-desk-minimize', '*');
  };

  // This component will now only render the chat window itself.
  // The floating bubble is handled by the widget.js script.
  return (
    <div className="w-full h-full bg-white flex flex-col">
        <div style={{ backgroundColor: primaryColor }} className="text-white p-4 flex justify-between items-center">
          <h3 className="font-bold text-lg">Ariah Desk Assistant</h3>
          {/* --- THIS IS THE NEW MINIMIZE BUTTON --- */}
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