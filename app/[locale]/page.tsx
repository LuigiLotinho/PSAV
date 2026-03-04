import Link from "next/link"
import { ThreeDPhotoCarousel } from "@/components/ui/3d-carousel"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/site/language-switcher"
import prisma from "@/lib/prisma"
import { isAdmin } from "@/lib/auth"
import { getTranslations } from "next-intl/server"
import { localePath, type Locale } from "@/lib/i18n/locales"

export const dynamic = "force-dynamic"

const fallbackImage = "/category-images/pexels-33205297-7042926.jpg"

const SLUG_TO_IMAGE: Record<string, string> = {
  infrastructure: "/category-images/pexels-yide-sun-84747826-19446467.jpg",
  justice: "/category-images/pexels-antonia-spantzel-774939153-18923572.jpg",
  health: "/category-images/pexels-feyza-altun-120534393-13006757.jpg",
  media: "/category-images/pexels-bing-kol-470434409-35232818.jpg",
  relations: "/category-images/pexels-julia-volk-5769308.jpg",
  science: "/category-images/pexels-danieljschwarz-34770958.jpg",
  spirituality: "/category-images/pexels-tamara-elnova-218645958-12236732.jpg",
  arts: "/category-images/pexels-jean-pixels-427051121-35405252.jpg",
  "economics-units": "/category-images/economy.jpg",
  "economics-individual": "/category-images/pexels-caio-mantovani-97605853-17905810.jpg",
  "economics-overall": "/category-images/pexels-omar-eltahan-2157926445-35047961.jpg",
  educations: "/category-images/pexels-brett-sayles-30725518.jpg",
  environment: "/category-images/pexels-ilham-zovanka-2158121497-35383157.jpg",
  governance: "/category-images/pexels-chatchai-kurmbabpar-2154039831-33085423.jpg",
  housing: "/category-images/pexels-beardedtexantravels-5034542.jpg",
  other: "/category-images/pexels-imagevain-6622887.jpg",
}

function getCategoryImage(slug: string): string {
  return SLUG_TO_IMAGE[slug] ?? fallbackImage
}

type PageProps = {
  params: Promise<{ locale: Locale }>
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "home" })
  const tCategories = await getTranslations({ locale, namespace: "categories" })
  const tLang = await getTranslations({ locale, namespace: "language" })
  const admin = await isAdmin()
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  })

  const solutionCategoryCards = categories.map((category) => {
    const label = tCategories(category.slug) || category.name
    return {
      id: `solution-${category.id}`,
      title: label,
      categoryName: label,
      href: localePath(locale, `/category/solutions/${category.slug}`),
      imageSrc: getCategoryImage(category.slug),
      imageAlt: `${label} category`,
    }
  })
  const problemCategoryCards = categories.map((category) => {
    const label = tCategories(category.slug) || category.name
    return {
      id: `problem-${category.id}`,
      title: label,
      categoryName: label,
      href: localePath(locale, `/category/problems/${category.slug}`),
      imageSrc: getCategoryImage(category.slug),
      imageAlt: `${label} category`,
    }
  })

  // #region agent log
  if (typeof fetch !== "undefined") {
    const firstSlugs = categories.slice(0, 3).map((c) => c.slug)
    const firstSrcs = solutionCategoryCards.slice(0, 3).map((c) => c.imageSrc)
    fetch("http://127.0.0.1:7804/ingest/5ea61563-ec3a-43cd-a7d9-9a6eae2055cc", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "8d52fc" },
      body: JSON.stringify({
        sessionId: "8d52fc",
        location: "app/[locale]/page.tsx:cards",
        message: "HomePage built cards imageSrc",
        data: {
          categoriesLength: categories.length,
          firstSlugs,
          firstImageSrcs: firstSrcs,
          fallbackImage,
          firstCardKeys: solutionCategoryCards[0] ? Object.keys(solutionCategoryCards[0]) : [],
          firstCardHasImageSrc: Boolean(solutionCategoryCards[0]?.imageSrc),
        },
        timestamp: Date.now(),
        hypothesisId: "H2_H5",
      }),
    }).catch(() => {})
  }
  // #endregion

  return (
    <div className="min-h-screen bg-background overflow-x-hidden max-w-[100vw] w-full">
      <main className="container mx-auto px-4 py-8 md:py-10 space-y-8 md:space-y-12 max-w-full w-full min-w-0">
        <section className="space-y-2 md:space-y-3 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">{t("title")}</h1>
          <p className="text-muted-foreground max-w-3xl mx-auto text-[12px] md:text-base leading-relaxed whitespace-pre-line">
            {t("subtitle")}
          </p>
        </section>

        <section className="space-y-4 md:space-y-4 text-center">
          <h2 className="text-xl md:text-3xl font-semibold text-foreground/90">{t("solutionsTitle")}</h2>
          <ThreeDPhotoCarousel items={solutionCategoryCards} />
        </section>

        <section className="space-y-4 md:space-y-4 text-center">
          <h2 className="text-xl md:text-3xl font-semibold text-foreground/90">{t("problemsTitle")}</h2>
          <ThreeDPhotoCarousel items={problemCategoryCards} />
        </section>

        <LanguageSwitcher currentLocale={locale} label={tLang("label")} />

        <section className="flex flex-col gap-4 justify-center items-center pt-6">
          <Button asChild size="lg" className="w-[300px] h-12 text-base bg-white hover:bg-gray-100 text-black border-2 border-black dark:bg-white dark:hover:bg-gray-100 dark:text-black dark:border-black">
            <Link href={localePath(locale, "/guidelines")}>{t("guidelinesButton")}</Link>
          </Button>
          <Button asChild size="lg" className="w-[300px] h-12 text-base bg-white hover:bg-gray-100 text-black border-2 border-black dark:bg-white dark:hover:bg-gray-100 dark:text-black dark:border-black">
            <Link href={localePath(locale, "/idea-of-the-project")}>{t("ideaButton")}</Link>
          </Button>
          {admin && (
            <Button asChild size="lg" className="w-[300px] h-12 text-base bg-amber-200/60 hover:bg-amber-200/80 text-amber-900 dark:bg-amber-900/30 dark:hover:bg-amber-900/50 dark:text-amber-100">
              <Link href={localePath(locale, "/admin")}>{t("adminButton")}</Link>
            </Button>
          )}
        </section>
      </main>
    </div>
  )
}
