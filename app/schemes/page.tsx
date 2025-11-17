import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { SchemeNavigator } from "@/components/scheme-navigator"

export default async function SchemesPage() {
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

  // Fetch all active schemes
  const { data: schemes } = await supabase.from("government_schemes").select("*").eq("active", true).order("category")

  return (
    <div className="flex min-h-screen flex-col">
      <SchemeNavigator user={user} profile={profile} schemes={schemes || []} />
    </div>
  )
}
