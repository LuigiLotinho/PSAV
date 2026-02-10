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
import { createProblem } from "@/app/actions/problem-actions"
import { toast } from "sonner"

const SHORT_MAX = 300
const LONG_MIN = 500
const LONG_MAX = 2500

const rankingConfig = [
  { key: "impact", label: "Impact", description: "How big is the impact if solved?" },
  { key: "urgency", label: "Urgency", description: "How time-sensitive is this problem?" },
  { key: "reach", label: "Reach", description: "How widespread is the problem?" },
] as const

type RankingKey = (typeof rankingConfig)[number]["key"]

type Category = {
  id: string
  name: string
  slug: string
}

export default function NewProblemPage() {
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState<string>("")
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)
  const [shortText, setShortText] = useState("")
  const [longText, setLongText] = useState("")
  const [rankings, setRankings] = useState<Record<RankingKey, number>>({
    impact: 5,
    urgency: 5,
    reach: 5,
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
      await createProblem({
        title,
        shortText,
        longText,
        categorySlug: category,
        rankings
      })
      toast.success("Problem erfolgreich erstellt!")
    } catch (error) {
      if (error && typeof error === "object" && "digest" in error &&
          String((error as { digest?: string }).digest).startsWith("NEXT_REDIRECT")) {
        return
      }
      console.error(error)
      toast.error("Fehler beim Erstellen des Problems.")
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

        <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
          <div className="space-y-3">
            <label className="text-sm font-medium">Title of the Problem *</label>
            <Input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Water shortage in center field"
              disabled={isSubmitting}
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
            <div className="flex items-center justify-between gap-4">
              <label className="text-sm font-medium">Short Description (max 300 chars) *</label>
              <span className="text-xs text-muted-foreground">
                {shortText.length}/{SHORT_MAX}
              </span>
            </div>
            <div className="rounded-lg bg-blue-50 p-3 text-sm dark:bg-blue-950/30">
              <p className="mb-1 font-medium text-blue-700 dark:text-blue-300">Helper questions:</p>
              <ul className="space-y-1 text-xs text-blue-600 dark:text-blue-400">
                <li>• What is the problem?</li>
                <li>• Who is affected?</li>
                <li>• What is the immediate impact?</li>
              </ul>
            </div>
            <Textarea
              value={shortText}
              onChange={(event) => setShortText(event.target.value)}
              placeholder="Brief teaser in 2–3 sentences..."
              maxLength={SHORT_MAX}
              className="min-h-24"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <label className="text-sm font-medium">Detailed Description (min 500, max 2500 chars) *</label>
              <span className="text-xs text-muted-foreground">
                {longText.length}/{LONG_MAX}
              </span>
            </div>
            <div className="rounded-lg bg-blue-50 p-3 text-sm dark:bg-blue-950/30">
              <p className="mb-1 font-medium text-blue-700 dark:text-blue-300">Consider including:</p>
              <ul className="space-y-1 text-xs text-blue-600 dark:text-blue-400">
                <li>• When does it occur, and how often?</li>
                <li>• Who is directly affected by this problem?</li>
                <li>• Who is indirectly affected?</li>
                <li>• Who is most burdened by this problem, and how?</li>
                <li>• What happens if the problem is ignored or minimized?</li>
                <li>• How long has this problem existed?</li>
                <li>• What events, decisions, or structures contributed to it?</li>
                <li>• What are the underlying causes of this problem?</li>
                <li>• How widespread is the problem?</li>
              </ul>
            </div>
            <Textarea
              value={longText}
              onChange={(event) => setLongText(event.target.value)}
              placeholder="Full explanation of the problem..."
              maxLength={LONG_MAX}
              className="min-h-40"
              disabled={isSubmitting}
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
                    disabled={isSubmitting}
                  />
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Problem"}
          </Button>
        </form>
      </main>
    </div>
  )
}
