import { locales, defaultLocale } from "./lib/i18n/locales"

export const i18n = {
  locales,
  defaultLocale,
} as const

export type I18nConfig = typeof i18n
