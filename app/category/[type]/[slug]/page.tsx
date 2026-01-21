import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronRight, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { getCategoryBySlug, getItemsByCategory, type ItemType } from "@/lib/mock-data"

type PageProps = {
  params: Promise<{
    type: string
    slug: string
  }>
}

function mapType(type: string): ItemType | null {
  if (type === "problems") return "problem"
  if (type === "solutions") return "solution"
  return null
}

export default async function CategoryPage({ params }: PageProps) {
  const { type, slug } = await params
  const itemType = mapType(type)
  const category = getCategoryBySlug(slug)

  if (!itemType || !category) {
    notFound()
  }

  const items = getItemsByCategory(itemType, category.slug)
  const title = itemType === "problem" ? "Problems" : "Solutions"
  const categoryTitle = `${category.name} ${title}`
  const itemCountLabel = `${items.length} ${title.toLowerCase()} in this category`
  const accent =
    itemType === "problem"
      ? "bg-orange-500/20 text-orange-500"
      : "bg-primary/20 text-primary"
  const accentSolid = itemType === "problem" ? "bg-orange-500/50" : "bg-primary/50"

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-10 space-y-8">
        <nav className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Home
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
            <Link
              href={itemType === "problem" ? "/problem/new" : "/solution/new"}
              className="mt-4 inline-flex px-4 py-2 rounded-lg border border-transparent bg-muted text-foreground text-sm font-medium hover:bg-muted/80 transition-colors"
            >
              {itemType === "problem" ? "New Problem" : "New Solution"}
            </Link>
          </div>
        </section>

        <section className="flex items-center justify-between flex-wrap gap-3 border-b pb-4">
          <div className="flex items-center gap-3 text-sm">
            <span className="font-medium text-foreground">Sort by:</span>
            <button className="px-3 py-1 rounded bg-primary text-primary-foreground text-sm">Most Voted</button>
            <button className="px-3 py-1 rounded border text-sm">Newest</button>
            <button className="px-3 py-1 rounded border text-sm">Most Urgent</button>
          </div>
          <span className="text-sm text-muted-foreground">Showing {items.length} items</span>
        </section>

        <section className="space-y-4">
          {items.map((item) => (
            <Link
              key={item.id}
              href={itemType === "problem" ? `/problem/${item.id}` : `/solution/${item.id}`}
              className="group block border rounded-xl p-4 bg-background hover:border-primary transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center gap-1 min-w-[60px]">
                  <button
                    type="button"
                    className="p-2 rounded-lg bg-sky-50 text-sky-500 hover:bg-sky-100"
                    aria-label="Upvote"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                  <span className="text-xl font-bold">{item.upvotes}</span>
                  <span className="text-xs text-muted-foreground">upvotes</span>
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{item.short_text}</p>
                </div>

                <ChevronRight className="h-5 w-5 text-muted-foreground mt-4" />
              </div>
            </Link>
          ))}
        </section>

      </main>
    </div>
  )
}
