"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createSolution(data: {
  title: string
  shortText: string
  longText: string
  categorySlug: string
  rankings: {
    impact: number
    urgency: number
    feasibility: number
    affected: number
    costs: number
  }
}) {
  const { title, shortText, longText, categorySlug, rankings } = data

  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
  })

  if (!category) {
    throw new Error(`Kategorie "${categorySlug}" nicht gefunden.`)
  }

  const solution = await prisma.solution.create({
    data: {
      title,
      short_text: shortText,
      long_text: longText,
      categoryId: category.id,
      categoryName: category.name,
      categorySlug: category.slug,
      impact: rankings.impact,
      urgency: rankings.urgency,
      feasibility: rankings.feasibility,
      affected: rankings.affected,
      costs: rankings.costs,
      upvotes: 0,
    },
  })

  revalidatePath("/")
  revalidatePath(`/category/solutions/${categorySlug}`)

  redirect(`/solution/${solution.id}`)
}
