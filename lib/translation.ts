import OpenAI from "openai"
import { locales } from "@/lib/i18n/locales"

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null

/** Translates a single text from source to target locale (OpenAI gpt-4o-mini) */
export async function translateText(
  text: string,
  sourceLocale: string,
  targetLocale: string
): Promise<string> {
  if (!text?.trim()) return text
  if (sourceLocale === targetLocale) return text
  if (!openai) {
    console.warn("OPENAI_API_KEY not set; returning original text")
    return text
  }

  const sourceName = localeToLanguageName(sourceLocale)
  const targetName = localeToLanguageName(targetLocale)

  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are a professional translator. Translate the following text from ${sourceName} to ${targetName}. Preserve formatting, line breaks, and tone. Output only the translation, nothing else.`,
      },
      { role: "user", content: text },
    ],
    temperature: 0.3,
  })

  const translated = res.choices[0]?.message?.content?.trim()
  return translated ?? text
}

function localeToLanguageName(locale: string): string {
  const map: Record<string, string> = {
    en: "English",
    ta: "Tamil",
    hi: "Hindi",
    fr: "French",
    es: "Spanish",
    ja: "Japanese",
    ko: "Korean",
    ka: "Georgian",
    de: "German",
    pt: "Portuguese",
  }
  return map[locale] ?? locale
}

export type LocalizedContent = {
  title: string
  short_text: string
  long_text: string | null
}

export type TranslationsMap = Record<string, LocalizedContent>

/** Translates problem content to all 10 locales */
export async function translateProblemContent(
  content: { title: string; short_text: string; long_text: string | null },
  sourceLocale: string
): Promise<TranslationsMap> {
  const result: TranslationsMap = {}
  const targets = locales.filter((l) => l !== sourceLocale)

  for (const target of targets) {
    const [title, short, long] = await Promise.all([
      translateText(content.title, sourceLocale, target),
      translateText(content.short_text, sourceLocale, target),
      content.long_text
        ? translateText(content.long_text, sourceLocale, target)
        : Promise.resolve(null),
    ])
    result[target] = { title, short_text: short, long_text: long }
  }

  result[sourceLocale] = {
    title: content.title,
    short_text: content.short_text,
    long_text: content.long_text,
  }

  return result
}

/** Translates solution content to all 10 locales */
export async function translateSolutionContent(
  content: { title: string; short_text: string; long_text: string | null },
  sourceLocale: string
): Promise<TranslationsMap> {
  return translateProblemContent(content, sourceLocale)
}

/** Translations shape stored in DB */
type StoredTranslations = Record<string, { title: string; short_text: string; long_text: string | null }>

/** Get localized title, short_text, long_text for a given locale. Falls back to base fields if no translation. */
export function getLocalizedContent<T extends { title: string; short_text: string; long_text: string | null; translations?: unknown }>(
  item: T,
  locale: string
): LocalizedContent {
  const translations = item.translations as StoredTranslations | null | undefined
  const loc = translations?.[locale]
  if (loc) {
    return { title: loc.title, short_text: loc.short_text, long_text: loc.long_text ?? null }
  }
  return {
    title: item.title,
    short_text: item.short_text,
    long_text: item.long_text ?? null,
  }
}
