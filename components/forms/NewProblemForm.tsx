"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useTranslations, useLocale } from "next-intl"
import { Breadcrumbs } from "@/components/site/breadcrumbs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { createProblem } from "@/app/actions/problem-actions"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"
import { localePath, languageOptions, isLocale, type Locale } from "@/lib/i18n/locales"

const SHORT_MAX = 300
const LONG_MIN = 500
const LONG_MAX = 5000

const RANKING_KEYS = ["impact", "urgency", "reach"] as const
type RankingKey = (typeof RANKING_KEYS)[number]

type Category = {
  id: string
  name: string
  slug: string
}

type NewProblemFormProps = {
  locale: Locale
}

export function NewProblemForm({ locale }: NewProblemFormProps) {
  const t = useTranslations("problem")
  const tNav = useTranslations("nav")
  const tCommon = useTranslations("common")
  const [contentLocale, setContentLocale] = useState<Locale>(locale)
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState<string>("")
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)
  const [shortText, setShortText] = useState("")
  const [longText, setLongText] = useState("")
  const [rankings, setRankings] = useState<Record<RankingKey, number>>({
    impact: 5,
    urgency: 5,
    reach: 5,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  function updateRanking(key: RankingKey, value: number) {
    setRankings((prev) => ({ ...prev, [key]: value }))
  }

  useEffect(() => {
    let isMounted = true
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data: Category[]) => {
        if (isMounted) setCategories(data)
      })
      .catch(() => {
        toast.error(t("loadingCategories"))
      })
      .finally(() => {
        if (isMounted) setIsLoadingCategories(false)
      })
    return () => {
      isMounted = false
    }
  }, [t])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!title.trim() || !category || !shortText.trim()) {
      toast.error(t("fillRequired"))
      return
    }
    if (longText.trim().length < LONG_MIN) {
      toast.warning(
        t("longMinWarning", {
          min: LONG_MIN,
          missing: LONG_MIN - longText.trim().length,
        }),
        { duration: 2000 }
      )
      return
    }

    setIsSubmitting(true)
    try {
      await createProblem({
        title,
        shortText,
        longText,
        categorySlug: category,
        rankings,
        contentLocale,
      })
      toast.success(t("createSuccess"))
    } catch (error) {
      if (error && typeof error === "object" && "digest" in error &&
          String((error as { digest?: string }).digest).startsWith("NEXT_REDIRECT")) {
        return
      }
      console.error(error)
      toast.error(t("createError"))
    } finally {
      setIsSubmitting(false)
    }
  }

  const rankingConfig = RANKING_KEYS.map((key) => ({
    key,
    label: t(key),
    description: t(`${key}Description`),
  }))

  const homeHref = localePath(locale, "/")

  return (
    <div className="min-h-screen bg-background relative">
      {isSubmitting && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-background/80 backdrop-blur-sm">
          <Spinner className="h-12 w-12 text-primary" />
          <p className="max-w-md px-6 text-center text-lg text-foreground">
            {tCommon("uploadingMessage")}
          </p>
        </div>
      )}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <Link href={homeHref} className="text-xl font-semibold text-foreground">
            Auroville Problem-Solution Platform
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 space-y-8">
        <Breadcrumbs
          items={[
            { label: tNav("home"), href: homeHref },
            { label: tNav("problems") },
            { label: tCommon("breadcrumbNewProblem") },
          ]}
        />

        <section className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t("newTitle")}</h1>
            <p className="text-muted-foreground">{t("newSubtitle")}</p>
          </div>
          <Badge variant="secondary">{t("contributorOnly")}</Badge>
        </section>

        <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
          <div className="space-y-3">
            <label className="text-sm font-medium">{t("fieldLanguage")}</label>
            <Select
              value={contentLocale}
              onValueChange={(v) => { if (isLocale(v)) setContentLocale(v) }}
              disabled={isSubmitting}
            >
              <SelectTrigger className="w-full max-w-xs">
                <SelectValue />
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
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">{t("fieldTitle")}</label>
            <Input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder={t("placeholderTitle")}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">{t("fieldCategory")}</label>
            <Select
              value={category}
              onValueChange={setCategory}
              disabled={isSubmitting || isLoadingCategories}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={isLoadingCategories ? t("loadingCategories") : t("selectCategory")}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {categories.map((item) => (
                    <SelectItem key={item.id} value={item.slug}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <label className="text-sm font-medium">{t("fieldShort")}</label>
              <span className="text-xs text-muted-foreground">
                {shortText.length}/{SHORT_MAX}
              </span>
            </div>
            <div className="rounded-lg bg-blue-50 p-3 text-sm dark:bg-blue-950/30">
              <p className="mb-1 font-medium text-blue-700 dark:text-blue-300">{t("helperShortTitle")}</p>
              <ul className="space-y-1 text-xs text-blue-600 dark:text-blue-400">
                <li>• {t("helperShort1")}</li>
                <li>• {t("helperShort2")}</li>
                <li>• {t("helperShort3")}</li>
              </ul>
            </div>
            <Textarea
              value={shortText}
              onChange={(event) => setShortText(event.target.value)}
              placeholder={t("placeholderShort")}
              maxLength={SHORT_MAX}
              className="min-h-24"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <label className="text-sm font-medium">{t("fieldLong")}</label>
              <span className="text-xs text-muted-foreground">
                {longText.length}/{LONG_MAX}
              </span>
            </div>
            <div className="rounded-lg bg-blue-50 p-3 text-sm dark:bg-blue-950/30">
              <p className="mb-1 font-medium text-blue-700 dark:text-blue-300">{t("helperLongTitle")}</p>
              <ul className="space-y-1 text-xs text-blue-600 dark:text-blue-400">
                {([1, 2, 3, 4, 5, 6, 7, 8, 9] as const).map((i) => (
                  <li key={i}>• {t(`helperLong${i}`)}</li>
                ))}
              </ul>
            </div>
            <Textarea
              value={longText}
              onChange={(event) => setLongText(event.target.value)}
              placeholder={t("placeholderLong")}
              maxLength={LONG_MAX}
              className="min-h-40"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold">{t("rankingsTitle")}</h2>
              <p className="text-sm text-muted-foreground">{t("rankingsSubtitle")}</p>
            </div>

            <div className="space-y-5">
              {rankingConfig.map((item) => (
                <div key={item.key} className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                    <Badge variant="outline">{rankings[item.key]}</Badge>
                  </div>
                  <Slider
                    min={1}
                    max={10}
                    step={1}
                    value={[rankings[item.key]]}
                    onValueChange={(value) => updateRanking(item.key, value[0] ?? 1)}
                    disabled={isSubmitting}
                  />
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? t("submittingButton") : t("submitButton")}
          </Button>
        </form>
      </main>
    </div>
  )
}
