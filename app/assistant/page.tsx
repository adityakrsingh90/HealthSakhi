import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { HealthAssistant } from "@/components/health-assistant"

export default async function AssistantPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Fetch user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return (
    <div className="flex min-h-screen flex-col">
      <HealthAssistant user={user} profile={profile} />
    </div>
  )
}
