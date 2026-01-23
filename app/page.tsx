import Link from "next/link"
import { ThreeDPhotoCarousel } from "@/components/ui/3d-carousel"
import { categories } from "@/lib/mock-data"

export default function HomePage() {
  const categoryImages: Record<string, string> = {
    health: "/category-images/pexels-feyza-altun-120534393-13006757.webp",
    education: "/category-images/pexels-brett-sayles-30725518.webp",
    community: "/category-images/pexels-julia-volk-5769308.webp",
    environment: "/category-images/pexels-ilham-zovanka-2158121497-35383157.webp",
    agriculture: "/category-images/pexels-caio-mantovani-97605853-17905810.webp",
    "water-energy-and-resources": "/category-images/pexels-omar-eltahan-2157926445-35047961.webp",
    housing: "/category-images/pexels-beardedtexantravels-5034542.webp",
    infrastructure: "/category-images/pexels-yide-sun-84747826-19446467.webp",
    mobility: "/category-images/pexels-chatchai-kurmbabpar-2154039831-33085423.webp",
    technology: "/category-images/pexels-bing-kol-470434409-35232818.webp",
    economy: "/category-images/economy.webp",
    organization: "/category-images/pexels-imagevain-6622887.webp",
    governance: "/category-images/pexels-antonia-spantzel-774939153-18923572.webp",
  }
  const fallbackImage = "/category-images/pexels-33205297-7042926.webp"

  const solutionCategoryCards = categories.map((category) => ({
    id: `solution-${category.id}`,
    title: category.name,
    categoryName: category.name,
    href: `/category/solutions/${category.slug}`,
    imageSrc: categoryImages[category.slug] ?? fallbackImage,
    imageAlt: `${category.name} category`,
  }))
  const problemCategoryCards = categories.map((category) => ({
    id: `problem-${category.id}`,
    title: category.name,
    categoryName: category.name,
    href: `/category/problems/${category.slug}`,
    imageSrc: categoryImages[category.slug] ?? fallbackImage,
    imageAlt: `${category.name} category`,
  }))

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 md:py-6 text-center">
          <Link href="/" className="text-xl font-semibold text-foreground">
            Auroville Problem-Solution Platform
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4 md:py-10 space-y-4 md:space-y-12">
        <section className="space-y-1 md:space-y-3 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Community Problems & Solutions</h1>
          <p className="text-muted-foreground max-w-3xl mx-auto text-sm md:text-base">
            Browse the most upvoted solutions and problems across the community.
          </p>
        </section>

        <section className="space-y-1 md:space-y-4 text-center">
          <h2 className="text-xl md:text-3xl font-semibold">Solution Categories</h2>
          <ThreeDPhotoCarousel items={solutionCategoryCards} />
        </section>

        <section className="space-y-1 md:space-y-4 text-center">
          <h2 className="text-xl md:text-3xl font-semibold">Problem Categories</h2>
          <ThreeDPhotoCarousel items={problemCategoryCards} />
        </section>
      </main>
    </div>
  )
}
