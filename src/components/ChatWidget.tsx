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
  const [isOpen, setIsOpen] = useState(!!botId)
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
    e.preventDefault()
    if (userInput.trim() === '' || isLoading) return

    const userMessage: Message = { role: 'user', parts: [{ text: userInput }] }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setUserInput('')
    setIsLoading(true)

    try {
      const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

      const result = botId
        ? await continuePublicConversation(newMessages, botId, userTimeZone)
        : await continueAuthenticatedConversation(newMessages, userTimeZone)

      if (result.history && result.history.length > 0) {
        setMessages(result.history)
      } else if (result.error) {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      const errorMessage: Message = {
        role: 'model',
        parts: [
          {
            text: "Sorry, I'm having trouble connecting. Please try again later.",
          },
        ],
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  if (botId) {
    // Embedded widget
    return (
      <div className="w-full h-full bg-white flex flex-col">
        <div
          style={{ backgroundColor: primaryColor }}
          className="text-white p-4 flex justify-between items-center"
        >
          <h3 className="font-bold text-lg">Ariah Desk Assistant</h3>
        </div>
        <div className="flex-grow p-4 overflow-y-auto space-y-4">
          {messages.map((message, i) => {
            const text = message.parts[0]?.text
            if (!text) return null
            return (
              <div
                key={i}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  style={{
                    backgroundColor:
                      message.role === 'user' ? primaryColor : undefined,
                  }}
                  className={`px-4 py-2 rounded-lg max-w-xs ${
                    message.role === 'user'
                      ? 'text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {text}
                </div>
              </div>
            )
          })}
          {isLoading && (
            <div className="flex justify-start">
              <div className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800">
                Typing...
              </div>
            </div>
          )}
        </div>
        <form
          onSubmit={handleSendMessage}
          className="p-4 border-t bg-gray-50 flex gap-2"
        >
          <input
            type="text"
            placeholder="Type your message..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            disabled={isLoading}
            className="flex-grow px-3 py-2 border rounded-md disabled:bg-gray-100"
          />
          <button
            type="submit"
            disabled={isLoading}
            style={{ backgroundColor: primaryColor }}
            className="px-4 py-2 text-white rounded-md disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>
    )
  }

  // Dashboard floating bubble
  return (
    <>
      {isOpen && (
        <div className="fixed bottom-24 right-5 w-96 h-[32rem] bg-white rounded-lg shadow-2xl flex flex-col z-20">
          <div
            style={{ backgroundColor: primaryColor }}
            className="text-white p-4 rounded-t-lg flex justify-between items-center"
          >
            <h3 className="font-bold text-lg">Ariah Desk Assistant</h3>
            <button onClick={() => setIsOpen(false)} className="hover:opacity-75">
              ✕
            </button>
          </div>
          <div className="flex-grow p-4 overflow-y-auto space-y-4">
            {messages.map((m, i) => {
              const t = m.parts[0]?.text
              if (!t) return null
              return (
                <div
                  key={i}
                  className={`flex ${
                    m.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    style={{
                      backgroundColor:
                        m.role === 'user' ? primaryColor : undefined,
                    }}
                    className={`px-4 py-2 rounded-lg max-w-xs ${
                      m.role === 'user'
                        ? 'text-white'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    {t}
                  </div>
                </div>
              )
            })}
          </div>
          <form
            onSubmit={handleSendMessage}
            className="p-4 border-t bg-gray-50 flex gap-2"
          >
            <input
              type="text"
              placeholder="Type your message..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              disabled={isLoading}
              className="flex-grow px-3 py-2 border rounded-md disabled:bg-gray-100"
            />
            <button
              type="submit"
              disabled={isLoading}
              style={{ backgroundColor: primaryColor }}
              className="px-4 py-2 text-white rounded-md disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{ backgroundColor: primaryColor }}
        className="fixed bottom-5 right-5 text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 z-10"
      >
        💬
      </button>
    </>
  )
}
