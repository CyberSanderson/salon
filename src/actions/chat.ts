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

    // The tool definition now uses the simpler date/time format
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
                appointmentDate: {
                  type: FunctionDeclarationSchemaType.STRING,
                  description:
                    'The date of the appointment in YYYY-MM-DD format, e.g., "2025-09-08"',
                },
                appointmentTime: {
                  type: FunctionDeclarationSchemaType.STRING,
                  description:
                    'The time of the appointment in 24-hour HH:MM format, e.g., "14:30" for 2:30 PM',
                },
                customerName: {
                  type: FunctionDeclarationSchemaType.STRING,
                },
                customerPhone: {
                  type: FunctionDeclarationSchemaType.STRING,
                },
              },
              required: [
                'service',
                'appointmentDate',
                'appointmentTime',
                'customerName',
              ],
            },
          },
        ],
      },
    ]

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash-latest',
      systemInstruction: `You are a receptionist for "${
        botSettings.salon_name
      }". Your goal is to answer questions based ONLY on the salon info provided and to book appointments using the 'bookAppointment' tool.
      When a user wants to book, you MUST collect the service, date, time, and their name.
      When handling dates and times, you MUST be very precise. Today's date is ${new Date().toISOString()}.
      You must provide the arguments to the 'bookAppointment' tool in the exact format specified: 'YYYY-MM-DD' for the date and 'HH:MM' for the time.
      For example, if today is Monday, Sep 5th, 2025 and a user asks for "Wednesday at 11am", you must calculate the absolute date and provide appointmentDate as "2025-09-07" and appointmentTime as "11:00".
      
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
    console.error('Error in continueConversation action:', {
        errorMessage: error instanceof Error ? error.message : String(error),
        payload: payload,
        stack: error instanceof Error ? error.stack : undefined,
    });
    return { error: 'An internal error occurred.' }
  }
}