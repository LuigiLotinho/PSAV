require("dotenv/config")
const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

async function main() {
  const deletedSolutions = await prisma.solution.deleteMany({})
  const deletedProblems = await prisma.problem.deleteMany({})
  const deletedCategories = await prisma.category.deleteMany({})
  console.log(
    `Gelöscht: ${deletedSolutions.count} Lösungen, ${deletedProblems.count} Probleme, ${deletedCategories.count} Kategorien.`
  )
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
