"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Heart, Menu, LogOut, Calendar, FileText, Home, Plus, CheckCircle2, Clock, Leaf } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"

interface Profile {
  id: string
  full_name: string | null
  preferred_language: string
}

interface Reminder {
  id: string
  child_name: string
  child_dob: string
  reminder_type: string
  reminder_title: string
  reminder_description: string | null
  due_date: string
  completed: boolean
  completed_at: string | null
}

interface RemindersViewProps {
  user: User
  profile: Profile | null
  reminders: Reminder[]
}

export function RemindersView({ user, profile, reminders: initialReminders }: RemindersViewProps) {
  const [reminders, setReminders] = useState(initialReminders)
  const [showMenu, setShowMenu] = useState(false)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const [newReminder, setNewReminder] = useState({
    childName: "",
    childDob: "",
    reminderType: "vaccination",
    reminderTitle: "",
    reminderDescription: "",
    dueDate: "",
  })

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const handleAddReminder = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from("health_reminders")
        .insert({
          user_id: user.id,
          child_name: newReminder.childName,
          child_dob: newReminder.childDob,
          reminder_type: newReminder.reminderType,
          reminder_title: newReminder.reminderTitle,
          reminder_description: newReminder.reminderDescription,
          due_date: newReminder.dueDate,
        })
        .select()
        .single()

      if (error) throw error

      setReminders([...reminders, data])
      setShowAddDialog(false)
      setNewReminder({
        childName: "",
        childDob: "",
        reminderType: "vaccination",
        reminderTitle: "",
        reminderDescription: "",
        dueDate: "",
      })
      router.refresh()
    } catch (error) {
      console.error("[v0] Error adding reminder:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCompleteReminder = async (reminderId: string) => {
    try {
      const { error } = await supabase
        .from("health_reminders")
        .update({ completed: true, completed_at: new Date().toISOString() })
        .eq("id", reminderId)

      if (error) throw error

      setReminders(reminders.map((r) => (r.id === reminderId ? { ...r, completed: true } : r)))
      router.refresh()
    } catch (error) {
      console.error("[v0] Error completing reminder:", error)
    }
  }

  const upcomingReminders = reminders.filter((r) => !r.completed && new Date(r.due_date) >= new Date())
  const overdueReminders = reminders.filter((r) => !r.completed && new Date(r.due_date) < new Date())
  const completedReminders = reminders.filter((r) => r.completed)

  return (
    <div className="flex min-h-screen flex-col">
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
                  Assistant
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/reminders">
                  <Calendar className="h-4 w-4 mr-2" />
                  Reminders
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/schemes">
                  <FileText className="h-4 w-4 mr-2" />
                  Schemes
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/remedies">
                  <Leaf className="h-4 w-4 mr-2" />
                  Remedies
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
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
                Assistant
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild className="justify-start">
              <Link href="/reminders">
                <Calendar className="h-4 w-4 mr-2" />
                Reminders
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild className="justify-start">
              <Link href="/schemes">
                <FileText className="h-4 w-4 mr-2" />
                Schemes
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild className="justify-start">
              <Link href="/remedies">
                <Leaf className="h-4 w-4 mr-2" />
                Remedies
              </Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="justify-start">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1">
        <div className="container py-8">
          <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-balance">Health Reminders</h1>
                <p className="text-muted-foreground text-pretty leading-relaxed">
                  Track vaccinations, checkups, and health milestones
                </p>
              </div>
              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Reminder
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Health Reminder</DialogTitle>
                    <DialogDescription>
                      Create a new reminder for vaccinations, checkups, or milestones
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col gap-4 mt-4">
                    <div className="grid gap-2">
                      <Label htmlFor="childName">Child Name</Label>
                      <Input
                        id="childName"
                        value={newReminder.childName}
                        onChange={(e) => setNewReminder({ ...newReminder, childName: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="childDob">Child Date of Birth</Label>
                      <Input
                        id="childDob"
                        type="date"
                        value={newReminder.childDob}
                        onChange={(e) => setNewReminder({ ...newReminder, childDob: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="reminderType">Reminder Type</Label>
                      <Select
                        value={newReminder.reminderType}
                        onValueChange={(value) => setNewReminder({ ...newReminder, reminderType: value })}
                      >
                        <SelectTrigger id="reminderType">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="vaccination">Vaccination</SelectItem>
                          <SelectItem value="checkup">Checkup</SelectItem>
                          <SelectItem value="nutrition">Nutrition</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="reminderTitle">Title</Label>
                      <Input
                        id="reminderTitle"
                        value={newReminder.reminderTitle}
                        onChange={(e) => setNewReminder({ ...newReminder, reminderTitle: e.target.value })}
                        placeholder="e.g., BCG Vaccination"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="reminderDescription">Description (Optional)</Label>
                      <Textarea
                        id="reminderDescription"
                        value={newReminder.reminderDescription}
                        onChange={(e) => setNewReminder({ ...newReminder, reminderDescription: e.target.value })}
                        placeholder="Additional notes..."
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="dueDate">Due Date</Label>
                      <Input
                        id="dueDate"
                        type="date"
                        value={newReminder.dueDate}
                        onChange={(e) => setNewReminder({ ...newReminder, dueDate: e.target.value })}
                      />
                    </div>
                    <Button onClick={handleAddReminder} disabled={isLoading}>
                      {isLoading ? "Adding..." : "Add Reminder"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Overdue Reminders */}
            {overdueReminders.length > 0 && (
              <div className="flex flex-col gap-3">
                <h2 className="text-xl font-semibold text-destructive">Overdue</h2>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {overdueReminders.map((reminder) => (
                    <Card key={reminder.id} className="border-destructive">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-base text-balance">{reminder.reminder_title}</CardTitle>
                          <Badge variant="destructive">{reminder.reminder_type}</Badge>
                        </div>
                        <CardDescription>
                          {reminder.child_name} • Due: {new Date(reminder.due_date).toLocaleDateString()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {reminder.reminder_description && (
                          <p className="text-sm text-muted-foreground mb-3">{reminder.reminder_description}</p>
                        )}
                        <Button size="sm" onClick={() => handleCompleteReminder(reminder.id)} className="w-full">
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Mark Complete
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Upcoming Reminders */}
            {upcomingReminders.length > 0 && (
              <div className="flex flex-col gap-3">
                <h2 className="text-xl font-semibold">Upcoming</h2>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {upcomingReminders.map((reminder) => (
                    <Card key={reminder.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-base text-balance">{reminder.reminder_title}</CardTitle>
                          <Badge variant="secondary">{reminder.reminder_type}</Badge>
                        </div>
                        <CardDescription>
                          {reminder.child_name} • Due: {new Date(reminder.due_date).toLocaleDateString()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {reminder.reminder_description && (
                          <p className="text-sm text-muted-foreground mb-3">{reminder.reminder_description}</p>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCompleteReminder(reminder.id)}
                          className="w-full"
                        >
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Mark Complete
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Completed Reminders */}
            {completedReminders.length > 0 && (
              <div className="flex flex-col gap-3">
                <h2 className="text-xl font-semibold text-muted-foreground">Completed</h2>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {completedReminders.map((reminder) => (
                    <Card key={reminder.id} className="opacity-60">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-base text-balance">{reminder.reminder_title}</CardTitle>
                          <Badge variant="outline">{reminder.reminder_type}</Badge>
                        </div>
                        <CardDescription>
                          {reminder.child_name} • Completed:{" "}
                          {reminder.completed_at ? new Date(reminder.completed_at).toLocaleDateString() : "N/A"}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {reminders.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No reminders yet</h3>
                <p className="text-muted-foreground mb-4">Add your first health reminder to get started</p>
                <Button onClick={() => setShowAddDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Reminder
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
