'use server'

import {
  GoogleGenerativeAI,
  Tool,
  Content,
  Part,
  SchemaType,
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

// Define a clear type for the bot settings object
type BotSettings = {
  salon_name: string
  services: string
  hours: string
  welcome_message: string
}

interface ActionResponse {
  history: Content[]
  error?: string
}

// --- ACTION 1: For the secure, authenticated dashboard preview ---
export async function continueAuthenticatedConversation(
  messages: Message[]
): Promise<ActionResponse> {
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

    const model = getGenerativeModel(botSettings)
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

// --- ACTION 2: For the public, embeddable chat widget ---
export async function continuePublicConversation(
  messages: Message[],
  botId: string
): Promise<ActionResponse> {
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

    const model = getGenerativeModel(botSettings)
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
            type: SchemaType.OBJECT,
            properties: {
              service: { type: SchemaType.STRING },
              appointmentDate: {
                type: SchemaType.STRING,
                description: 'The date in YYYY-MM-DD format.',
              },
              appointmentTime: {
                type: SchemaType.STRING,
                description: 'The time in 24-hour HH:MM format.',
              },
              customerName: { type: SchemaType.STRING },
              customerPhone: { type: SchemaType.STRING },
            },
            required: ['service', 'appointmentDate', 'appointmentTime', 'customerName'],
          },
        },
      ],
    },
  ]

  return genAI.getGenerativeModel({
    // --- THIS IS THE DEFINITIVE FIX ---
    // We are now pinning to the latest, most powerful, and stable Flash model.
    model: 'gemini-2.5-flash',
    systemInstruction: `You are a receptionist for "${botSettings.salon_name}". Your goal is to book appointments and answer questions based ONLY on the salon information provided.
CRITICAL RULES:
1. GATHER ALL INFO: You MUST NOT call the 'bookAppointment' tool until you have collected ALL required information: the service, the date, the time, AND the customer's name.
2. VERIFY BUSINESS HOURS: Before calling the tool, you MUST check the requested time against the "Business Hours". If it's outside these hours, inform the user and ask for a different time.
3. FORMAT DATE & TIME: Today's date is ${new Date().toISOString()}. You must convert all dates (e.g., "next Tuesday") into 'YYYY-MM-DD' format and all times (e.g., "2pm") into 24-hour 'HH:MM' format.

SALON INFORMATION:
- Services and Prices: ${botSettings.services}
- Business Hours: ${botSettings.hours}`,
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

