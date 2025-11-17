import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import Cerebras from "@cerebras/cerebras_cloud_sdk"

const cerebras = new Cerebras({
  apiKey: process.env.CEREBRAS_API_KEY || "YOUR_CEREBRAS_API_KEY",
})

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Verify user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { message, language, userId } = await request.json()

    if (!message || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    console.log("[v0] Processing chat request for user:", userId)

    // Fetch recent chat history for context
    const { data: chatHistory } = await supabase
      .from("chat_history")
      .select("message_type, message_content")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10)

    // Build context from chat history
    const conversationContext = chatHistory
      ?.reverse()
      .map((msg) => `${msg.message_type === "user" ? "User" : "Assistant"}: ${msg.message_content}`)
      .join("\n")

    // Fetch relevant home remedies and schemes for context
    const { data: remedies } = await supabase
      .from("home_remedies")
      .select("condition_name, remedy_description, precautions")
      .limit(5)

    const { data: schemes } = await supabase
      .from("government_schemes")
      .select("scheme_name, description, benefits")
      .eq("active", true)
      .limit(5)

    // Strict system prompt to force AI reply in the detected language
    const systemPrompt = `
You are HealthSakhi, a compassionate and knowledgeable health assistant for Indian families.
The user is speaking in ${language === "hi" ? "Hindi" : language === "mr" ? "Marathi" : "English"}.
IMPORTANT: REPLY ONLY IN THIS LANGUAGE. NEVER REPLY IN ENGLISH if the user speaks Hindi or Marathi.
Always respond naturally, helpfully, concisely, and empathetically in the user's language.
Keep language simple, culturally appropriate, and understandable for low-literacy users.

Your expertise:
1. Maternal health (pregnancy care, prenatal checkups, nutrition)
2. Child health (vaccinations, growth milestones, common ailments)
3. Government welfare schemes (PMMVY, JSY, state schemes)
4. WHO-approved home remedies

Available schemes: ${schemes?.map((s) => s.scheme_name).join(", ")}
Available remedies: ${remedies?.map((r) => r.condition_name).join(", ")}

Previous conversation:
${conversationContext || "No previous conversation"}

User's message:
${message}

RESPOND ONLY IN THE DETECTED LANGUAGE (${language === "hi" ? "Hindi" : language === "mr" ? "Marathi" : "English"}).
    `

    console.log("[v0] Calling Cerebras API (LLaMA 3.3 70B)")

    const completion = await cerebras.chat.completions.create({
      model: "llama3.3-70b",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    const choices = (completion.choices as Array<{ message?: { content?: string } }>) || []
    let responseText = choices[0]?.message?.content || "I apologize, I couldn't generate a response."

    console.log("[v0] Cerebras response received successfully")

    // Store conversation in Supabase
    await supabase.from("chat_history").insert([
      {
        user_id: userId,
        message_type: "user",
        message_content: message,
        language: language,
      },
      {
        user_id: userId,
        message_type: "assistant",
        message_content: responseText,
        language: language,
      },``
    ])

    return NextResponse.json({ message: responseText })
  } catch (error) {
    console.error("[v0] Error in chat API:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}