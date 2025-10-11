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

// AUTHENTICATED
export async function continueAuthenticatedConversation(
  messages: Message[],
  timeZone: string
): Promise<ActionResponse> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated.')

  try {
    const { data: botSettings } = await supabase
      .from('bots')
      .select('*')
      .eq('user_id', user.id)
      .single()

    const model = getGenerativeModel(botSettings)
    const chat = model.startChat({ history: getHistory(messages, botSettings) })
    const result = await chat.sendMessage(messages[messages.length - 1].parts)

    const functionCalls = result.response.functionCalls()
    if (functionCalls?.length) {
      const fn = functionCalls[0]
      if (fn.name === 'bookAppointment') {
        const args = fn.args as AppointmentDetails
        args.timeZone = timeZone
        const toolResult = await bookAppointment(args)
        await chat.sendMessage([
          { functionResponse: { name: 'bookAppointment', response: toolResult } },
        ])
      }
    }

    return { history: await chat.getHistory() }
  } catch (error) {
    console.error('Error in continueAuthenticatedConversation:', error)
    return { history: [], error: 'Internal error.' }
  }
}

// PUBLIC
export async function continuePublicConversation(
  messages: Message[],
  botId: string,
  timeZone: string
): Promise<ActionResponse> {
  const supabaseAdmin = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: { get: (n: string) => cookies().get(n)?.value },
    }
  )

  try {
    const { data: botSettings } = await supabaseAdmin
      .from('bots')
      .select('*')
      .eq('user_id', botId)
      .single()

    const model = getGenerativeModel(botSettings)
    const chat = model.startChat({ history: getHistory(messages, botSettings) })
    const result = await chat.sendMessage(messages[messages.length - 1].parts)

    const functionCalls = result.response.functionCalls()
    if (functionCalls?.length) {
      const fn = functionCalls[0]
      if (fn.name === 'bookAppointment') {
        const args = fn.args as AppointmentDetails
        args.timeZone = timeZone
        const toolResult = await bookPublicAppointment(args, botId)
        await chat.sendMessage([
          { functionResponse: { name: 'bookAppointment', response: toolResult } },
        ])
      }
    }

    return { history: await chat.getHistory() }
  } catch (error) {
    console.error('Error in continuePublicConversation:', error)
    return { history: [], error: 'Internal error.' }
  }
}

// HELPER FUNCTIONS (unchanged)
function getGenerativeModel(botSettings: BotSettings) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
  const tools: Tool[] = [
    {
      functionDeclarations: [
        {
          name: 'bookAppointment',
          description: 'Books a salon appointment.',
          parameters: {
            type: SchemaType.OBJECT,
            properties: {
              service: { type: SchemaType.STRING },
              appointmentDate: { type: SchemaType.STRING },
              appointmentTime: { type: SchemaType.STRING },
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
    model: 'gemini-2.5-flash',
    systemInstruction: `You are a receptionist for "${botSettings.salon_name}".`,
    tools,
  })
}

function getHistory(messages: Message[], botSettings: BotSettings): Content[] {
  return messages.map((msg) => ({
    role: msg.role,
    parts: msg.parts.map((part: Part) => {
      if (part.functionCall) return { functionCall: part.functionCall }
      if (part.functionResponse) return { functionResponse: part.functionResponse }
      return { text: part.text || '' }
    }),
  }))
}

