"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Heart, Send, Mic, MicOff, Menu, LogOut, Calendar, FileText, Home, Leaf } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"
import { franc } from "franc"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface Profile {
  id: string
  full_name: string | null
  preferred_language: string
}

interface HealthAssistantProps {
  user: User
  profile: Profile | null
}

// --- I18N Translation Dictionary ---
const i18n = {
  en: {
    welcome: "Namaste! I'm your HealthSakhi health companion. I'm here to help you with maternal & child health questions, government schemes, and trusted home remedies. How can I assist you today?",
    placeholder: "Ask about health, schemes, or remedies...",
    assistant: "Assistant",
    reminders: "Reminders",
    schemes: "Schemes",
    remedies: "Remedies",
    logout: "Logout",
    error: "I apologize, but I'm having trouble responding right now. Please try again.",
  },
  hi: {
    welcome: "नमस्ते! मैं आपकी HealthSakhi स्वास्थ्य साथी हूँ। मैं मातृ एवं बाल स्वास्थ्य प्रश्नों, सरकारी योजनाओं और भरोसेमंद घरेलू उपचारों में आपकी सहायता के लिए हूँ। आज मैं आपकी कैसे मदद कर सकती हूँ?",
    placeholder: "स्वास्थ्य, योजनाओं, या घरेलू उपचार के बारे में पूछें...",
    assistant: "सहायक",
    reminders: "अनुस्मारक",
    schemes: "योजनाएं",
    remedies: "उपचार",
    logout: "लॉगआउट",
    error: "मुझे माफ़ करना, मुझे अभी जवाब देने में परेशानी हो रही है। कृपया पुनः प्रयास करें।",
  },
  mr: {
    welcome: "नमस्ते! मी तुमची HealthSakhi आरोग्य साथी आहे. मी तुम्हाला माता आणि बाल आरोग्य प्रश्नांची, सरकारी योजनांची आणि विश्वसनीय घरगुती उपायांची मदत करण्यासाठी येथे आहे. आज मी तुम्हाला कशी मदत करू शकते?",
    placeholder: "आरोग्य, योजना किंवा उपायांबद्दल विचारा...",
    assistant: "सहाय्यक",
    reminders: "स्मरणपत्रे",
    schemes: "योजना",
    remedies: "उपाय",
    logout: "लॉगआउट",
    error: "मी माफी मागतो, पण मला सध्या प्रतिसाद देण्यात अडचण येत आहे. कृपया पुन्हा प्रयत्न करा.",
  },
};

// --- Helper Functions ---

// Detect language from text
function detectLanguageFromText(text: string): "en" | "hi" | "mr" {
  const code = franc(text)
  if (code === "hin") return "hi"
  if (code === "mar") return "mr"
  return "en"
}

// Translate text using backend API
async function translateToUserLanguage(text: string, targetLang: string) {
  try {
    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, targetLang }),
    })
    if (!res.ok) return text
    const data = await res.json()
    return data.translatedText || text
  } catch (err) {
    console.error("Translation failed:", err)
    return text
  }
}

