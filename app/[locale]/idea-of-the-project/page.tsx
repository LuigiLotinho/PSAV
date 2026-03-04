import Link from "next/link"
import { getTranslations } from "next-intl/server"
import { localePath, type Locale } from "@/lib/i18n/locales"

type PageProps = {
  params: Promise<{ locale: Locale }>
}

export default async function IdeaOfTheProjectPage({ params }: PageProps) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "idea" })

  return (
    <div className="min-h-screen bg-background overflow-x-hidden max-w-[100vw] w-full">
      <main className="container mx-auto px-4 py-8 md:py-10 max-w-3xl">
        <Link
          href={localePath(locale, "/")}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 inline-block"
        >
          ← {t("back")}
        </Link>

        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-8">{t("title")}</h1>

        <div className="prose prose-sm md:prose-base text-foreground/90 space-y-6 leading-relaxed">
          <p>{t("para1")}</p>
          <p>{t("para2")}</p>
          <p>{t("para3")}</p>
        </div>
      </main>
    </div>
  )
}
