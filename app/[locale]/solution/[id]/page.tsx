import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowUp, ChevronRight, Link2 } from "lucide-react"
import { Breadcrumbs } from "@/components/site/breadcrumbs"
import { RankingGrid } from "@/components/site/ranking-grid"
import { Badge } from "@/components/ui/badge"
import prisma from "@/lib/prisma"
import { UpvoteButton } from "@/components/site/upvote-button"
import { VisibilityToggleButton } from "@/components/site/visibility-toggle-button"
import { isAdmin } from "@/lib/auth"
import { getTranslations } from "next-intl/server"
import { localePath, type Locale } from "@/lib/i18n/locales"
import { getLocalizedContent } from "@/lib/translation"

export const dynamic = "force-dynamic"

type PageProps = {
  params: Promise<{ locale: Locale; id: string }>
}

export default async function SolutionDetailPage({ params }: PageProps) {
  const { locale, id } = await params
  const t = await getTranslations({ locale, namespace: "detail" })
  const tSolution = await getTranslations({ locale, namespace: "solution" })
  const tNav = await getTranslations({ locale, namespace: "nav" })
  const tCommon = await getTranslations({ locale, namespace: "common" })
  const admin = await isAdmin()

  const item = await prisma.solution.findUnique({
    where: { id },
    select: {
      id: true,
      createdAt: true,
      updatedAt: true,
      title: true,
      short_text: true,
      long_text: true,
      translations: true,
      categoryId: true,
      categoryName: true,
      categorySlug: true,
      upvotes: true,
      impact: true,
      urgency: true,
      feasibility: true,
      timeframe: true,
      visible: true,
    },
  })

  if (!item) {
    notFound()
  }

  if (!admin && !item.visible) {
    notFound()
  }

  const linkedProblems = await prisma.problem.findMany({
    where: {
      categorySlug: item.categorySlug,
      ...(admin ? {} : { visible: true }),
    },
    orderBy: { upvotes: "desc" },
    take: 2,
    select: {
      id: true,
      title: true,
      short_text: true,
      translations: true,
      upvotes: true,
      visible: true,
    },
  })
  const rankings = {
    impact: item.impact,
    urgency: item.urgency,
    feasibility: item.feasibility,
  }

  const timeframeLabel =
    item.timeframe === "Short Term"
      ? tSolution("timeframeShort")
      : item.timeframe === "Mid Term"
        ? tSolution("timeframeMid")
        : item.timeframe === "Long Term"
          ? tSolution("timeframeLong")
          : item.timeframe

  const localized = getLocalizedContent(item, locale)
  const localizedProblems = linkedProblems.map((p) => ({
    ...p,
    display: getLocalizedContent(p, locale),
  }))

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <Link href={localePath(locale, "/")} className="text-xl font-semibold text-foreground">
            {tCommon("platformTitle")}
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 space-y-8">
        <Breadcrumbs
          items={[
            { label: tNav("home"), href: localePath(locale, "/") },
            { label: tNav("solutions"), href: localePath(locale, `/category/solutions/${item.categorySlug}`) },
            { label: item.categoryName, href: localePath(locale, `/category/solutions/${item.categorySlug}`) },
            { label: localized.title },
          ]}
        />

        <div className="max-w-3xl space-y-8">
          <section className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2 text-sm text-muted-foreground">
                <Badge variant="secondary">{item.categoryName}</Badge>
                {item.timeframe && (
                  <Badge variant="outline">{timeframeLabel}</Badge>
                )}
                <span>{t("postedDaysAgo")}</span>
              </div>
              <h1 className="text-2xl font-bold text-foreground">{localized.title}</h1>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex flex-col items-center gap-1 rounded-xl bg-muted/50 p-4">
                <UpvoteButton
                  type="solution"
                  id={item.id}
                  className="rounded-lg p-2 hover:bg-background"
                  iconClassName="h-6 w-6 text-primary"
                />
                <span className="text-2xl font-bold">{item.upvotes}</span>
                <span className="text-xs text-muted-foreground">{t("votes")}</span>
              </div>
              {admin && (
                <VisibilityToggleButton
                  type="solution"
                  id={item.id}
                  visible={item.visible}
                />
              )}
            </div>
          </section>

          <section className="rounded-r-lg border-l-4 border-primary bg-primary/5 p-4">
            <p className="text-lg text-foreground whitespace-pre-line">{localized.short_text}</p>
          </section>

          {item.timeframe && (
            <section className="space-y-2">
              <h2 className="text-lg font-semibold">{t("timeframeTitle")}</h2>
              <p className="text-muted-foreground">
                {t("timeframeText", { timeframe: timeframeLabel })}
              </p>
            </section>
          )}

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">{t("detailedDescription")}</h2>
            <p className="text-muted-foreground whitespace-pre-line">{localized.long_text}</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold">{t("rankings")}</h2>
            <RankingGrid
            rankings={rankings}
            labels={{
              impact: tSolution("impact"),
              urgency: tSolution("urgency"),
              feasibility: tSolution("feasibility"),
            }}
          />
          </section>

          <section className="space-y-4">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <Link2 className="h-5 w-5" />
              {t("linkedProblems")} ({linkedProblems.length})
            </h2>
            <div className="space-y-3">
              {localizedProblems.map((problem) => (
                <div
                  key={problem.id}
                  className="flex items-center gap-2 rounded-xl border p-4 transition-colors hover:border-primary"
                >
                  <Link
                    href={localePath(locale, `/problem/${problem.id}`)}
                    className="flex-1 flex items-center justify-between gap-4 min-w-0"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-center">
                        <ArrowUp className="h-4 w-4 text-primary" />
                        <span className="text-sm font-bold">{problem.upvotes}</span>
                      </div>
                      <div>
                        <p className="font-medium">{problem.display.title}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">{problem.display.short_text}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                  </Link>
                  {admin && (
                    <VisibilityToggleButton
                      type="problem"
                      id={problem.id}
                      visible={problem.visible}
                    />
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
