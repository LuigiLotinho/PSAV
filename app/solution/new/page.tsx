"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Breadcrumbs } from "@/components/site/breadcrumbs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { createSolution } from "@/app/actions/solution-actions"
import { toast } from "sonner"

const SHORT_MAX = 300
const LONG_MIN = 500
const LONG_MAX = 2500

const TIMEFRAME_OPTIONS = ["Short Term", "Mid Term", "Long Term"] as const
type Timeframe = (typeof TIMEFRAME_OPTIONS)[number]

const rankingConfig = [
  { key: "impact", label: "Impact", description: "How big is the impact if implemented?" },
  { key: "urgency", label: "Urgency", description: "How time-sensitive is this solution?" },
  { key: "feasibility", label: "Feasibility", description: "How feasible is it to implement?" },
] as const

type RankingKey = (typeof rankingConfig)[number]["key"]

type Category = {
  id: string
  name: string
  slug: string
}

export default function NewSolutionPage() {
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState<string>("")
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)
  const [shortText, setShortText] = useState("")
  const [longText, setLongText] = useState("")
  const [timeframe, setTimeframe] = useState<Timeframe>("Mid Term")
  const [rankings, setRankings] = useState<Record<RankingKey, number>>({
    impact: 5,
    urgency: 5,
    feasibility: 5,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  function updateRanking(key: RankingKey, value: number) {
    setRankings((prev) => ({ ...prev, [key]: value }))
  }

  useEffect(() => {
    let isMounted = true
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data: Category[]) => {
        if (isMounted) setCategories(data)
      })
      .catch(() => {
        toast.error("Kategorien konnten nicht geladen werden.")
      })
      .finally(() => {
        if (isMounted) setIsLoadingCategories(false)
      })
    return () => {
      isMounted = false
    }
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!title.trim() || !category || !shortText.trim()) {
      toast.error("Bitte Titel, Kategorie und Kurzbeschreibung ausfüllen.")
      return
    }
    if (longText.trim().length < LONG_MIN) {
      toast.warning(
        `At least ${LONG_MIN} characters required for the detailed description. ${LONG_MIN - longText.trim().length} more needed.`,
        { duration: 2000 }
      )
      return
    }

    setIsSubmitting(true)
    try {
      await createSolution({
        title,
        shortText,
        longText,
        categorySlug: category,
        timeframe,
        rankings,
      })
      toast.success("Lösung erfolgreich erstellt!")
    } catch (error) {
      if (error && typeof error === "object" && "digest" in error &&
          String((error as { digest?: string }).digest).startsWith("NEXT_REDIRECT")) {
        return
      }
      console.error(error)
      toast.error("Fehler beim Erstellen der Lösung.")
    } finally {
      setIsSubmitting(false)
    }
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
            { label: "Solutions" },
            { label: "New Solution" },
          ]}
        />

        <section className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Submit a Solution</h1>
            <p className="text-muted-foreground">
              Describe your solution clearly and help the community evaluate it.
            </p>
          </div>
          <Badge variant="secondary">Contributor Only</Badge>
        </section>

        <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
          <div className="space-y-3">
            <label className="text-sm font-medium">Title of the Problem *</label>
            <Input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Solar powered water pumps for center field"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">Category *</label>
            <Select
              value={category}
              onValueChange={setCategory}
              disabled={isSubmitting || isLoadingCategories}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={isLoadingCategories ? "Loading categories..." : "Select a category"}
                />
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
            <label className="text-sm font-medium">When does this solution have its final impact? *</label>
            <Select
              value={timeframe}
              onValueChange={(v) => setTimeframe(v as Timeframe)}
              disabled={isSubmitting}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {TIMEFRAME_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
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
            <div className="rounded-lg bg-green-50 p-3 text-sm dark:bg-green-950/30">
              <p className="mb-1 font-medium text-green-700 dark:text-green-300">Helper questions:</p>
              <ul className="space-y-1 text-xs text-green-600 dark:text-green-400">
                <li>• What is the solution?</li>
                <li>• How does it work?</li>
                <li>• What are the main benefits?</li>
              </ul>
            </div>
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
              <label className="text-sm font-medium">Detailed Description (min 500, max 2500 chars) *</label>
              <span className="text-xs text-muted-foreground">
                {longText.length}/{LONG_MAX}
              </span>
            </div>
            <div className="rounded-lg bg-green-50 p-3 text-sm dark:bg-green-950/30">
              <p className="mb-1 font-medium text-green-700 dark:text-green-300">Consider including:</p>
              <ul className="space-y-1 text-xs text-green-600 dark:text-green-400">
                <li>• How does the solution actually work, step by step, in daily reality?</li>
                <li>• What changes compared to the current situation?</li>
                <li>• Who benefits directly?</li>
                <li>• Who benefits indirectly?</li>
                <li>• What resources (people, budget, materials) are needed?</li>
                <li>• How do you measure success?</li>
                <li>• How is long-term sustainability ensured?</li>
                <li>• What materials, infrastructure, or technology are required?</li>
                <li>• What is the expected timeline from idea to implementation?</li>
                <li>• Who do you think should do this?</li>
                <li>• What values or principles of Auroville does this solution align with?</li>
              </ul>
            </div>
            <Textarea
              value={longText}
              onChange={(event) => setLongText(event.target.value)}
              placeholder="Full explanation of the solution..."
              maxLength={LONG_MAX}
              className="min-h-40"
            />
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold">Rankings (1–10)</h2>
              <p className="text-sm text-muted-foreground">
                These help the community evaluate the potential of the solution.
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

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Solution"}
          </Button>
        </form>
      </main>
    </div>
  )
}
