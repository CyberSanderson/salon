'use server'

import {
  GoogleGenerativeAI,
  Tool,
  Content,
  FunctionDeclarationSchemaType,
} from '@google/generative-ai'
import { createClient } from '@/utils/supabase/server'
import { bookAppointment, AppointmentDetails } from './appointments'

type Message = {
  role: 'user' | 'model'
  parts: { text: string }[]
}

export async function continueConversation(messages: Message[]) {
  try {
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      throw new Error('User not authenticated for chat action')
    }

    const { data: botSettings } = await supabase
      .from('bots')
      .select('*')
      .eq('user_id', user.id)
      .single()

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

    const tools: Tool[] = [
      {
        functionDeclarations: [
          {
            name: 'bookAppointment',
            description: 'Books a salon appointment. Collect service, date, time, and customer name before calling.',
            parameters: {
              type: FunctionDeclarationSchemaType.OBJECT,
              properties: {
                service: { type: FunctionDeclarationSchemaType.STRING },
                appointmentTime: { type: FunctionDeclarationSchemaType.STRING },
                customerName: { type: FunctionDeclarationSchemaType.STRING },
                customerPhone: { type: FunctionDeclarationSchemaType.STRING },
              },
              required: ['service', 'appointmentTime', 'customerName'],
            },
          },
        ],
      },
    ]

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash-latest',
      systemInstruction: `You are a receptionist for "${ botSettings?.salon_name || 'the salon' }". Your goal is to answer questions based ONLY on the salon info provided and to book appointments using the 'bookAppointment' tool. When a user wants to book, you MUST collect the service, date, time, and their name. When handling dates, you MUST be very precise. Today's date is ${new Date().toISOString()}. When a user provides a relative date like "tomorrow" or "Wednesday", you must calculate the full, absolute date and convert the final result to a complete ISO 8601 UTC string.
      
      SALON INFORMATION:
      - Services and Prices: ${botSettings?.services || 'Not provided.'}
      - Business Hours: ${botSettings?.hours || 'Not provided.'}`,
      tools: tools,
    })

    let history = messages.slice(0, -1)
    const lastMessage = messages[messages.length - 1]

    if (history.length > 0 && history[0].role === 'model') {
      history.shift()
    }

    const chat = model.startChat({ history: history as Content[] })
    const result = await chat.sendMessage(lastMessage.parts[0].text)
    const response = result.response

    const functionCalls = response.functionCalls()
    if (functionCalls && functionCalls.length > 0) {
      const functionCall = functionCalls[0]
      if (functionCall.name === 'bookAppointment') {
        const toolResult = await bookAppointment(functionCall.args as AppointmentDetails)
        const result2 = await chat.sendMessage([{ functionResponse: { name: 'bookAppointment', response: toolResult } }])
        return { text: result2.response.text() }
      }
    }

    return { text: response.text() }
  } catch (error) {
    console.error('Error in continueConversation action:', error)
    return { error: 'An internal error occurred.' }
  }
}