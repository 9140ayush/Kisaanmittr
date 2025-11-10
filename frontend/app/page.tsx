"use client"

import Link from "next/link"
import { ArrowRight, Leaf, Zap, Brain } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Card } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="border-b border-border px-4 py-12 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-4xl">
          <div className="space-y-6 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Generate Agricultural Reports with AI
            </h1>
            <p className="text-lg text-muted-foreground sm:text-xl">
              Create comprehensive crop reports in minutes. Select items, add your data, and let AI polish your content.
            </p>
            <div className="flex justify-center gap-4 pt-4">
              <Link href="/report">
                <Button size="lg" className="gap-2">
                  Start Report
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-12 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-foreground">How It Works</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="flex flex-col items-center gap-4 p-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Leaf className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Select Items</h3>
              <p className="text-sm text-muted-foreground">
                Choose the report items you need from our predefined list of agricultural content.
              </p>
            </Card>

            <Card className="flex flex-col items-center gap-4 p-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                <Zap className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Enter Data</h3>
              <p className="text-sm text-muted-foreground">
                Add your farm data, observations, and notes using our intuitive editor.
              </p>
            </Card>

            <Card className="flex flex-col items-center gap-4 p-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">AI Polish</h3>
              <p className="text-sm text-muted-foreground">
                Our AI reviews and enhances your content for professional, comprehensive reports.
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
