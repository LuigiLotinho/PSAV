export const locales = [
  "en", // English
  "ta", // Tamil
  "hi", // Hindi
  "fr", // French
  "es", // Spanish
  "ja", // Japanese
  "ko", // Korean
  "ka", // Georgian
  "de", // German
  "pt", // Portuguese
] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = "en"

/** Language options for forms (code + label) */
export const languageOptions: { value: Locale; label: string }[] = [
  { value: "en", label: "English" },
  { value: "ta", label: "தமிழ் (Tamil)" },
  { value: "hi", label: "हिन्दी (Hindi)" },
  { value: "fr", label: "Français (French)" },
  { value: "es", label: "Español (Spanish)" },
  { value: "ja", label: "日本語 (Japanese)" },
  { value: "ko", label: "한국어 (Korean)" },
  { value: "ka", label: "ქართული (Georgian)" },
  { value: "de", label: "Deutsch (German)" },
  { value: "pt", label: "Português (Portuguese)" },
]

export function isLocale(s: string): s is Locale {
  return locales.includes(s as Locale)
}

/** Build path with locale prefix */
export function localePath(locale: Locale, path: string = ""): string {
  const p = path.startsWith("/") ? path : `/${path}`
  return `/${locale}${p}`
}
