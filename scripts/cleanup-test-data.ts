/**
 * Entfernt Test-Einträge aus Problems und Solutions.
 * Run: npm run cleanup-test-data
 */

require("dotenv").config()
require("dotenv").config({ path: ".env.local", override: true })

const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

// Titel, die als Test erkannt werden (exakt oder teilweise)
const TEST_PATTERNS = [
  /^test$/i,
  /^asdf/i,
  /^asdfsad$/i,
  /^iuhkljh$/i,
  /^hvgjhgjkh$/i,
  /^qwerty/i,
  /^foobar/i,
  /^lorem$/i,
  /^abc$/i,
  /^xyz$/i,
  /^sample$/i,
  /^demo$/i,
  /^example$/i,
]

function isTestTitle(title: string): boolean {
  const t = title?.trim() || ""
  if (t.length < 4) return true // Sehr kurze Einträge wie "ab", "xy"
  return TEST_PATTERNS.some((p) => p.test(t))
}

async function main() {
  const problems = await prisma.problem.findMany({ select: { id: true, title: true } })
  const solutions = await prisma.solution.findMany({ select: { id: true, title: true } })

  const problemsToDelete = problems.filter((p: { id: string; title: string }) => isTestTitle(p.title))
  const solutionsToDelete = solutions.filter((s: { id: string; title: string }) => isTestTitle(s.title))

  console.log("Problems to delete:", problemsToDelete.map((p: { title: string }) => p.title).join(", ") || "(none)")
  console.log("Solutions to delete:", solutionsToDelete.map((s: { title: string }) => s.title).join(", ") || "(none)")

  if (problemsToDelete.length > 0) {
    await prisma.problem.deleteMany({
      where: { id: { in: problemsToDelete.map((p: { id: string }) => p.id) } },
    })
    console.log(`✓ Deleted ${problemsToDelete.length} test problems`)
  }

  if (solutionsToDelete.length > 0) {
    await prisma.solution.deleteMany({
      where: { id: { in: solutionsToDelete.map((s: { id: string }) => s.id) } },
    })
    console.log(`✓ Deleted ${solutionsToDelete.length} test solutions`)
  }

  if (problemsToDelete.length === 0 && solutionsToDelete.length === 0) {
    console.log("No test entries found.")
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