export function HealthAssistant({ user, profile }: HealthAssistantProps) {
  // Determine current language and translation object
  const langCode = (profile?.preferred_language as keyof typeof i18n) || 'en';
  const t = i18n[langCode];

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      // Use the translated welcome message
      content: t.welcome, 
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const supabase = createClient()

  // --- Scroll to bottom on new messages ---
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  // --- Speak assistant messages ---
  useEffect(() => {
    const lastMessage = messages[messages.length - 1]
    if (lastMessage?.role === "assistant") {
      speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(lastMessage.content)
      const langMap: Record<string, string> = {
        en: "en-IN",
        hi: "hi-IN",
        mr: "mr-IN",
      }
      // Detect language from assistant content
      const lang = detectLanguageFromText(lastMessage.content)
      utterance.lang = langMap[lang] || "en-IN"
      speechSynthesis.speak(utterance)
    }
  }, [messages])

  // --- Send message to assistant ---
  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Detect language from user input
    const detectedLang = detectLanguageFromText(input)

    try {
      // Save user message
      await supabase.from("chat_history").insert({
        user_id: user.id,
        message_type: "user",
        message_content: input,
        language: detectedLang,
        context_type: "health",
      })

      // Call AI assistant API
      const response = await fetch("/api/assistant/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          language: detectedLang,
          userId: user.id,
        }),
      })

      if (!response.ok) throw new Error("Failed to get response")
      const data = await response.json()

      // Translate AI response to user's language if needed
      let reply = data.message
      if (detectedLang !== "en") {
        // Use the preferred language for translation, not the detected language (which might be mixed)
        reply = await translateToUserLanguage(data.message, profile?.preferred_language || 'en') 
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: reply,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Save assistant message
      await supabase.from("chat_history").insert({
        user_id: user.id,
        message_type: "assistant",
        message_content: reply,
        language: profile?.preferred_language || 'en', // Save with preferred language
        context_type: "health",
      })
    } catch (error) {
      console.error("[v0] Error sending message:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        // Use the translated error message
        content: t.error, 
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // --- Voice input ---
  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Voice input is not supported in your browser. Please use Chrome or Edge.")
      return
    }

    if (isListening) {
      setIsListening(false)
      return
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.lang =
      profile?.preferred_language === "hi"
        ? "hi-IN"
        : profile?.preferred_language === "mr"
        ? "mr-IN"
        : "en-IN"
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onstart = () => setIsListening(true)

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setInput(transcript)
      setIsListening(false)
    }

    recognition.onerror = () => setIsListening(false)
    recognition.onend = () => setIsListening(false)

    recognition.start()
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold">HealthSakhi</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setShowMenu(!showMenu)}>
              <Menu className="h-5 w-5" />
            </Button>
            <nav className="hidden md:flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/assistant">
                  <Home className="h-4 w-4 mr-2" />
                  {t.assistant}
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/reminders">
                  <Calendar className="h-4 w-4 mr-2" />
                  {t.reminders}
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/schemes">
                  <FileText className="h-4 w-4 mr-2" />
                  {t.schemes}
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/remedies">
                  <Leaf className="h-4 w-4 mr-2" />
                  {t.remedies}
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                {t.logout}
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {showMenu && (
        <div className="md:hidden border-b bg-background p-4">
          <nav className="flex flex-col gap-2">
            <Button variant="ghost" size="sm" asChild className="justify-start">
              <Link href="/assistant">
                <Home className="h-4 w-4 mr-2" />
                {t.assistant}
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild className="justify-start">
              <Link href="/reminders">
                <Calendar className="h-4 w-4 mr-2" />
                {t.reminders}
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild className="justify-start">
              <Link href="/schemes">
                <FileText className="h-4 w-4 mr-2" />
                {t.schemes}
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild className="justify-start">
              <Link href="/remedies">
                <Leaf className="h-4 w-4 mr-2" />
                {t.remedies}
              </Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="justify-start">
              <LogOut className="h-4 w-4 mr-2" />
              {t.logout}
            </Button>
          </nav>
        </div>
      )}

      {/* Chat Area */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full" ref={scrollRef}>
          <div className="container max-w-4xl py-6">
            <div className="flex flex-col gap-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback
                      className={message.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary"}
                    >
                      {message.role === "user" ? profile?.full_name?.[0] || "U" : "AI"}
                    </AvatarFallback>
                  </Avatar>
                  <Card
                    className={`max-w-[80%] p-4 ${
                      message.role === "user" ? "bg-primary text-primary-foreground" : "bg-card"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    <p
                      className={`text-xs mt-2 ${
                        message.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </Card>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="bg-secondary">AI</AvatarFallback>
                  </Avatar>
                  <Card className="max-w-[80%] p-4 bg-card">
                    <div className="flex gap-1">
                      <div
                        className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      />
                      <div
                        className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      />
                      <div
                        className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Input Area */}
      <div className="border-t bg-background">
        <div className="container max-w-4xl py-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
              // Use the translated placeholder
              placeholder={t.placeholder} 
              className="flex-1"
              disabled={isLoading}
            />
            <Button
              size="icon"
              variant={isListening ? "destructive" : "outline"}
              onClick={handleVoiceInput}
              disabled={isLoading}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Button size="icon" onClick={handleSendMessage} disabled={isLoading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Language:{" "}
            {profile?.preferred_language === "hi"
              ? "Hindi"
              : profile?.preferred_language === "mr"
              ? "Marathi"
              : "English"}
          </p>
        </div>
      </div>
    </div>
  )
}