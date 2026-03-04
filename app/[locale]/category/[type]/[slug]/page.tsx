import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import prisma from "@/lib/prisma"
import { UpvoteButton } from "@/components/site/upvote-button"
import { VisibilityToggleButton } from "@/components/site/visibility-toggle-button"
import { isAdmin } from "@/lib/auth"
import { getTranslations } from "next-intl/server"
import { localePath, type Locale } from "@/lib/i18n/locales"
import { getLocalizedContent } from "@/lib/translation"

type PageProps = {
  params: Promise<{ locale: Locale; type: string; slug: string }>
  searchParams?: Promise<{ sort?: string; q?: string }>
}

export const dynamic = "force-dynamic"

type ItemType = "problem" | "solution"

function mapType(type: string): ItemType | null {
  if (type === "problems") return "problem"
  if (type === "solutions") return "solution"
  return null
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { locale, type, slug } = await params
  const resolvedSearchParams = searchParams ? await searchParams : undefined
  const itemType = mapType(type)
  const category = await prisma.category.findUnique({
    where: { slug },
  })

  if (!itemType || !category) {
    notFound()
  }

  const t = await getTranslations({ locale, namespace: "category" })
  const tNav = await getTranslations({ locale, namespace: "nav" })
  const tDetail = await getTranslations({ locale, namespace: "detail" })
  const admin = await isAdmin()

  const sort = resolvedSearchParams?.sort ?? "most-voted"
  const query = resolvedSearchParams?.q?.trim()
  const orderBy =
    sort === "newest"
      ? { createdAt: "desc" }
      : sort === "most-urgent"
        ? { urgency: "desc" }
        : { upvotes: "desc" }

  const whereBaseProblem = {
    categorySlug: category.slug,
    ...(admin ? {} : { visible: true }),
    ...(query
      ? {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { short_text: { contains: query, mode: "insensitive" } },
          ],
        }
      : {}),
  }

  const whereBaseSolution = {
    categorySlug: category.slug,
    ...(admin ? {} : { visible: true }),
    ...(query
      ? {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { short_text: { contains: query, mode: "insensitive" } },
          ],
        }
      : {}),
  }

  const items =
    itemType === "problem"
      ? await prisma.problem.findMany({
          where: whereBaseProblem,
          orderBy,
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
            visible: true,
          },
        })
      : await prisma.solution.findMany({
          where: whereBaseSolution,
          orderBy,
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
            visible: true,
          },
        })

  const title = itemType === "problem" ? t("problems") : t("solutions")
  const categoryTitle = `${category.name} ${title}`
  const itemCountLabel =
    itemType === "problem"
      ? t("problemsInCategory", { count: items.length })
      : t("solutionsInCategory", { count: items.length })
  const accent =
    itemType === "problem"
      ? "bg-orange-500/20 text-orange-500"
      : "bg-primary/20 text-primary"
  const accentSolid = itemType === "problem" ? "bg-orange-500/50" : "bg-primary/50"

  const baseUrl = localePath(locale, `/category/${type}/${slug}`)
  const querySuffix = query ? `&q=${encodeURIComponent(query)}` : ""

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-10 space-y-8">
        <nav className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Link href={localePath(locale, "/")} className="hover:text-foreground">
            {tNav("home")}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">{categoryTitle}</span>
        </nav>

        <section className="flex items-center gap-4">
          <div className={`h-16 w-16 rounded-xl ${accent} flex items-center justify-center`}>
            <div className={`h-8 w-8 rounded-lg ${accentSolid}`} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{categoryTitle}</h1>
            <p className="text-muted-foreground">{itemCountLabel}</p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Link
                href={localePath(locale, itemType === "problem" ? "/problem/new" : "/solution/new")}
                className="inline-flex px-4 py-2 rounded-lg border border-transparent bg-muted text-foreground text-sm font-medium hover:bg-muted/80 transition-colors"
              >
                {itemType === "problem" ? t("newProblem") : t("newSolution")}
              </Link>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-between flex-wrap gap-3 border-b pb-4">
          <div className="flex items-center gap-3 text-sm">
            <span className="font-medium text-foreground">{t("sortBy")}</span>
            <Link
              href={`${baseUrl}?sort=most-voted${querySuffix}`}
              className={`px-3 py-1 rounded text-sm ${sort === "most-voted" ? "bg-primary text-primary-foreground" : "border"}`}
            >
              {t("mostVoted")}
            </Link>
            <Link
              href={`${baseUrl}?sort=newest${querySuffix}`}
              className={`px-3 py-1 rounded text-sm ${sort === "newest" ? "bg-primary text-primary-foreground" : "border"}`}
            >
              {t("newest")}
            </Link>
            <Link
              href={`${baseUrl}?sort=most-urgent${querySuffix}`}
              className={`px-3 py-1 rounded text-sm ${sort === "most-urgent" ? "bg-primary text-primary-foreground" : "border"}`}
            >
              {t("mostUrgent")}
            </Link>
          </div>
          <span className="text-sm text-muted-foreground">
            {t("showingItems", { count: items.length })}
          </span>
        </section>
        <section className="flex items-center justify-between flex-wrap gap-3">
          <form method="get" className="flex w-full max-w-md items-center gap-2">
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder={t("searchPlaceholder", { type: title.toLowerCase() })}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
            <input type="hidden" name="sort" value={sort} />
            <button className="px-3 py-2 rounded border text-sm">{t("searchButton")}</button>
          </form>
          {query ? (
            <Link
              href={`${baseUrl}?sort=${sort}`}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {t("clearSearch")}
            </Link>
          ) : null}
        </section>

        <section className="space-y-4">
          {items.map((item) => {
            const localized = getLocalizedContent(item, locale)
            return (
            <div
              key={item.id}
              className="group flex items-start gap-2 border rounded-xl p-4 bg-background hover:border-primary transition-colors"
            >
              <Link
                href={localePath(locale, itemType === "problem" ? `/problem/${item.id}` : `/solution/${item.id}`)}
                className="flex-1 flex items-start gap-4 min-w-0"
              >
                <div className="flex flex-col items-center gap-1 min-w-[60px]">
                  <UpvoteButton
                    type={itemType}
                    id={item.id}
                    className="rounded-lg bg-sky-50 text-sky-500 hover:bg-sky-100"
                    iconClassName="h-5 w-5 text-sky-500"
                  />
                  <span className="text-xl font-bold">{item.upvotes}</span>
                  <span className="text-xs text-muted-foreground">{tDetail("upvotes")}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg mb-1">{localized.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{localized.short_text}</p>
                </div>

                <ChevronRight className="h-5 w-5 text-muted-foreground mt-4 shrink-0" />
              </Link>
              {admin && (
                <VisibilityToggleButton
                  type={itemType}
                  id={item.id}
                  visible={item.visible}
                />
              )}
            </div>
            )
          })}
        </section>
      </main>
    </div>
  )
}
