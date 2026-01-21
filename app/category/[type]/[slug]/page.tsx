import Link from "next/link"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Breadcrumbs } from "@/components/site/breadcrumbs"
import { ItemCard } from "@/components/site/item-card"
import { getCategoryBySlug, getItemsByCategory, type ItemType } from "@/lib/mock-data"

type PageProps = {
  params: {
    type: string
    slug: string
  }
}

function mapType(type: string): ItemType | null {
  if (type === "problems") return "problem"
  if (type === "solutions") return "solution"
  return null
}

export default function CategoryPage({ params }: PageProps) {
  const itemType = mapType(params.type)
  const category = getCategoryBySlug(params.slug)

  if (!itemType || !category) {
    notFound()
  }

  const items = getItemsByCategory(itemType, category.slug)
  const title = itemType === "problem" ? "Problems" : "Solutions"

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
            { label: title, href: `/category/${params.type}/${category.slug}` },
            { label: category.name },
          ]}
        />

        <section className="space-y-2">
          <h1 className="text-3xl font-bold">{category.name}</h1>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Badge variant="secondary">{title}</Badge>
            <span>{items.length} items</span>
          </div>
        </section>

        <section className="flex items-center justify-between flex-wrap gap-3 border-b pb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Sort by:</span>
            <Badge variant="secondary">Most Voted</Badge>
          </div>
          <span className="text-sm text-muted-foreground">Showing top {items.length}</span>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              href={itemType === "problem" ? `/problem/${item.id}` : `/solution/${item.id}`}
            />
          ))}
        </section>
      </main>
    </div>
  )
}
