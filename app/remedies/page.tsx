import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { RemediesView } from "@/components/remedies-view"

export default async function RemediesPage() {
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

  // Fetch all home remedies
  const { data: remedies } = await supabase.from("home_remedies").select("*").order("category")

  return (
    <div className="flex min-h-screen flex-col">
      <RemediesView user={user} profile={profile} remedies={remedies || []} />
    </div>
  )
}
