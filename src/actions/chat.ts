'use server'

import {
  GoogleGenerativeAI,
  Tool,
  Content,
  Part,
} from '@google/generative-ai'
import { createClient } from '@/utils/supabase/server'
import {
  bookAppointment,
  bookPublicAppointment,
  AppointmentDetails,
} from './appointments'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

type Message = Content

type BotSettings = {
  salon_name: string
  services: string
  hours: string
  welcome_message: string
}

interface ConversationPayload {
  messages: Message[]
  botId?: string
  timeZone?: string
}

interface ActionResponse {
  history: Content[]
  error?: string
}

export async function continueAuthenticatedConversation(
  payload: ConversationPayload
): Promise<ActionResponse> {
  // FIX: Removed the unused 'timeZone' variable from destructuring
  const { messages } = payload;
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('User not authenticated for a private chat session.')
  }

  try {
    const { data: botSettings } = await supabase
      .from('bots')
      .select('*')
      .eq('user_id', user.id)
      .single()
    if (!botSettings) {
      throw new Error('Bot settings not found.')
    }

    const model = getGenerativeModel(botSettings) // timeZone is no longer passed
    const chat = model.startChat({ history: getHistory(messages, botSettings) })
    const result = await chat.sendMessage(messages[messages.length - 1].parts)

    const functionCalls = result.response.functionCalls()
    if (functionCalls && functionCalls.length > 0) {
      const functionCall = functionCalls[0]
      if (functionCall.name === 'bookAppointment') {
        const toolResult = await bookAppointment(
          functionCall.args as AppointmentDetails
        )
        await chat.sendMessage([
          { functionResponse: { name: 'bookAppointment', response: toolResult } },
        ])
      }
    }

    return { history: await chat.getHistory() }
  } catch (error) {
    console.error('Error in continueAuthenticatedConversation:', {
      errorMessage: error instanceof Error ? error.message : String(error),
    })
    return { history: [], error: 'An internal error occurred.' }
  }
}

export async function continuePublicConversation(
  payload: ConversationPayload
): Promise<ActionResponse> {
  // FIX: Removed the unused 'timeZone' variable from destructuring
  const { messages, botId } = payload
  if (!botId) {
    throw new Error('Bot ID is required for public conversation.')
  }
  
  const supabaseAdmin = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get: (name: string) => cookies().get(name)?.value,
      },
    }
  )

  try {
    const { data: botSettings } = await supabaseAdmin
      .from('bots')
      .select('*')
      .eq('user_id', botId)
      .single()
    if (!botSettings) {
      throw new Error('Bot settings not found for the provided botId.')
    }

    const model = getGenerativeModel(botSettings) // timeZone is no longer passed
    const chat = model.startChat({ history: getHistory(messages, botSettings) })
    const result = await chat.sendMessage(messages[messages.length - 1].parts)

    const functionCalls = result.response.functionCalls()
    if (functionCalls && functionCalls.length > 0) {
      const functionCall = functionCalls[0]
      if (functionCall.name === 'bookAppointment') {
        const toolResult = await bookPublicAppointment(
          functionCall.args as AppointmentDetails,
          botId
        )
        await chat.sendMessage([
          { functionResponse: { name: 'bookAppointment', response: toolResult } },
        ])
      }
    }

    return { history: await chat.getHistory() }
  } catch (error) {
    console.error('Error in continuePublicConversation:', {
      errorMessage: error instanceof Error ? error.message : String(error),
    })
    return { history: [], error: 'An internal error occurred.' }
  }
}

// --- HELPER FUNCTIONS ---
function getGenerativeModel(botSettings: BotSettings) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
  const tools: Tool[] = [
    {
      functionDeclarations: [
        {
          name: 'bookAppointment',
          description:
            'Books a salon appointment. Only call this function when you have collected all required parameters.',
          parameters: {
            type: 'object',
            properties: {
              service: { type: 'string' },
              appointmentDate: {
                type: 'string',
                description: 'The date in YYYY-MM-DD format.',
              },
              appointmentTime: {
                type: 'string',
                description: 'The time in 24-hour HH:MM format.',
              },
              customerName: { type: 'string' },
              customerPhone: { type: 'string' },
            },
            required: ['service', 'appointmentDate', 'appointmentTime', 'customerName'],
          },
        },
      ],
    },
  ]

  return genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: `You are a receptionist for "${botSettings.salon_name}". Your primary goal is to book appointments.
CRITICAL RULES:
1. GATHER ALL INFO: You MUST NOT call 'bookAppointment' until you have: the service, the date, the time, AND the customer's name.
2. VERIFY HOURS: Check the requested time against business hours before booking.
3. FORMAT DATE & TIME: Today's date is ${new Date().toISOString()}. Convert all dates to 'YYYY-MM-DD' and times to 'HH:MM' format.

SALON INFORMATION:
- Services: ${botSettings.services}
- Hours: ${botSettings.hours}`,
    tools: tools,
  })
}

function getHistory(messages: Message[], botSettings: BotSettings): Content[] {
  let history = messages.slice(0, -1)
  if (
    history.length > 0 &&
    history[0].role === 'model' &&
    history[0].parts[0].text === botSettings.welcome_message
  ) {
    if (messages.length === 2) {
      history = []
    }
  }
  return history.map((msg) => ({
    role: msg.role,
    parts: msg.parts.map((part: Part) => {
      if (part.functionCall) return { functionCall: part.functionCall }
      if (part.functionResponse) return { functionResponse: part.functionResponse }
      return { text: part.text || '' }
    }),
  }))
}