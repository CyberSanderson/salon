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
  botId?: string
}

export async function continueConversation(payload: ConversationPayload) {
  const { messages, botId } = payload
  const supabase = createClient()

  let ownerUserId: string | null = null
  let isAuthenticatedRequest = false

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

    const tools: Tool[] = [
      {
        functionDeclarations: [
          {
            name: 'bookAppointment',
            description:
              'Books a salon appointment. Only call this function when you have collected all required parameters.',
            parameters: {
              type: FunctionDeclarationSchemaType.OBJECT,
              properties: {
                service: { type: FunctionDeclarationSchemaType.STRING },
                appointmentDate: {
                  type: FunctionDeclarationSchemaType.STRING,
                  description:
                    'The date of the appointment in YYYY-MM-DD format.',
                },
                appointmentTime: {
                  type: FunctionDeclarationSchemaType.STRING,
                  description:
                    'The time of the appointment in 24-hour HH:MM format.',
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
      // --- MORE FORCEFUL INSTRUCTION ---
      systemInstruction: `You are a receptionist for "${
        botSettings.salon_name
      }". Your goal is to answer questions and book appointments.
      CRITICAL RULE: You MUST NOT call the 'bookAppointment' tool until you have collected ALL of the following required pieces of information from the user: the service, the date, the time, AND their name. If you are missing any of these, you MUST ask for the missing information again. Do not proceed without all required details.
      Today's date is ${new Date().toISOString()}. Dates must be in YYYY-MM-DD format. Times must be in HH:MM format.
      
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
    })
    return { error: 'An internal error occurred.' }
  }
}