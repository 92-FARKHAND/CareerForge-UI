"use client";

import Link from "next/link";
import {
  Sparkles,
  Radar,
  Layers,
  Binary,
  ClipboardCheck,
  Briefcase,
  Check,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

const features = [
  {
    icon: Radar,
    title: "Compatibility analysis",
    description:
      "Upload your resume and a target role — get a match score with a skills radar and a plain-English gap report.",
  },
  {
    icon: Layers,
    title: "Learn OOP",
    description:
      "Work through classes, interfaces, and design patterns with short modules built around real examples, not slides.",
  },
  {
    icon: Binary,
    title: "Learn DSA",
    description:
      "Practice arrays, trees, and graphs with problems that adjust to what you got wrong last time.",
  },
  {
    icon: ClipboardCheck,
    title: "Assessments",
    description:
      "Timed, role-specific tests with instant scoring, so you know exactly where you stand before an interview does.",
  },
  {
    icon: Briefcase,
    title: "Find jobs",
    description:
      "Listings ranked by your compatibility score first, not by how recently they were posted.",
  },
];

const steps = [
  {
    number: "01",
    title: "Add your resume",
    description:
      "Upload it once. We read your skills, experience, and gaps automatically.",
  },
  {
    number: "02",
    title: "See your match score",
    description:
      "Pick a target role and get a compatibility breakdown across skills, projects, and experience.",
  },
  {
    number: "03",
    title: "Close the gaps",
    description:
      "Follow a study path built from what's actually missing — OOP, DSA, or specific tools.",
  },
  {
    number: "04",
    title: "Apply with confidence",
    description:
      "Track applications and walk into interviews knowing your score, not guessing at it.",
  },
];

const skills = [
  {
    label: "React",
    value: 92,
  },
  {
    label: "System Design",
    value: 68,
  },
  {
    label: "DSA",
    value: 74,
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </span>

            <span className="text-[15px] font-semibold tracking-tight">
              CareerForge AI
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            <a
              href="#features"
              className="transition-colors hover:text-foreground"
            >
              Features
            </a>

            <a
              href="#how-it-works"
              className="transition-colors hover:text-foreground"
            >
              How it works
            </a>

            <a
              href="#pricing"
              className="transition-colors hover:text-foreground"
            >
              Pricing
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />

            <Button
              variant="ghost"
              
              className="hidden sm:inline-flex"
            >
              <Link href="/login">Log in</Link>
            </Button>

            <Button variant="default" >
              <Link href="/register">Get started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto grid w-full max-w-6xl items-center gap-12 px-6 pb-20 pt-16 md:grid-cols-2 md:pt-24">
        <div>
          {/* Badge */}
          <Badge
            variant="secondary"
            className="mb-5 rounded-full px-3 py-1"
          >
            <span className="mr-2 h-1.5 w-1.5 rounded-full bg-primary" />
            AI-powered career readiness
          </Badge>

          {/* Heading */}
          <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
            Know exactly what stands between you and the job you want.
          </h1>

          {/* Description */}
          <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
            CareerForge AI scores your resume against real roles, shows the
            specific gaps, and builds a study path to close them — before you
            apply, not after you&apos;re rejected.
          </p>

          {/* Hero buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button size="lg" variant="default" >
              <Link href="/register">
                Get your compatibility score
              </Link>
            </Button>

            <Button size="lg" variant="outline" >
              <a href="#how-it-works">
                See how it works
              </a>
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-primary" />
              Free to start
            </span>

            <span className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-primary" />
              No credit card
            </span>
          </div>
        </div>

        {/* Product Preview */}
        <Card className="shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between border-b">
            <span className="text-sm font-medium text-muted-foreground">
              Compatibility Analysis
            </span>

            <Badge variant="secondary">
              Live
            </Badge>
          </CardHeader>

          <CardContent className="p-5">
            <div className="flex items-center gap-6 py-1">
              {/* Score */}
              <div className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-primary">
                <div className="flex h-20 w-20 flex-col items-center justify-center rounded-full bg-background">
                  <span className="text-2xl font-semibold">
                    87%
                  </span>

                  <span className="text-[10px] text-muted-foreground">
                    Match
                  </span>
                </div>
              </div>

              {/* Skills */}
              <div className="flex-1 space-y-4">
                {skills.map((skill) => (
                  <div key={skill.label} className="space-y-1.5">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{skill.label}</span>
                      <span>{skill.value}%</span>
                    </div>

                    <Progress value={skill.value} />
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendation */}
            <Card className="mt-6 bg-secondary text-secondary-foreground">
              <CardContent className="p-4">
                <p className="text-xs opacity-70">
                  Recommended next step
                </p>

                <p className="mt-1 text-sm font-medium">
                  Strengthen System Design — 3 modules, ~2 hrs
                </p>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </section>

      {/* Features */}
      <section
        id="features"
        className="border-y bg-muted/40 py-20"
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-lg">
            <h2 className="text-3xl font-semibold tracking-tight">
              Everything between &quot;applying&quot; and &quot;hired.&quot;
            </h2>

            <p className="mt-3 text-muted-foreground">
              Five tools that work off the same score, so your prep is never
              disconnected from the roles you&apos;re actually going for.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <Card
                  key={feature.title}
                  className="transition-shadow hover:shadow-md"
                >
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                      <Icon className="h-5 w-5 text-primary-foreground" />
                    </div>

                    <h3 className="text-base font-semibold">
                      {feature.title}
                    </h3>

                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="bg-background py-20"
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-lg">
            <h2 className="text-3xl font-semibold tracking-tight">
              From resume to ready in four steps.
            </h2>

            <p className="mt-3 text-muted-foreground">
              A simple workflow that turns your current skills into a focused
              preparation plan.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <Card key={step.number}>
                <CardContent className="p-6">
                  <Badge variant="default">
                    {step.number}
                  </Badge>

                  <h3 className="mt-4 text-base font-semibold">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-primary py-20 text-primary-foreground">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-semibold tracking-tight">
            See your compatibility score in under two minutes.
          </h2>

          <p className="mt-3 opacity-80">
            Upload a resume, pick a role, get the gap report. No setup.
          </p>

          <div className="mt-8">
            <Button
              size="lg"
              variant="primaryBorder"
              
            >
              <Link href="/register">
                Create your free account
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-muted-foreground sm:flex-row">
          <span>© 2026 CareerForge AI</span>

          <div className="flex gap-2">
            <Button variant="ghost" size="sm" >
              <a href="#features">Features</a>
            </Button>

            <Button variant="ghost" size="sm" >
              <Link href="/login">Log in</Link>
            </Button>

            <Button variant="ghost" size="sm" >
              <Link href="/register">Sign up</Link>
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
