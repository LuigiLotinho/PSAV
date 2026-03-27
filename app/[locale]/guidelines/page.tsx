import Link from "next/link"
import { getTranslations } from "next-intl/server"
import { localePath, type Locale } from "@/lib/i18n/locales"

type PageProps = {
  params: Promise<{ locale: Locale }>
}

export default async function GuidelinesPage({ params }: PageProps) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "guidelines" })

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
          <p>{t("intro1")}</p>
          <p>{t("intro2")}</p>

          <div className="space-y-6 pl-0">
            <div>
              <h2 className="text-base md:text-lg font-semibold text-foreground mb-2">{t("focusTitle")}</h2>
              <p className="text-muted-foreground">{t("focusText")}</p>
            </div>
            <div>
              <h2 className="text-base md:text-lg font-semibold text-foreground mb-2">{t("avoidTitle")}</h2>
              <p className="text-muted-foreground">{t("avoidText")}</p>
            </div>
            <div>
              <h2 className="text-base md:text-lg font-semibold text-foreground mb-2">{t("respectfulTitle")}</h2>
              <p className="text-muted-foreground">{t("respectfulText")}</p>
            </div>
            <div>
              <h2 className="text-base md:text-lg font-semibold text-foreground mb-2">{t("specificTitle")}</h2>
              <p className="text-muted-foreground">{t("specificText")}</p>
            </div>
          </div>

          <div>
            <h2 className="text-base md:text-lg font-semibold text-foreground mb-2">{t("removedTitle")}</h2>
            <p className="text-muted-foreground mb-4">{t("removedIntro")}</p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>{t("removed1")}</li>
              <li>{t("removed2")}</li>
              <li>{t("removed3")}</li>
            </ul>
            <p className="pt-3 text-sm">
              <Link
                href={localePath(locale, "/removed-content")}
                className="text-primary underline underline-offset-2 hover:text-primary/90"
              >
                {t("removedContentLink")}
              </Link>
            </p>
          </div>

          <p className="text-foreground/90 pt-4">{t("closing")}</p>
        </div>
      </main>
    </div>
  )
}
