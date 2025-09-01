// src/app/api/chat/route.ts
import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
    
    const systemInstruction = `You are a friendly and professional receptionist for a beauty salon. Your goal is to answer questions and help users book appointments. Keep your responses concise and helpful.`
    
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash-latest',
      systemInstruction: systemInstruction,
    })

    // --- THIS IS THE FINAL, CORRECTED LOGIC ---
    // Get the user's latest message
    const lastMessage = messages[messages.length - 1];
    
    // Get the history, excluding the latest message
    let history = messages.slice(0, -1);

    // If the history starts with a 'model' message (our welcome message), remove it.
    // This ensures the conversation always starts with a 'user' message as required by the API.
    if (history.length > 0 && history[0].role === 'model') {
      history = history.slice(1);
    }
    
    const chat = model.startChat({
        history: history.map((msg: { role: 'user' | 'model', parts: { text: string }[] }) => ({
            role: msg.role,
            parts: msg.parts.map((part: {text: string}) => ({text: part.text}))
        })),
        generationConfig: {
            maxOutputTokens: 200,
        },
    });

    const result = await chat.sendMessage(lastMessage.parts[0].text);
    const response = result.response;
    const text = response.text();

    return NextResponse.json({ text })
  } catch (error) {
    console.error('Error in Gemini API route:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}