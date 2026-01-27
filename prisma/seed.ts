require("dotenv/config")
const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

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

const categories = categoryNames.map((name, index) => ({
  id: `cat-${index + 1}`,
  name,
  slug: name
    .toLowerCase()
    .replace(/,?\s+&\s+/g, "-")
    .replace(/\s+/g, "-")
    .replace(/,/g, ""),
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

function makeRankings(seed: number) {
  const base = seed % 10
  return {
    impact: ((base + 2) % 10) + 1,
    urgency: ((base + 4) % 10) + 1,
    feasibility: ((base + 6) % 10) + 1,
    affected: ((base + 8) % 10) + 1,
    costs: ((base + 1) % 10) + 1,
  }
}

function makeShortText(type: "problem" | "solution", category: string, index: number) {
  if (type === "problem") {
    return `A recurring ${category.toLowerCase()} issue that needs attention. Item ${index + 1} highlights a specific gap and its impact on daily life.`
  }
  return `A focused ${category.toLowerCase()} solution that can be piloted quickly. Item ${index + 1} outlines practical steps and expected benefits.`
}

function makeLongText(type: "problem" | "solution", category: string, index: number) {
  if (type === "problem") {
    return `This problem describes a recurring challenge in ${category.toLowerCase()} with clear consequences for residents and stakeholders. Item ${index + 1} documents context, symptoms, and why the situation persists. The intent is to provide enough detail for readers to understand the scope and consider viable responses.`
  }
  return `This solution focuses on improving ${category.toLowerCase()} outcomes through a concrete, achievable approach. Item ${index + 1} details the steps, resources, and coordination needed to deliver measurable progress. The intent is to keep the plan realistic while enabling collaboration.`
}

type ItemSeed = {
  id: string
  title: string
  short_text: string
  long_text: string
  categorySlug: string
  categoryName: string
  upvotes: number
  rankings: {
    impact: number
    urgency: number
    feasibility: number
    affected: number
    costs: number
  }
}

function buildItems(type: "problem" | "solution") {
  const items: ItemSeed[] = []
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
        title,
        short_text: makeShortText(type, category.name, i),
        long_text: makeLongText(type, category.name, i),
        categorySlug: category.slug,
        categoryName: category.name,
        upvotes: Math.max(5, baseUpvotes - seed * 2),
        rankings: makeRankings(seed + (type === "solution" ? 3 : 0)),
      })
    }
  })

  return items
}

const problems = buildItems("problem")
const solutions = buildItems("solution")

async function main() {
  await prisma.category.createMany({
    data: categories.map((category) => ({
      name: category.name,
      slug: category.slug,
    })),
    skipDuplicates: true,
  })

  const savedCategories = await prisma.category.findMany()
  const categoryMap = new Map<string, { id: string; name: string; slug: string }>()
  savedCategories.forEach((category: { id: string; name: string; slug: string }) => {
    categoryMap.set(category.slug, { id: category.id, name: category.name, slug: category.slug })
  })

  const problemData = problems
    .map((problem) => {
      const category = categoryMap.get(problem.categorySlug)
      if (!category) return null
      return {
        id: problem.id,
        title: problem.title,
        short_text: problem.short_text,
        long_text: problem.long_text,
        categoryId: category.id,
        categoryName: category.name,
        categorySlug: category.slug,
        upvotes: problem.upvotes,
        impact: problem.rankings.impact,
        urgency: problem.rankings.urgency,
        feasibility: problem.rankings.feasibility,
        affected: problem.rankings.affected,
        costs: problem.rankings.costs,
      }
    })
    .filter(Boolean)

  const solutionData = solutions
    .map((solution) => {
      const category = categoryMap.get(solution.categorySlug)
      if (!category) return null
      return {
        id: solution.id,
        title: solution.title,
        short_text: solution.short_text,
        long_text: solution.long_text,
        categoryId: category.id,
        categoryName: category.name,
        categorySlug: category.slug,
        upvotes: solution.upvotes,
        impact: solution.rankings.impact,
        urgency: solution.rankings.urgency,
        feasibility: solution.rankings.feasibility,
        affected: solution.rankings.affected,
        costs: solution.rankings.costs,
      }
    })
    .filter(Boolean)

  await prisma.problem.createMany({
    data: problemData,
    skipDuplicates: true,
  })

  await prisma.solution.createMany({
    data: solutionData,
    skipDuplicates: true,
  })

  console.log("Categories, problems, and solutions seeded!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
