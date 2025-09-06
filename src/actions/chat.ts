'use server'

import {
  GoogleGenerativeAI,
  Tool,
  Content,
  FunctionDeclarationSchemaType,
  Part, // Import the 'Part' type
} from '@google/generative-ai'
import { createClient } from '@/utils/supabase/server'
import {
  bookAppointment,
  bookPublicAppointment,
  AppointmentDetails,
} from './appointments'

// Use the 'Content' type from the SDK as our primary message type
type Message = Content

interface ConversationPayload {
  messages: Message[]
  botId?: string
}

interface ActionResponse {
  history: Content[]
  error?: string
}

export async function continueConversation(
  payload: ConversationPayload
): Promise<ActionResponse> {
  const { messages, botId } = payload
  const supabase = createClient()

  let ownerUserId: string | null = null
  let isAuthenticatedRequest = false

  if (botId) {
    ownerUserId = botId
  } else {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      console.error("Authentication error: No user session found for private chat.")
      throw new Error('User not authenticated for a private chat session.')
    }
    ownerUserId = user.id
    isAuthenticatedRequest = true
  }

  try {
    if (!ownerUserId) {
      throw new Error("Could not determine the owner's user ID.")
    }

    const { data: botSettings, error: settingsError } = await supabase
      .from('bots')
      .select('*')
      .eq('user_id', ownerUserId)
      .single()

    if (settingsError || !botSettings) {
      console.error("Database error: Could not fetch bot settings.", { ownerUserId, settingsError })
      throw new Error('Bot settings not found.')
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

    const tools: Tool[] = [
      {
        functionDeclarations: [
          {
            name: 'bookAppointment',
            description: 'Books a salon appointment. Only call this function when you have collected all required parameters.',
            parameters: {
              type: FunctionDeclarationSchemaType.OBJECT,
              properties: {
                service: { type: FunctionDeclarationSchemaType.STRING },
                appointmentDate: { type: FunctionDeclarationSchemaType.STRING, description: 'The date in YYYY-MM-DD format.' },
                appointmentTime: { type: FunctionDeclarationSchemaType.STRING, description: 'The time in 24-hour HH:MM format.' },
                customerName: { type: FunctionDeclarationSchemaType.STRING },
                customerPhone: { type: FunctionDeclarationSchemaType.STRING },
              },
              required: ['service', 'appointmentDate', 'appointmentTime', 'customerName'],
            },
          },
        ],
      },
    ]

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash-latest',
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
    
    const lastMessage = messages[messages.length - 1];
    const lastMessageText = lastMessage?.parts[0]?.text;
    if (typeof lastMessageText !== 'string') {
        throw new Error("The last message sent to the action had no text content.");
    }
    
    let historyMessages = messages.slice(0, -1);
    if (historyMessages.length > 0 && historyMessages[0].role === 'model') {
       if (messages.length === 2) { 
           historyMessages = [];
       } else {
           historyMessages.shift();
       }
    }
    
    // --- ROBUST HISTORY MAPPING ---
    // Explicitly map our Message array to the SDK's Content array to be 100% type-safe.
    const history: Content[] = historyMessages.map(msg => ({
        role: msg.role,
        parts: msg.parts.map((part: Part) => ({ text: part.text || "" }))
    }));

    const chat = model.startChat({ history })
    const result = await chat.sendMessage(lastMessageText)
    const response = result.response

    const functionCalls = response.functionCalls()
    if (functionCalls && functionCalls.length > 0) {
      const functionCall = functionCalls[0]
      if (functionCall.name === 'bookAppointment') {
        const toolResult = isAuthenticatedRequest
          ? await bookAppointment(functionCall.args as AppointmentDetails)
          : await bookPublicAppointment(functionCall.args as AppointmentDetails, ownerUserId);

        await chat.sendMessage([{ functionResponse: { name: 'bookAppointment', response: toolResult } }])
      }
    }
    
    const updatedHistory = await chat.getHistory()
    return { history: updatedHistory }

  } catch (error) {
    console.error('Error in continueConversation action:', {
        errorMessage: error instanceof Error ? error.message : String(error),
        payload: payload,
        stack: error instanceof Error ? error.stack : undefined,
    });
    return { history: [], error: 'An internal error occurred.' }
  }
}
