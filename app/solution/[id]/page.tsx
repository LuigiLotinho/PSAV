import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowUp, ChevronRight, Link2 } from "lucide-react"
import { Breadcrumbs } from "@/components/site/breadcrumbs"
import { RankingGrid } from "@/components/site/ranking-grid"
import { Badge } from "@/components/ui/badge"
import prisma from "@/lib/prisma"
import { UpvoteButton } from "@/components/site/upvote-button"

type PageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function SolutionDetailPage({ params }: PageProps) {
  const { id } = await params
  const item = await prisma.solution.findUnique({
    where: { id },
  })

  if (!item) {
    notFound()
  }

  const linkedProblems = await prisma.problem.findMany({
    where: { categorySlug: item.categorySlug },
    orderBy: { upvotes: "desc" },
    take: 2,
  })
  const rankings = {
    impact: item.impact,
    urgency: item.urgency,
    feasibility: item.feasibility,
    affected: item.affected,
    costs: item.costs,
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
            { label: "Solutions", href: `/category/solutions/${item.categorySlug}` },
            { label: item.categoryName, href: `/category/solutions/${item.categorySlug}` },
            { label: item.title },
          ]}
        />

        <div className="max-w-3xl space-y-8">
          <section className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2 text-sm text-muted-foreground">
                <Badge variant="secondary">{item.categoryName}</Badge>
                <span>Posted 3 days ago</span>
              </div>
              <h1 className="text-2xl font-bold text-foreground">{item.title}</h1>
            </div>
            <div className="flex flex-col items-center gap-1 rounded-xl bg-muted/50 p-4">
              <UpvoteButton
                type="solution"
                id={item.id}
                className="rounded-lg p-2 hover:bg-background"
                iconClassName="h-6 w-6 text-primary"
              />
              <span className="text-2xl font-bold">{item.upvotes}</span>
              <span className="text-xs text-muted-foreground">votes</span>
            </div>
          </section>

          <section className="rounded-r-lg border-l-4 border-primary bg-primary/5 p-4">
            <p className="text-lg text-foreground">{item.short_text}</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Detailed Description</h2>
            <p className="text-muted-foreground">{item.long_text}</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Rankings (1–10)</h2>
            <RankingGrid rankings={rankings} />
          </section>

          <section className="space-y-4">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <Link2 className="h-5 w-5" />
              Linked Problems ({linkedProblems.length})
            </h2>
            <div className="space-y-3">
              {linkedProblems.map((problem) => (
                <Link
                  key={problem.id}
                  href={`/problem/${problem.id}`}
                  className="block rounded-xl border p-4 transition-colors hover:border-primary"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-center">
                        <ArrowUp className="h-4 w-4 text-primary" />
                        <span className="text-sm font-bold">{problem.upvotes}</span>
                      </div>
                      <div>
                        <p className="font-medium">{problem.title}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">{problem.short_text}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
