"use client"

import Link from "next/link"
import { useState } from "react"
import { Breadcrumbs } from "@/components/site/breadcrumbs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { categories } from "@/lib/mock-data"

const SHORT_MAX = 300
const LONG_MAX = 2500

const rankingConfig = [
  { key: "impact", label: "Impact", description: "How big is the impact if solved?" },
  { key: "urgency", label: "Urgency", description: "How time-sensitive is this problem?" },
  { key: "feasibility", label: "Feasibility", description: "How feasible is it to address?" },
  { key: "affected", label: "Affected", description: "How many people are affected?" },
  { key: "costs", label: "Costs", description: "How costly is solving it?" },
] as const

type RankingKey = (typeof rankingConfig)[number]["key"]

export default function NewProblemPage() {
  const [category, setCategory] = useState<string>("")
  const [shortText, setShortText] = useState("")
  const [longText, setLongText] = useState("")
  const [rankings, setRankings] = useState<Record<RankingKey, number>>({
    impact: 5,
    urgency: 5,
    feasibility: 5,
    affected: 5,
    costs: 5,
  })

  function updateRanking(key: RankingKey, value: number) {
    setRankings((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <Link href="/" className="text-xl font-semibold text-foreground">
            Auroville Problem-Solution Platform
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 space-y-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Problems" },
            { label: "New Problem" },
          ]}
        />

        <section className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Submit a Problem</h1>
            <p className="text-muted-foreground">
              Describe the problem clearly and help the community prioritize it.
            </p>
          </div>
          <Badge variant="secondary">Contributor Only</Badge>
        </section>

        <form className="max-w-3xl space-y-8">
          <div className="space-y-3">
            <label className="text-sm font-medium">Category *</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {categories.map((item) => (
                    <SelectItem key={item.id} value={item.slug}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <label className="text-sm font-medium">Short Description (max 300 chars) *</label>
              <span className="text-xs text-muted-foreground">
                {shortText.length}/{SHORT_MAX}
              </span>
            </div>
            {!shortText.trim() && (
              <div className="rounded-lg bg-blue-50 p-3 text-sm dark:bg-blue-950/30">
                <p className="mb-1 font-medium text-blue-700 dark:text-blue-300">Helper questions:</p>
                <ul className="space-y-1 text-xs text-blue-600 dark:text-blue-400">
                  <li>• What is the problem?</li>
                  <li>• Who is affected?</li>
                  <li>• What is the immediate impact?</li>
                </ul>
              </div>
            )}
            <Textarea
              value={shortText}
              onChange={(event) => setShortText(event.target.value)}
              placeholder="Brief teaser in 2–3 sentences..."
              maxLength={SHORT_MAX}
              className="min-h-24"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <label className="text-sm font-medium">Detailed Description (max 2500 chars)</label>
              <span className="text-xs text-muted-foreground">
                {longText.length}/{LONG_MAX}
              </span>
            </div>
            {!longText.trim() && (
              <div className="rounded-lg bg-blue-50 p-3 text-sm dark:bg-blue-950/30">
                <p className="mb-1 font-medium text-blue-700 dark:text-blue-300">Consider including:</p>
                <ul className="space-y-1 text-xs text-blue-600 dark:text-blue-400">
                  <li>• What led to this issue?</li>
                  <li>• Where and how often does it occur?</li>
                  <li>• What happens if nothing changes?</li>
                </ul>
              </div>
            )}
            <Textarea
              value={longText}
              onChange={(event) => setLongText(event.target.value)}
              placeholder="Full explanation of the problem..."
              maxLength={LONG_MAX}
              className="min-h-40"
            />
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold">Rankings (1–10)</h2>
              <p className="text-sm text-muted-foreground">
                These help prioritize which problems need attention first.
              </p>
            </div>

            <div className="space-y-5">
              {rankingConfig.map((item) => (
                <div key={item.key} className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                    <Badge variant="outline">{rankings[item.key]}</Badge>
                  </div>
                  <Slider
                    min={1}
                    max={10}
                    step={1}
                    value={[rankings[item.key]]}
                    onValueChange={(value) => updateRanking(item.key, value[0] ?? 1)}
                  />
                </div>
              ))}
            </div>
          </div>

          <Button type="button" className="w-full">
            Submit Problem
          </Button>
        </form>
      </main>
    </div>
  )
}
