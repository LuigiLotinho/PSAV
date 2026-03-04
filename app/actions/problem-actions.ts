"use server"

import { randomUUID } from "crypto"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { isLocale } from "@/lib/i18n/locales"
import { translateProblemContent } from "@/lib/translation"

export async function createProblem(data: {
  title: string
  shortText: string
  longText: string
  categorySlug: string
  rankings: {
    impact: number
    urgency: number
    reach: number
  }
  contentLocale?: string
}) {
  const { title, shortText, longText, categorySlug, rankings, contentLocale = "en" } = data
  const locale = isLocale(contentLocale) ? contentLocale : "en"

  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
  })

  if (!category) {
    throw new Error(`Kategorie "${categorySlug}" nicht gefunden.`)
  }

  let translations: Record<string, { title: string; short_text: string; long_text: string | null }> | null = null
  try {
    translations = await translateProblemContent(
      { title, short_text: shortText, long_text: longText || null },
      locale
    )
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error("[createProblem] Translation failed:", msg, err)
  }

  const id = randomUUID()
  const now = new Date()
  const translationsJson = translations ? JSON.stringify(translations) : null

  await prisma.$executeRaw`
    INSERT INTO "Problem" (
      "id", "createdAt", "updatedAt", "title", "short_text", "long_text",
      "categoryId", "categoryName", "categorySlug", "upvotes",
      "impact", "urgency", "reach", "contentLocale", "translations"
    ) VALUES (
      ${id}, ${now}, ${now}, ${title}, ${shortText}, ${longText ?? null},
      ${category.id}, ${category.name}, ${category.slug}, 0,
      ${rankings.impact}, ${rankings.urgency}, ${rankings.reach},
      ${locale}, ${translationsJson}::jsonb
    )
  `

  // 4. Cache aktualisieren
  revalidatePath("/")
  revalidatePath(`/category/problems/${categorySlug}`)

  // 5. Zur Detailseite weiterleiten
  redirect(`/${locale}/problem/${id}`)
}
