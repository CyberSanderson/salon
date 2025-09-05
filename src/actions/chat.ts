'use server'

import {
  GoogleGenerativeAI,
  Tool,
  Content,
  FunctionDeclarationSchemaType,
} from '@google/generative-ai'
import { createClient } from '@/utils/supabase/server'
import {
  bookAppointment,
  bookPublicAppointment,
  AppointmentDetails,
} from './appointments'

type Message = {
  role: 'user' | 'model'
  parts: { text: string }[]
}

interface ConversationPayload {
  messages: Message[]
  botId?: string // botId is optional; if present, it's a public request
}

export async function continueConversation(payload: ConversationPayload) {
  const { messages, botId } = payload
  const supabase = createClient()

  let ownerUserId: string | null = null
  let isAuthenticatedRequest = false

  // Determine if this is an authenticated request (from dashboard) or a public one (from widget)
  if (botId) {
    ownerUserId = botId
  } else {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      // This case handles the dashboard preview
      throw new Error('User not authenticated for a private chat session.')
    }
    ownerUserId = user.id
    isAuthenticatedRequest = true
  }

  try {
    const { data: botSettings } = await supabase
      .from('bots')
      .select('*')
      .eq('user_id', ownerUserId)
      .single()

    if (!botSettings) {
      throw new Error('Bot settings not found.')
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

    const tools: Tool[] = [
      {
        functionDeclarations: [
          {
            name: 'bookAppointment',
            description:
              'Books a salon appointment. Collect service, date, time, and customer name before calling.',
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
      systemInstruction: `You are a receptionist for "${
        botSettings.salon_name
      }". Your goal is to answer questions based ONLY on the salon info provided and to book appointments using the 'bookAppointment' tool. Today's date is ${new Date().toISOString()}.
      
      SALON INFORMATION:
      - Services and Prices: ${botSettings.services}
      - Business Hours: ${botSettings.hours}`,
      tools: tools,
    })

    let history = messages.slice(0, -1)
    if (history.length > 0 && history[0].role === 'model') {
      history.shift()
    }

    const chat = model.startChat({ history: history as Content[] })
    const result = await chat.sendMessage(
      messages[messages.length - 1].parts[0].text
    )
    const response = result.response

    const functionCalls = response.functionCalls()
    if (functionCalls && functionCalls.length > 0) {
      const functionCall = functionCalls[0]
      if (functionCall.name === 'bookAppointment') {
        // Decide which booking action to call based on the context
        const toolResult = isAuthenticatedRequest
          ? await bookAppointment(functionCall.args as AppointmentDetails)
          : await bookPublicAppointment(
              functionCall.args as AppointmentDetails,
              ownerUserId
            )

        const result2 = await chat.sendMessage([
          {
            functionResponse: {
              name: 'bookAppointment',
              response: toolResult,
            },
          },
        ])
        return { text: result2.response.text() }
      }
    }

    return { text: response.text() }
  } catch (error) {
    console.error('Error in continueConversation action:', error)
    return { error: 'An internal error occurred.' }
  }
}