"use client"

import { useRouter } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { languageOptions, localePath, type Locale } from "@/lib/i18n/locales"

type LanguageSwitcherProps = {
  currentLocale: Locale
  label?: string
}

export function LanguageSwitcher({ currentLocale, label }: LanguageSwitcherProps) {
  const router = useRouter()
  const currentLabel = languageOptions.find((o) => o.value === currentLocale)?.label ?? currentLocale

  function handleChange(value: string) {
    const targetLocale = value as Locale
    router.push(localePath(targetLocale, "/"))
  }

  return (
    <section className="flex flex-col items-center gap-2 pt-4">
      {label && (
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
      )}
      <Select value={currentLocale} onValueChange={handleChange}>
        <SelectTrigger className="w-[220px]">
          <SelectValue placeholder={currentLabel}>{currentLabel}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {languageOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </section>
  )
}
