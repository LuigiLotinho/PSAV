"use server"

import { randomUUID } from "crypto"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

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
}) {
  const { title, shortText, longText, categorySlug, timeframe, rankings } = data

  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
  })

  if (!category) {
    throw new Error(`Kategorie "${categorySlug}" nicht gefunden.`)
  }

  const id = randomUUID()
  const now = new Date()

  const inserted = await prisma.$queryRaw<[{ id: string }]>`
    INSERT INTO "Solution" (
      "id", "createdAt", "updatedAt", "title", "short_text", "long_text",
      "categoryId", "categoryName", "categorySlug", "upvotes",
      "impact", "urgency", "feasibility", "timeframe"
    )
    VALUES (
      ${id}, ${now}, ${now}, ${title}, ${shortText}, ${longText ?? null},
      ${category.id}, ${category.name}, ${category.slug}, 0,
      ${rankings.impact}, ${rankings.urgency}, ${rankings.feasibility},
      ${timeframe}
    )
    RETURNING "id"
  `
  const solutionId = inserted[0].id

  revalidatePath("/")
  revalidatePath(`/category/solutions/${categorySlug}`)

  redirect(`/solution/${solutionId}`)
}
