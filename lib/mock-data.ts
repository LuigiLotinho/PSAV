import { slugify } from "./slug"

export type ItemType = "problem" | "solution"

export type Rankings = {
  impact: number
  urgency: number
  feasibility: number
  affected: number
  costs: number
}

export type Category = {
  id: string
  name: string
  slug: string
}

export type Item = {
  id: string
  type: ItemType
  title: string
  short_text: string
  long_text: string
  categoryId: string
  categoryName: string
  categorySlug: string
  upvotes: number
  rankings: Rankings
}

const categoryNames = [
  "Health",
  "Education",
  "Community",
  "Environment",
  "Agriculture",
  "Water, Energy & Resources",
  "Housing",
  "Infrastructure",
  "Mobility",
  "Technology",
  "Economy",
  "Organization",
  "Governance",
]

export const categories: Category[] = categoryNames.map((name, index) => ({
  id: `cat-${index + 1}`,
  name,
  slug: slugify(name),
}))

const problemTitleSeeds = [
  "Service gaps",
  "Capacity constraints",
  "Process delays",
  "Maintenance backlog",
  "Access inequality",
  "Quality inconsistencies",
  "Coordination friction",
  "Resource shortages",
  "Information silos",
  "Reliability concerns",
]

const solutionTitleSeeds = [
  "Community-led initiative",
  "Shared resource model",
  "Preventive maintenance plan",
  "Training and skills program",
  "Transparency dashboard",
  "Process simplification",
  "Collaborative working group",
  "Local sourcing strategy",
  "Digital automation",
  "Feedback and improvement loop",
]

function makeRankings(seed: number): Rankings {
  const base = seed % 10
  return {
    impact: ((base + 2) % 10) + 1,
    urgency: ((base + 4) % 10) + 1,
    feasibility: ((base + 6) % 10) + 1,
    affected: ((base + 8) % 10) + 1,
    costs: ((base + 1) % 10) + 1,
  }
}

function makeShortText(type: ItemType, category: string, index: number) {
  if (type === "problem") {
    return `A recurring ${category.toLowerCase()} issue that needs attention. Item ${index + 1} highlights a specific gap and its impact on daily life.`
  }
  return `A focused ${category.toLowerCase()} solution that can be piloted quickly. Item ${index + 1} outlines practical steps and expected benefits.`
}

function makeLongText(type: ItemType, category: string, index: number) {
  if (type === "problem") {
    return `This problem describes a recurring challenge in ${category.toLowerCase()} with clear consequences for residents and stakeholders. Item ${index + 1} documents context, symptoms, and why the situation persists. The intent is to provide enough detail for readers to understand the scope and consider viable responses.`
  }
  return `This solution focuses on improving ${category.toLowerCase()} outcomes through a concrete, achievable approach. Item ${index + 1} details the steps, resources, and coordination needed to deliver measurable progress. The intent is to keep the plan realistic while enabling collaboration.`
}

function buildItems(type: ItemType): Item[] {
  const items: Item[] = []
  const titleSeeds = type === "problem" ? problemTitleSeeds : solutionTitleSeeds
  const baseUpvotes = type === "solution" ? 240 : 200

  categories.forEach((category, categoryIndex) => {
    for (let i = 0; i < 10; i += 1) {
      const seed = categoryIndex * 10 + i
      const titleSeed = titleSeeds[i % titleSeeds.length]
      const title =
        type === "problem"
          ? `${titleSeed} in ${category.name}`
          : `${titleSeed} for ${category.name}`

      items.push({
        id: `${type}-${category.slug}-${i + 1}`,
        type,
        title,
        short_text: makeShortText(type, category.name, i),
        long_text: makeLongText(type, category.name, i),
        categoryId: category.id,
        categoryName: category.name,
        categorySlug: category.slug,
        upvotes: Math.max(5, baseUpvotes - seed * 2),
        rankings: makeRankings(seed + (type === "solution" ? 3 : 0)),
      })
    }
  })

  return items
}

export const problems: Item[] = buildItems("problem")
export const solutions: Item[] = buildItems("solution")

export function getCategoryBySlug(slug: string) {
  return categories.find((category) => category.slug === slug)
}

export function getTopItems(type: ItemType, limit = 10) {
  const data = type === "problem" ? problems : solutions
  return [...data].sort((a, b) => b.upvotes - a.upvotes).slice(0, limit)
}

export function getItemsByCategory(type: ItemType, categorySlug: string) {
  const data = type === "problem" ? problems : solutions
  return data.filter((item) => item.categorySlug === categorySlug).sort((a, b) => b.upvotes - a.upvotes)
}

export function getItemById(type: ItemType, id: string) {
  const data = type === "problem" ? problems : solutions
  return data.find((item) => item.id === id)
}
