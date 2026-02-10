"use server"

import { randomUUID } from "crypto"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

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
}) {
  const { title, shortText, longText, categorySlug, rankings } = data

  // 1. Kategorie finden
  const category = await prisma.category.findUnique({
    where: { slug: categorySlug }
  })

  if (!category) {
    throw new Error(`Kategorie "${categorySlug}" nicht gefunden.`)
  }

  // 2. Problem in DB erstellen (Raw INSERT, damit es auch ohne neu generierten Prisma-Client funktioniert)
  const id = randomUUID()
  const now = new Date()

  const inserted = await prisma.$queryRaw<[{ id: string }]>`
    INSERT INTO "Problem" (
      "id", "createdAt", "updatedAt", "title", "short_text", "long_text",
      "categoryId", "categoryName", "categorySlug", "upvotes",
      "impact", "urgency", "reach"
    )
    VALUES (
      ${id}, ${now}, ${now}, ${title}, ${shortText}, ${longText ?? null},
      ${category.id}, ${category.name}, ${category.slug}, 0,
      ${rankings.impact}, ${rankings.urgency}, ${rankings.reach}
    )
    RETURNING "id"
  `
  const problemId = inserted[0].id

  // 3. Cache aktualisieren
  revalidatePath("/")
  revalidatePath(`/category/problems/${categorySlug}`)

  // 4. Zur Detailseite weiterleiten
  redirect(`/problem/${problemId}`)
}
