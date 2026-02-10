-- CreateTable: Prisma implicit many-to-many join table (Category = A, Solution = B)
CREATE TABLE "_CategoryToSolution" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- Migrate existing Solution.categoryId into join table
INSERT INTO "_CategoryToSolution" ("A", "B")
SELECT "categoryId", "id" FROM "Solution" WHERE "categoryId" IS NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToSolution_AB_unique" ON "_CategoryToSolution"("A", "B");
CREATE INDEX "_CategoryToSolution_B_index" ON "_CategoryToSolution"("B");

-- AddForeignKey
ALTER TABLE "_CategoryToSolution" ADD CONSTRAINT "_CategoryToSolution_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_CategoryToSolution" ADD CONSTRAINT "_CategoryToSolution_B_fkey" FOREIGN KEY ("B") REFERENCES "Solution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Drop columns from Solution
ALTER TABLE "Solution" DROP COLUMN IF EXISTS "categoryId";
ALTER TABLE "Solution" DROP COLUMN IF EXISTS "categoryName";
ALTER TABLE "Solution" DROP COLUMN IF EXISTS "categorySlug";
