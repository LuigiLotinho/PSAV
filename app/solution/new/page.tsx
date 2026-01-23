"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { Link2, Search } from "lucide-react"
import { Breadcrumbs } from "@/components/site/breadcrumbs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { problems } from "@/lib/mock-data"

const SHORT_MAX = 300
const LONG_MAX = 2500
const IMPROVEMENTS_MAX = 500

export default function NewSolutionPage() {
  const [shortText, setShortText] = useState("")
  const [longText, setLongText] = useState("")
  const [improvements, setImprovements] = useState("")
  const [query, setQuery] = useState("")
  const [selectedProblemIds, setSelectedProblemIds] = useState<string[]>([])

  const filteredProblems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    const base = problems.slice(0, 40)
    if (!normalizedQuery) {
      return base
    }
    return base.filter(
      (problem) =>
        problem.title.toLowerCase().includes(normalizedQuery) ||
        problem.categoryName.toLowerCase().includes(normalizedQuery),
    )
  }, [query])

  const selectedProblems = useMemo(
    () =>
      selectedProblemIds
        .map((id) => problems.find((problem) => problem.id === id))
        .filter(Boolean),
    [selectedProblemIds],
  )

  function toggleProblem(id: string) {
    setSelectedProblemIds((prev) =>
      prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id],
    )
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
              Share a solution idea and link it to one or more existing problems.
            </p>
          </div>
          <Badge variant="secondary">Contributor Only</Badge>
        </section>

        <form className="max-w-3xl space-y-8">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <label className="text-sm font-medium">Short Description (max 300 chars) *</label>
              <span className="text-xs text-muted-foreground">
                {shortText.length}/{SHORT_MAX}
              </span>
            </div>
            {!shortText.trim() && (
              <div className="rounded-lg bg-green-50 p-3 text-sm dark:bg-green-950/30">
                <p className="mb-1 font-medium text-green-700 dark:text-green-300">Helper questions:</p>
                <ul className="space-y-1 text-xs text-green-600 dark:text-green-400">
                  <li>• What is your proposed solution?</li>
                  <li>• How does it address the problem(s)?</li>
                  <li>• What makes this approach effective?</li>
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
              <div className="rounded-lg bg-green-50 p-3 text-sm dark:bg-green-950/30">
                <p className="mb-1 font-medium text-green-700 dark:text-green-300">Consider including:</p>
                <ul className="space-y-1 text-xs text-green-600 dark:text-green-400">
                  <li>• What are the implementation steps?</li>
                  <li>• What resources/skills are needed?</li>
                  <li>• What is the estimated timeline?</li>
                  <li>• Are there similar solutions that worked elsewhere?</li>
                </ul>
              </div>
            )}
            <Textarea
              value={longText}
              onChange={(event) => setLongText(event.target.value)}
              placeholder="Full explanation of the solution..."
              maxLength={LONG_MAX}
              className="min-h-40"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <label className="text-sm font-medium">Improvements & Comments (max 500 chars)</label>
              <span className="text-xs text-muted-foreground">
                {improvements.length}/{IMPROVEMENTS_MAX}
              </span>
            </div>
            {!improvements.trim() && (
              <div className="rounded-lg bg-green-50 p-3 text-sm dark:bg-green-950/30">
                <p className="mb-1 font-medium text-green-700 dark:text-green-300">Consider:</p>
                <ul className="space-y-1 text-xs text-green-600 dark:text-green-400">
                  <li>• What limitations does this solution have?</li>
                  <li>• How could it be scaled or improved?</li>
                  <li>• What risks should be considered?</li>
                </ul>
              </div>
            )}
            <Textarea
              value={improvements}
              onChange={(event) => setImprovements(event.target.value)}
              placeholder="How could this solution be improved?"
              maxLength={IMPROVEMENTS_MAX}
              className="min-h-20"
            />
          </div>

          <div className="rounded-lg border border-dashed bg-muted/30 p-4 text-sm text-muted-foreground">
            Note: Solution rankings will be available in a later version (currently disabled for MVP).
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Link to Problems (many-to-many)</label>
              <p className="text-xs text-muted-foreground">
                Solutions can be linked to multiple problems.
              </p>
            </div>

            <div className="rounded-xl border bg-card p-4 space-y-4">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search and select problems to link..."
                />
              </div>

              {selectedProblems.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedProblems.map((problem) => (
                    <Badge key={problem.id} variant="secondary">
                      {problem.title}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="space-y-3">
                {filteredProblems.slice(0, 6).map((problem) => {
                  const isSelected = selectedProblemIds.includes(problem.id)
                  return (
                    <label
                      key={problem.id}
                      className="flex items-start gap-3 rounded-lg border p-3 transition-colors hover:border-primary"
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleProblem(problem.id)}
                        aria-label={`Link problem ${problem.title}`}
                      />
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-foreground">{problem.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {problem.categoryName} · {problem.upvotes} upvotes
                        </p>
                      </div>
                    </label>
                  )
                })}
              </div>

              {filteredProblems.length === 0 && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Link2 className="h-4 w-4" />
                  <span>No problems match your search.</span>
                </div>
              )}
            </div>
          </div>

          <Button type="button" className="w-full">
            Submit Solution
          </Button>
        </form>
      </main>
    </div>
  )
}
