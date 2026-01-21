import Link from "next/link"
import { ThreeDPhotoCarousel } from "@/components/ui/3d-carousel"
import { categories } from "@/lib/mock-data"

export default function HomePage() {
  const solutionCategoryCards = categories.map((category) => ({
    id: `solution-${category.id}`,
    title: category.name,
    categoryName: category.name,
    href: `/category/solutions/${category.slug}`,
  }))
  const problemCategoryCards = categories.map((category) => ({
    id: `problem-${category.id}`,
    title: category.name,
    categoryName: category.name,
    href: `/category/problems/${category.slug}`,
  }))

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6 text-center">
          <Link href="/" className="text-xl font-semibold text-foreground">
            Auroville Problem-Solution Platform
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 space-y-12">
        <section className="space-y-3 text-center">
          <h1 className="text-3xl font-bold text-foreground">Community Problems & Solutions</h1>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Browse the most upvoted solutions and problems across the community.
          </p>
        </section>

        <section className="space-y-4 text-center">
          <h2 className="text-2xl font-semibold">Solution Categories</h2>
          <ThreeDPhotoCarousel items={solutionCategoryCards} />
        </section>

        <section className="space-y-4 text-center">
          <h2 className="text-2xl font-semibold">Problem Categories</h2>
          <ThreeDPhotoCarousel items={problemCategoryCards} />
        </section>
      </main>
    </div>
  )
}
