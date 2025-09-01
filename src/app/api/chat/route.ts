// src/app/api/chat/route.ts
import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
    
    // Define the system instruction
    const systemInstruction = `You are a friendly and professional receptionist for a beauty salon. Your goal is to answer questions and help users book appointments. Keep your responses concise and helpful.`
    
    // Pass the system instruction when getting the model
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash-latest',
      systemInstruction: systemInstruction, // <-- THE FIX IS HERE
    })

    const chat = model.startChat({
        // Filter out the system message from the history sent to the model
        history: messages
          .filter((msg: { role: string }) => msg.role !== 'system')
          .map((msg: { role: 'user' | 'model', parts: { text: string }[] }) => ({
              role: msg.role,
              parts: msg.parts.map((part: {text: string}) => ({text: part.text}))
          })),
        generationConfig: {
            maxOutputTokens: 200,
        },
    });

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