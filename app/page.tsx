import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Calendar, FileText, MessageCircle, Shield, Languages } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold text-balance">HealthSakhi</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="#features"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="#about"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/sign-up">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b">
        <div className="container py-16 md:py-24 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="flex flex-col gap-6">
              <div className="inline-flex items-center gap-2 rounded-full border bg-secondary px-3 py-1 text-sm w-fit">
                <Shield className="h-4 w-4 text-primary" />
                <span className="text-balance">Trusted Health Information</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl md:text-6xl lg:text-7xl">
                Your Community Health Companion
              </h1>
              <p className="text-lg text-muted-foreground text-pretty leading-relaxed max-w-2xl">
                Supporting mothers and families with personalized health reminders, government scheme guidance, and
                trusted home remedies — all in your language.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" asChild className="text-base">
                  <Link href="/auth/sign-up">Start Your Journey</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="text-base bg-transparent">
                  <Link href="#how-it-works">Learn More</Link>
                </Button>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Languages className="h-4 w-4" />
                  <span>Available in Hindi, Marathi & English</span>
                </div>
              </div>
            </div>
            <div className="relative aspect-square lg:aspect-auto lg:h-[500px]">
              <img
                src="/indian-mother-holding-baby-with-warm-sunset-backgr.jpg"
                alt="Mother and child representing community health"
                className="rounded-2xl object-cover w-full h-full shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 border-b">
        <div className="container">
          <div className="flex flex-col items-center gap-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-5xl">
              Everything You Need for Family Health
            </h2>
            <p className="text-lg text-muted-foreground text-pretty max-w-2xl leading-relaxed">
              Comprehensive support for maternal and child health, powered by AI and trusted medical knowledge.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="flex flex-col gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-balance">Health Reminders</h3>
                <p className="text-muted-foreground text-pretty leading-relaxed">
                  Never miss vaccination schedules, prenatal checkups, or nutrition milestones with personalized
                  reminders.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="flex flex-col gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-balance">Government Schemes</h3>
                <p className="text-muted-foreground text-pretty leading-relaxed">
                  Discover and apply for maternal and child welfare schemes like PMMVY, JSY, and state-specific
                  benefits.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="flex flex-col gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-balance">Trusted Home Remedies</h3>
                <p className="text-muted-foreground text-pretty leading-relaxed">
                  Access WHO-approved home remedies for common ailments, combating misinformation with verified
                  knowledge.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="flex flex-col gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <MessageCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-balance">Voice & Text Assistant</h3>
                <p className="text-muted-foreground text-pretty leading-relaxed">
                  Chat or speak in your preferred language - our AI assistant understands and responds naturally.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="flex flex-col gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Languages className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-balance">Multilingual Support</h3>
                <p className="text-muted-foreground text-pretty leading-relaxed">
                  Full support for Hindi, Marathi, and English - breaking language barriers in healthcare access.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="flex flex-col gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-balance">Privacy First</h3>
                <p className="text-muted-foreground text-pretty leading-relaxed">
                  Your health data is encrypted and secure. We never share your personal information without consent.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 md:py-24 bg-secondary/30 border-b">
        <div className="container">
          <div className="flex flex-col items-center gap-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-5xl">
              Simple Steps to Better Health
            </h2>
            <p className="text-lg text-muted-foreground text-pretty max-w-2xl leading-relaxed">
              Get started in minutes and access personalized health support immediately.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-balance">Sign Up & Set Preferences</h3>
              <p className="text-muted-foreground text-pretty leading-relaxed">
                Create your account and choose your preferred language. Add your child's details for personalized
                reminders.
              </p>
            </div>
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-balance">Ask Questions Anytime</h3>
              <p className="text-muted-foreground text-pretty leading-relaxed">
                Use voice or text to ask about health concerns, government schemes, or home remedies in your language.
              </p>
            </div>
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-balance">Get Trusted Guidance</h3>
              <p className="text-muted-foreground text-pretty leading-relaxed">
                Receive verified information, timely reminders, and step-by-step guidance for your family's health
                journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 border-b">
        <div className="container">
          <div className="flex flex-col items-center gap-6 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-5xl">
              Ready to Support Your Family's Health?
            </h2>
            <p className="text-lg text-muted-foreground text-pretty leading-relaxed">
              Join thousands of mothers who trust HealthSakhi for reliable health information and support.
            </p>
            <Button size="lg" asChild className="text-base">
              <Link href="/auth/sign-up">Get Started Free</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">HealthSakhi</span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Empowering communities with trusted health information
            </p>
            <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} HealthSakhi. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
