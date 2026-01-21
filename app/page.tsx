import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { ItemCard } from "@/components/site/item-card"
import { categories, getTopItems } from "@/lib/mock-data"

export default function HomePage() {
  const topSolutions = getTopItems("solution", 10)
  const topProblems = getTopItems("problem", 10)

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <Link href="/" className="text-xl font-semibold text-foreground">
            Auroville Problem-Solution Platform
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 space-y-12">
        <section className="space-y-3">
          <h1 className="text-3xl font-bold text-foreground">Community Problems & Solutions</h1>
          <p className="text-muted-foreground max-w-3xl">
            Browse the most upvoted solutions and problems across the community. Everything is read-only for now, with
            a calm, focused presentation.
          </p>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h2 className="text-2xl font-semibold">Solution Categories</h2>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Link key={category.id} href={`/category/solutions/${category.slug}`}>
                  <Badge variant="secondary">{category.name}</Badge>
                </Link>
              ))}
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {topSolutions.map((item) => (
              <ItemCard key={item.id} item={item} href={`/solution/${item.id}`} />
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h2 className="text-2xl font-semibold">Problem Categories</h2>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Link key={category.id} href={`/category/problems/${category.slug}`}>
                  <Badge variant="secondary">{category.name}</Badge>
                </Link>
              ))}
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {topProblems.map((item) => (
              <ItemCard key={item.id} item={item} href={`/problem/${item.id}`} />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
