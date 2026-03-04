/**
 * Löscht alle Problems und Solutions aus der Datenbank.
 * Run: npm run cleanup-all-items
 */

require("dotenv").config()
require("dotenv").config({ path: ".env.local", override: true })

const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

async function main() {
  // Erst Relationen löschen (many-to-many), dann die Einträge
  const deletedProblems = await prisma.problem.deleteMany({})
  const deletedSolutions = await prisma.solution.deleteMany({})

  console.log(`✓ Deleted ${deletedProblems.count} problems`)
  console.log(`✓ Deleted ${deletedSolutions.count} solutions`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
