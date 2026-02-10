/**
 * Reverts the "solution_multiple_categories" migration:
 * - Adds categoryId, categoryName, categorySlug back to Solution
 * - Copies one category per solution from _CategoryToSolution
 * - Drops _CategoryToSolution
 * Run: npx ts-node prisma/revert-solution-categories-migration.ts
 */
require("dotenv/config")
const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

async function main() {
  console.log("Reverting Solution -> single category (restore main schema)...")

  // 1. Add columns back to Solution (nullable first)
  await prisma.$executeRawUnsafe(`
    ALTER TABLE "Solution"
    ADD COLUMN IF NOT EXISTS "categoryId" TEXT,
    ADD COLUMN IF NOT EXISTS "categoryName" TEXT,
    ADD COLUMN IF NOT EXISTS "categorySlug" TEXT;
  `)
  console.log("  Added categoryId, categoryName, categorySlug to Solution")

  // 2. Populate from _CategoryToSolution (one category per solution; use first if multiple)
  await prisma.$executeRawUnsafe(`
    UPDATE "Solution" s
    SET "categoryId" = sub."A",
        "categoryName" = sub."name",
        "categorySlug" = sub."slug"
    FROM (
      SELECT DISTINCT ON (cts."B") cts."B", cts."A", c."name", c."slug"
      FROM "_CategoryToSolution" cts
      JOIN "Category" c ON c.id = cts."A"
      ORDER BY cts."B", cts."A"
    ) sub
    WHERE s.id = sub."B";
  `)
  console.log("  Backfilled category from _CategoryToSolution")

  // 3. Solutions with no category: set to first category in DB
  const firstCategory = await prisma.$queryRawUnsafe(
    `SELECT id, name, slug FROM "Category" ORDER BY name LIMIT 1`
  ) as { id: string; name: string; slug: string }[]
  if (firstCategory?.length) {
    await prisma.$executeRawUnsafe(
      `UPDATE "Solution" SET "categoryId" = $1, "categoryName" = $2, "categorySlug" = $3 WHERE "categoryId" IS NULL`,
      firstCategory[0].id,
      firstCategory[0].name,
      firstCategory[0].slug
    )
    console.log("  Set default category for solutions without one")
  }

  // 4. Make columns NOT NULL
  await prisma.$executeRawUnsafe(`ALTER TABLE "Solution" ALTER COLUMN "categoryId" SET NOT NULL`)
  await prisma.$executeRawUnsafe(`ALTER TABLE "Solution" ALTER COLUMN "categoryName" SET NOT NULL`)
  await prisma.$executeRawUnsafe(`ALTER TABLE "Solution" ALTER COLUMN "categorySlug" SET NOT NULL`)
  console.log("  Set NOT NULL on category columns")

  // 5. Drop join table
  await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "_CategoryToSolution"`)
  console.log("  Dropped _CategoryToSolution")

  // 6. Add foreign key if not exists (Prisma may expect it)
  try {
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "Solution"
      ADD CONSTRAINT "Solution_categoryId_fkey"
      FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    `)
    console.log("  Added FK Solution.categoryId -> Category.id")
  } catch (e: unknown) {
    const err = e as { message?: string }
    if (err.message?.includes("already exists")) console.log("  FK already exists")
    else throw e
  }

  console.log("Done. Solution table matches main schema (single category).")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
