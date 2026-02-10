/**
 * Adds missing ranking columns (affected, costs) to Problem and Solution
 * and removes timeframe if present. Run: npx ts-node prisma/add-affected-costs-columns.ts
 */
require("dotenv/config")
const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

async function main() {
  console.log("Adding affected/costs to Problem and Solution, dropping timeframe if present...")

  // Solution: add affected, costs (default 5); drop timeframe
  await prisma.$executeRawUnsafe(`
    ALTER TABLE "Solution" ADD COLUMN IF NOT EXISTS "affected" INT NOT NULL DEFAULT 5;
  `)
  await prisma.$executeRawUnsafe(`
    ALTER TABLE "Solution" ADD COLUMN IF NOT EXISTS "costs" INT NOT NULL DEFAULT 5;
  `)
  await prisma.$executeRawUnsafe(`
    ALTER TABLE "Solution" DROP COLUMN IF EXISTS "timeframe";
  `)
  console.log("  Solution: affected, costs added; timeframe dropped if present")

  // Problem: add affected, costs (default 5); drop timeframe
  await prisma.$executeRawUnsafe(`
    ALTER TABLE "Problem" ADD COLUMN IF NOT EXISTS "affected" INT NOT NULL DEFAULT 5;
  `)
  await prisma.$executeRawUnsafe(`
    ALTER TABLE "Problem" ADD COLUMN IF NOT EXISTS "costs" INT NOT NULL DEFAULT 5;
  `)
  await prisma.$executeRawUnsafe(`
    ALTER TABLE "Problem" DROP COLUMN IF EXISTS "timeframe";
  `)
  console.log("  Problem: affected, costs added; timeframe dropped if present")

  console.log("Done. DB matches main schema (5 rankings, no timeframe).")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
