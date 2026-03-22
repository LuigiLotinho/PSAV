-- Rename category "other" to "all"
UPDATE "Category" SET slug = 'all', name = 'All' WHERE slug = 'other';
UPDATE "Problem" SET "categorySlug" = 'all', "categoryName" = 'All' WHERE "categorySlug" = 'other';
UPDATE "Solution" SET "categorySlug" = 'all', "categoryName" = 'All' WHERE "categorySlug" = 'other';
