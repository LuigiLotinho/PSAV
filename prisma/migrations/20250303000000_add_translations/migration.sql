-- Add i18n columns to Problem
ALTER TABLE "Problem" ADD COLUMN IF NOT EXISTS "contentLocale" TEXT NOT NULL DEFAULT 'en';
ALTER TABLE "Problem" ADD COLUMN IF NOT EXISTS "translations" JSONB;

-- Add i18n columns to Solution
ALTER TABLE "Solution" ADD COLUMN IF NOT EXISTS "contentLocale" TEXT NOT NULL DEFAULT 'en';
ALTER TABLE "Solution" ADD COLUMN IF NOT EXISTS "translations" JSONB;
