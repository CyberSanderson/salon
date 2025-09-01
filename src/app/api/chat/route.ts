// src/app/api/chat/route.ts
import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextResponse } from 'next/server'

// IMPORTANT: Set the runtime to edge
export const runtime = 'edge'

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    // Initialize the Gemini client with your API key
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' })

    // Build the prompt with a system instruction
    const systemInstruction = `You are a friendly and professional receptionist for a beauty salon. Your goal is to answer questions and help users book appointments. Keep your responses concise and helpful.`
    
    // We will inject salon-specific data here later
    
    const chat = model.startChat({
        history: messages.map((msg: { role: string, parts: { text: string }[] }) => ({
            role: msg.role,
            parts: msg.parts.map(part => ({text: part.text}))
        })),
        generationConfig: {
            maxOutputTokens: 200,
        },
    });

    // Get the last message from the user
    const lastMessage = messages[messages.length - 1].parts[0].text;

    const result = await chat.sendMessage(lastMessage);
    const response = result.response;
    const text = response.text();

    return NextResponse.json({ text })
  } catch (error) {
    console.error('Error in Gemini API route:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}