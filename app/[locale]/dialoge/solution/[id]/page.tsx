import Link from "next/link"
import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import { isAdmin } from "@/lib/auth"
import { getTranslations } from "next-intl/server"
import { localePath, type Locale } from "@/lib/i18n/locales"

export const dynamic = "force-dynamic"

type PageProps = {
  params: Promise<{ locale: Locale; id: string }>
}

export default async function DialogeSolutionPage({ params }: PageProps) {
  const { locale, id } = await params
  const t = await getTranslations({ locale, namespace: "dialoge" })
  const tCommon = await getTranslations({ locale, namespace: "common" })
  const solution = await prisma.solution.findUnique({
    where: { id },
    select: { id: true, visible: true },
  })
  if (!solution) notFound()
  const admin = await isAdmin()
  if (!admin && !solution.visible) notFound()

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <Link href={localePath(locale, "/")} className="text-xl font-semibold text-foreground">
            {tCommon("platformTitle")}
          </Link>
        </div>
      </header>
      <main className="container mx-auto px-4 py-10">
        <p className="text-xl font-medium">{t("title")}</p>
      </main>
    </div>
  )
}
