"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Heart,
  Menu,
  LogOut,
  Calendar,
  FileText,
  Home,
  Search,
  ShieldCheck,
  AlertTriangle,
  Leaf,
  Baby,
} from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"

interface Profile {
  id: string
  full_name: string | null
  preferred_language: string
}

interface Remedy {
  id: string
  condition_name: string
  condition_name_hi: string | null
  condition_name_mr: string | null
  symptoms: string
  symptoms_hi: string | null
  symptoms_mr: string | null
  remedy_description: string
  remedy_description_hi: string | null
  remedy_description_mr: string | null
  ingredients: any
  preparation_steps: string
  preparation_steps_hi: string | null
  preparation_steps_mr: string | null
  precautions: string | null
  precautions_hi: string | null
  precautions_mr: string | null
  who_approved: boolean
  age_group: string | null
  category: string
}

interface RemediesViewProps {
  user: User
  profile: Profile | null
  remedies: Remedy[]
}

export function RemediesView({ user, profile, remedies }: RemediesViewProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedRemedy, setSelectedRemedy] = useState<Remedy | null>(null)
  const [showMenu, setShowMenu] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const getLocalizedText = (en: string, hi: string | null, mr: string | null) => {
    if (profile?.preferred_language === "hi" && hi) return hi
    if (profile?.preferred_language === "mr" && mr) return mr
    return en
  }

  const filteredRemedies = remedies.filter((remedy) => {
    const matchesSearch =
      remedy.condition_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      remedy.symptoms.toLowerCase().includes(searchQuery.toLowerCase()) ||
      remedy.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || remedy.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = [
    { value: "all", label: "All Remedies" },
    { value: "cold", label: "Cold & Flu" },
    { value: "fever", label: "Fever" },
    { value: "digestion", label: "Digestion" },
    { value: "skin", label: "Skin Care" },
  ]

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
            <div className="flex flex-col gap-4">
              <h1 className="text-3xl font-bold tracking-tight text-balance">Trusted Home Remedies</h1>
              <p className="text-muted-foreground text-pretty leading-relaxed">
                WHO-approved natural remedies for common ailments. Always consult a doctor for serious symptoms.
              </p>
            </div>

            {/* Important Notice */}
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-pretty leading-relaxed">
                These remedies are for mild conditions only. If symptoms persist or worsen, please consult a healthcare
                professional immediately.
              </AlertDescription>
            </Alert>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by condition or symptoms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Category Tabs */}
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList className="w-full justify-start overflow-x-auto">
                {categories.map((category) => (
                  <TabsTrigger key={category.value} value={category.value}>
                    {category.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            {/* Remedies Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredRemedies.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">No remedies found matching your criteria.</p>
                </div>
              ) : (
                filteredRemedies.map((remedy) => (
                  <Card
                    key={remedy.id}
                    className="cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => setSelectedRemedy(remedy)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-lg text-balance">
                          {getLocalizedText(remedy.condition_name, remedy.condition_name_hi, remedy.condition_name_mr)}
                        </CardTitle>
                        <div className="flex flex-col gap-1 shrink-0">
                          <Badge variant="secondary" className="text-xs">
                            {remedy.category}
                          </Badge>
                          {remedy.who_approved && (
                            <Badge variant="default" className="text-xs">
                              <ShieldCheck className="h-3 w-3 mr-1" />
                              WHO
                            </Badge>
                          )}
                        </div>
                      </div>
                      <CardDescription className="text-pretty leading-relaxed">
                        <span className="font-medium">Symptoms:</span>{" "}
                        {getLocalizedText(remedy.symptoms, remedy.symptoms_hi, remedy.symptoms_mr)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {remedy.age_group && (
                          <Badge variant="outline" className="text-xs">
                            <Baby className="h-3 w-3 mr-1" />
                            {remedy.age_group}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Remedy Detail Dialog */}
      <Dialog open={!!selectedRemedy} onOpenChange={() => setSelectedRemedy(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedRemedy && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between gap-3">
                  <DialogTitle className="text-2xl text-balance">
                    {getLocalizedText(
                      selectedRemedy.condition_name,
                      selectedRemedy.condition_name_hi,
                      selectedRemedy.condition_name_mr,
                    )}
                  </DialogTitle>
                  {selectedRemedy.who_approved && (
                    <Badge variant="default">
                      <ShieldCheck className="h-4 w-4 mr-1" />
                      WHO Approved
                    </Badge>
                  )}
                </div>
                <DialogDescription className="text-pretty leading-relaxed">
                  <span className="font-medium">Symptoms:</span>{" "}
                  {getLocalizedText(selectedRemedy.symptoms, selectedRemedy.symptoms_hi, selectedRemedy.symptoms_mr)}
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col gap-6 mt-4">
                {/* Remedy Description */}
                <div className="flex flex-col gap-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Leaf className="h-5 w-5 text-primary" />
                    Remedy
                  </h3>
                  <p className="text-sm text-muted-foreground text-pretty leading-relaxed">
                    {getLocalizedText(
                      selectedRemedy.remedy_description,
                      selectedRemedy.remedy_description_hi,
                      selectedRemedy.remedy_description_mr,
                    )}
                  </p>
                </div>

                {/* Ingredients */}
                {selectedRemedy.ingredients && Array.isArray(selectedRemedy.ingredients) && (
                  <div className="flex flex-col gap-3">
                    <h3 className="font-semibold">Ingredients</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedRemedy.ingredients.map((ingredient: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {ingredient}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Preparation Steps */}
                <div className="flex flex-col gap-3">
                  <h3 className="font-semibold">How to Prepare</h3>
                  <p className="text-sm text-muted-foreground text-pretty leading-relaxed whitespace-pre-line">
                    {getLocalizedText(
                      selectedRemedy.preparation_steps,
                      selectedRemedy.preparation_steps_hi,
                      selectedRemedy.preparation_steps_mr,
                    )}
                  </p>
                </div>

                {/* Precautions */}
                {selectedRemedy.precautions && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-pretty leading-relaxed">
                      <span className="font-semibold">Precautions:</span>{" "}
                      {getLocalizedText(
                        selectedRemedy.precautions,
                        selectedRemedy.precautions_hi,
                        selectedRemedy.precautions_mr,
                      )}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Age Group */}
                {selectedRemedy.age_group && (
                  <div className="flex items-center gap-2 text-sm">
                    <Baby className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Suitable for: <span className="font-medium text-foreground">{selectedRemedy.age_group}</span>
                    </span>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
