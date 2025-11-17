"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Heart, Menu, LogOut, Calendar, FileText, Home, Search, ExternalLink, CheckCircle2, Leaf } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"

interface Profile {
  id: string
  full_name: string | null
  preferred_language: string
}

interface Scheme {
  id: string
  scheme_name: string
  scheme_name_hi: string | null
  scheme_name_mr: string | null
  description: string
  description_hi: string | null
  description_mr: string | null
  eligibility_criteria: any
  benefits: string
  benefits_hi: string | null
  benefits_mr: string | null
  application_process: string
  application_process_hi: string | null
  application_process_mr: string | null
  official_website: string | null
  state: string | null
  category: string
  active: boolean
}

interface SchemeNavigatorProps {
  user: User
  profile: Profile | null
  schemes: Scheme[]
}

export function SchemeNavigator({ user, profile, schemes }: SchemeNavigatorProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null)
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

  const filteredSchemes = schemes.filter((scheme) => {
    const matchesSearch =
      scheme.scheme_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || scheme.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = [
    { value: "all", label: "All Schemes" },
    { value: "maternal", label: "Maternal Health" },
    { value: "child", label: "Child Health" },
    { value: "nutrition", label: "Nutrition" },
    { value: "financial", label: "Financial Aid" },
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
              <h1 className="text-3xl font-bold tracking-tight text-balance">Government Schemes</h1>
              <p className="text-muted-foreground text-pretty leading-relaxed">
                Discover welfare schemes for maternal and child health. Check eligibility and learn how to apply.
              </p>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search schemes..."
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

            {/* Schemes Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredSchemes.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">No schemes found matching your criteria.</p>
                </div>
              ) : (
                filteredSchemes.map((scheme) => (
                  <Card
                    key={scheme.id}
                    className="cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => setSelectedScheme(scheme)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-lg text-balance">
                          {getLocalizedText(scheme.scheme_name, scheme.scheme_name_hi, scheme.scheme_name_mr)}
                        </CardTitle>
                        <Badge variant="secondary" className="shrink-0">
                          {scheme.category}
                        </Badge>
                      </div>
                      <CardDescription className="text-pretty leading-relaxed line-clamp-2">
                        {getLocalizedText(scheme.description, scheme.description_hi, scheme.description_mr)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {scheme.state ? (
                          <Badge variant="outline">{scheme.state}</Badge>
                        ) : (
                          <Badge variant="outline">Central Scheme</Badge>
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

      {/* Scheme Detail Dialog */}
      <Dialog open={!!selectedScheme} onOpenChange={() => setSelectedScheme(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedScheme && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl text-balance">
                  {getLocalizedText(
                    selectedScheme.scheme_name,
                    selectedScheme.scheme_name_hi,
                    selectedScheme.scheme_name_mr,
                  )}
                </DialogTitle>
                <DialogDescription className="text-pretty leading-relaxed">
                  {getLocalizedText(
                    selectedScheme.description,
                    selectedScheme.description_hi,
                    selectedScheme.description_mr,
                  )}
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col gap-6 mt-4">
                {/* Eligibility */}
                <div className="flex flex-col gap-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    Eligibility Criteria
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(selectedScheme.eligibility_criteria).map(([key, value]) => (
                      <Badge key={key} variant="secondary">
                        {key}: {String(value)}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Benefits */}
                <div className="flex flex-col gap-3">
                  <h3 className="font-semibold">Benefits</h3>
                  <p className="text-sm text-muted-foreground text-pretty leading-relaxed">
                    {getLocalizedText(selectedScheme.benefits, selectedScheme.benefits_hi, selectedScheme.benefits_mr)}
                  </p>
                </div>

                {/* Application Process */}
                <div className="flex flex-col gap-3">
                  <h3 className="font-semibold">How to Apply</h3>
                  <p className="text-sm text-muted-foreground text-pretty leading-relaxed">
                    {getLocalizedText(
                      selectedScheme.application_process,
                      selectedScheme.application_process_hi,
                      selectedScheme.application_process_mr,
                    )}
                  </p>
                </div>

                {/* Official Website */}
                {selectedScheme.official_website && (
                  <Button asChild className="w-full">
                    <a href={selectedScheme.official_website} target="_blank" rel="noopener noreferrer">
                      Visit Official Website
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </a>
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
