/**
 * One-time script: migrates Solution from single category to many-to-many categories.
 * Run with: npx ts-node prisma/run-solution-categories-migration.ts
 */
const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

const statements: string[] = [
  `CREATE TABLE "_CategoryToSolution" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
  )`,
  `INSERT INTO "_CategoryToSolution" ("A", "B")
   SELECT "categoryId", "id" FROM "Solution" WHERE "categoryId" IS NOT NULL`,
  `CREATE UNIQUE INDEX "_CategoryToSolution_AB_unique" ON "_CategoryToSolution"("A", "B")`,
  `CREATE INDEX "_CategoryToSolution_B_index" ON "_CategoryToSolution"("B")`,
  `ALTER TABLE "_CategoryToSolution" ADD CONSTRAINT "_CategoryToSolution_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
  `ALTER TABLE "_CategoryToSolution" ADD CONSTRAINT "_CategoryToSolution_B_fkey" FOREIGN KEY ("B") REFERENCES "Solution"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
  `ALTER TABLE "Solution" DROP COLUMN IF EXISTS "categoryId"`,
  `ALTER TABLE "Solution" DROP COLUMN IF EXISTS "categoryName"`,
  `ALTER TABLE "Solution" DROP COLUMN IF EXISTS "categorySlug"`,
]

async function main() {
  console.log("Running Solution -> categories migration...")

  for (let i = 0; i < statements.length; i++) {
    try {
      await prisma.$executeRawUnsafe(statements[i])
      console.log(`  OK (${i + 1}/${statements.length})`)
    } catch (e: unknown) {
      const err = e as { code?: string; message?: string }
      const alreadyExists =
        err.code === "42P07" || err.code === "42710" || (err.message?.includes("already exists") ?? false)
      if (alreadyExists) {
        console.log(`  Skip (${i + 1}/${statements.length}) - already exists`)
      } else {
        console.error("  Error at statement", i + 1, ":", err.message ?? err)
        throw e
      }
    }
  }

  console.log("Migration done.")
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e)
    prisma.$disconnect()
    process.exit(1)
  })
