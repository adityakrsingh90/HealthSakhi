import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { RemindersView } from "@/components/reminders-view"

export default async function RemindersPage() {
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

  // Fetch health reminders
  const { data: reminders } = await supabase
    .from("health_reminders")
    .select("*")
    .eq("user_id", user.id)
    .order("due_date", { ascending: true })

  return (
    <div className="flex min-h-screen flex-col">
      <RemindersView user={user} profile={profile} reminders={reminders || []} />
    </div>
  )
}
