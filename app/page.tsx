import Link from "next/link"
import { ThreeDPhotoCarousel } from "@/components/ui/3d-carousel"
import prisma from "@/lib/prisma"

export default async function HomePage() {
  const categoryImages: Record<string, string> = {
    health: "/category-images/pexels-feyza-altun-120534393-13006757.jpg",
    education: "/category-images/pexels-brett-sayles-30725518.jpg",
    community: "/category-images/pexels-julia-volk-5769308.jpg",
    environment: "/category-images/pexels-ilham-zovanka-2158121497-35383157.jpg",
    agriculture: "/category-images/pexels-caio-mantovani-97605853-17905810.jpg",
    "water-energy-and-resources": "/category-images/pexels-omar-eltahan-2157926445-35047961.jpg",
    housing: "/category-images/pexels-beardedtexantravels-5034542.jpg",
    infrastructure: "/category-images/pexels-yide-sun-84747826-19446467.jpg",
    mobility: "/category-images/pexels-chatchai-kurmbabpar-2154039831-33085423.jpg",
    technology: "/category-images/pexels-bing-kol-470434409-35232818.jpg",
    economy: "/category-images/economy.jpg",
    organization: "/category-images/pexels-imagevain-6622887.jpg",
    governance: "/category-images/pexels-antonia-spantzel-774939153-18923572.jpg",
  }
  const fallbackImage = "/category-images/pexels-33205297-7042926.jpg"

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  })

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
      <main className="container mx-auto px-4 py-8 md:py-10 space-y-8 md:space-y-12">
        <section className="space-y-2 md:space-y-3 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Community Problems & Solutions</h1>
          <p className="text-muted-foreground max-w-3xl mx-auto text-[12px] md:text-base leading-relaxed">
            Browse the most upvoted problems and solutions across the community.
            <br />
            Contribute and help inspire current and future Working Groups.
          </p>
        </section>

        <section className="space-y-4 md:space-y-4 text-center">
          <h2 className="text-xl md:text-3xl font-semibold text-foreground/90">Solution Categories</h2>
          <ThreeDPhotoCarousel items={solutionCategoryCards} />
        </section>

        <section className="space-y-4 md:space-y-4 text-center">
          <h2 className="text-xl md:text-3xl font-semibold text-foreground/90">Problem Categories</h2>
          <ThreeDPhotoCarousel items={problemCategoryCards} />
        </section>
      </main>
    </div>
  )
}
