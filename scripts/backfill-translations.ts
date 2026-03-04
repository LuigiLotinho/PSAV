/**
 * Backfill-Skript: Übersetzt bestehende Solutions/Problems nach
 * Run: npm run backfill-translations -- solution <id> [sourceLocale]
 * Beispiel: npm run backfill-translations -- solution addd156e-c6a1-46a8-a828-6ba8d94730b1 de
 */

require("dotenv").config()
require("dotenv").config({ path: ".env.local", override: true })
const { PrismaClient } = require("@prisma/client")
const OpenAI = require("openai").default

const prisma = new PrismaClient()
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null

const locales = ["en", "ta", "hi", "fr", "es", "ja", "ko", "ka", "de", "pt"]
const localeNames: Record<string, string> = {
  en: "English", ta: "Tamil", hi: "Hindi", fr: "French", es: "Spanish",
  ja: "Japanese", ko: "Korean", ka: "Georgian", de: "German", pt: "Portuguese",
}

async function translateText(text: string, source: string, target: string): Promise<string> {
  if (!text?.trim()) return text
  if (source === target) return text
  if (!openai) throw new Error("OPENAI_API_KEY nicht gesetzt")
  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `Translate from ${localeNames[source] || source} to ${localeNames[target] || target}. Output only the translation.`,
      },
      { role: "user", content: text },
    ],
    temperature: 0.3,
  })
  return res.choices[0]?.message?.content?.trim() ?? text
}

async function translateContent(
  content: { title: string; short_text: string; long_text: string | null },
  sourceLocale: string
) {
  const result: Record<string, { title: string; short_text: string; long_text: string | null }> = {}
  for (const loc of locales) {
    if (loc === sourceLocale) {
      result[loc] = { ...content }
    } else {
      const [title, short, long] = await Promise.all([
        translateText(content.title, sourceLocale, loc),
        translateText(content.short_text, sourceLocale, loc),
        content.long_text ? translateText(content.long_text, sourceLocale, loc) : Promise.resolve(null),
      ])
      result[loc] = { title, short_text: short, long_text: long }
    }
  }
  return result
}

async function backfillSolution(id: string, sourceLocale: string) {
  const solution = await prisma.solution.findUnique({
    where: { id },
    select: { id: true, title: true, short_text: true, long_text: true, contentLocale: true },
  })
  if (!solution) {
    throw new Error(`Solution ${id} nicht gefunden.`)
  }
  const locale = locales.includes(sourceLocale) ? sourceLocale : (solution.contentLocale as string) || "de"
  console.log(`Übersetze Solution "${solution.title}" von ${locale} in alle Sprachen...`)
  const translations = await translateContent(
    {
      title: solution.title,
      short_text: solution.short_text,
      long_text: solution.long_text,
    },
    locale
  )
  const translationsJson = JSON.stringify(translations)
  await prisma.$executeRaw`
    UPDATE "Solution"
    SET "contentLocale" = ${locale}, "translations" = ${translationsJson}::jsonb
    WHERE "id" = ${id}
  `
  console.log(`✓ Solution ${id} erfolgreich übersetzt.`)
}

async function backfillProblem(id: string, sourceLocale: string) {
  const problem = await prisma.problem.findUnique({
    where: { id },
    select: { id: true, title: true, short_text: true, long_text: true, contentLocale: true },
  })
  if (!problem) {
    throw new Error(`Problem ${id} nicht gefunden.`)
  }
  const locale = locales.includes(sourceLocale) ? sourceLocale : (problem.contentLocale as string) || "de"
  console.log(`Übersetze Problem "${problem.title}" von ${locale} in alle Sprachen...`)
  const translations = await translateContent(
    {
      title: problem.title,
      short_text: problem.short_text,
      long_text: problem.long_text,
    },
    locale
  )
  const translationsJson = JSON.stringify(translations)
  await prisma.$executeRaw`
    UPDATE "Problem"
    SET "contentLocale" = ${locale}, "translations" = ${translationsJson}::jsonb
    WHERE "id" = ${id}
  `
  console.log(`✓ Problem ${id} erfolgreich übersetzt.`)
}

async function main() {
  const [type, id, sourceLocale] = process.argv.slice(2)
  if (!type || !id) {
    console.error("Usage: npm run backfill-translations -- solution <id> [sourceLocale]")
    process.exit(1)
  }
  if (!openai) {
    console.error("Fehler: OPENAI_API_KEY nicht gesetzt. In .env oder .env.local eintragen.")
    process.exit(1)
  }
  try {
    if (type === "solution") {
      await backfillSolution(id, sourceLocale || "de")
    } else if (type === "problem") {
      await backfillProblem(id, sourceLocale || "de")
    } else {
      console.error("Typ muss 'solution' oder 'problem' sein.")
      process.exit(1)
    }
  } catch (err) {
    console.error(err)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
