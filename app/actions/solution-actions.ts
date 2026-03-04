"use server"

import { randomUUID } from "crypto"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { isLocale } from "@/lib/i18n/locales"
import { translateSolutionContent } from "@/lib/translation"

export async function createSolution(data: {
  title: string
  shortText: string
  longText: string
  categorySlug: string
  timeframe: "Short Term" | "Mid Term" | "Long Term"
  rankings: {
    impact: number
    urgency: number
    feasibility: number
  }
  contentLocale?: string
}) {
  const { title, shortText, longText, categorySlug, timeframe, rankings, contentLocale = "en" } = data
  const locale = isLocale(contentLocale) ? contentLocale : "en"

  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
  })

  if (!category) {
    throw new Error(`Kategorie "${categorySlug}" nicht gefunden.`)
  }

  let translations: Record<string, { title: string; short_text: string; long_text: string | null }> | null = null
  try {
    translations = await translateSolutionContent(
      { title, short_text: shortText, long_text: longText || null },
      locale
    )
  } catch (err) {
    console.warn("Translation failed, saving without translations:", err)
  }

  const id = randomUUID()
  const now = new Date()
  const translationsJson = translations ? JSON.stringify(translations) : null

  await prisma.$executeRaw`
    INSERT INTO "Solution" (
      "id", "createdAt", "updatedAt", "title", "short_text", "long_text",
      "categoryId", "categoryName", "categorySlug", "upvotes",
      "impact", "urgency", "feasibility", "timeframe", "contentLocale", "translations"
    ) VALUES (
      ${id}, ${now}, ${now}, ${title}, ${shortText}, ${longText ?? null},
      ${category.id}, ${category.name}, ${category.slug}, 0,
      ${rankings.impact}, ${rankings.urgency}, ${rankings.feasibility}, ${timeframe},
      ${locale}, ${translationsJson}::jsonb
    )
  `

  revalidatePath("/")
  revalidatePath(`/category/solutions/${categorySlug}`)

  redirect(`/${locale}/solution/${id}`)
}
