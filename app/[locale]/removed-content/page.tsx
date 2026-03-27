import Link from "next/link"
import { getTranslations } from "next-intl/server"
import { localePath, type Locale } from "@/lib/i18n/locales"
import prisma from "@/lib/prisma"
import { isAdmin } from "@/lib/auth"

type PageProps = {
  params: Promise<{ locale: Locale }>
}

export default async function RemovedContentPage({ params }: PageProps) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "removedContent" })
  const admin = await isAdmin()

  const [hiddenProblems, hiddenSolutions] = await Promise.all([
    prisma.problem.findMany({
      where: { visible: false },
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, createdAt: true },
    }),
    prisma.solution.findMany({
      where: { visible: false },
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, createdAt: true },
    }),
  ])

  return (
    <div className="min-h-screen bg-background overflow-x-hidden max-w-[100vw] w-full">
      <main className="container mx-auto px-4 py-8 md:py-10 max-w-3xl">
        <Link
          href={localePath(locale, "/")}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 inline-block"
        >
          ← {t("back")}
        </Link>

        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">{t("title")}</h1>
        <p className="text-sm text-muted-foreground mb-8">{t("intro")}</p>

        {hiddenProblems.length === 0 && hiddenSolutions.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("empty")}</p>
        ) : (
          <div className="space-y-10">
            {hiddenProblems.length > 0 && (
              <section className="space-y-3">
                <h2 className="text-lg font-semibold text-foreground">{t("problemsHeading")}</h2>
                <ul className="space-y-2 border border-border rounded-lg divide-y divide-border">
                  {hiddenProblems.map((p) => (
                    <li key={p.id} className="px-4 py-3 text-sm">
                      {admin ? (
                        <Link
                          href={localePath(locale, `/problem/${p.id}`)}
                          className="text-primary hover:underline font-medium"
                        >
                          {p.title}
                        </Link>
                      ) : (
                        <span className="text-foreground">{p.title}</span>
                      )}
                      <span className="block text-xs text-muted-foreground mt-1">
                        {new Date(p.createdAt).toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {hiddenSolutions.length > 0 && (
              <section className="space-y-3">
                <h2 className="text-lg font-semibold text-foreground">{t("solutionsHeading")}</h2>
                <ul className="space-y-2 border border-border rounded-lg divide-y divide-border">
                  {hiddenSolutions.map((s) => (
                    <li key={s.id} className="px-4 py-3 text-sm">
                      {admin ? (
                        <Link
                          href={localePath(locale, `/solution/${s.id}`)}
                          className="text-primary hover:underline font-medium"
                        >
                          {s.title}
                        </Link>
                      ) : (
                        <span className="text-foreground">{s.title}</span>
                      )}
                      <span className="block text-xs text-muted-foreground mt-1">
                        {new Date(s.createdAt).toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {!admin && (hiddenProblems.length > 0 || hiddenSolutions.length > 0) && (
              <p className="text-xs text-muted-foreground">{t("adminOnlyNote")}</p>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
