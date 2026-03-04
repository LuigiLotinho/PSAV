import { redirect } from "next/navigation"
import { isAdmin } from "@/lib/auth"
import { AdminPageClient } from "@/app/admin/admin-page-client"
import { localePath, type Locale } from "@/lib/i18n/locales"
import prisma from "@/lib/prisma"

type PageProps = {
  params: Promise<{ locale: Locale }>
}

export type AdminItem = {
  id: string
  type: "problem" | "solution"
  title: string
  createdAt: Date
  reviewed: boolean
}

export default async function AdminPage({ params }: PageProps) {
  const { locale } = await params
  const admin = await isAdmin()
  if (!admin) {
    redirect(localePath(locale, "/login") + "?callbackUrl=" + encodeURIComponent(localePath(locale, "/admin")))
  }

  const [problems, solutions] = await Promise.all([
    prisma.problem.findMany({
      select: { id: true, title: true, createdAt: true, reviewed: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.solution.findMany({
      select: { id: true, title: true, createdAt: true, reviewed: true },
      orderBy: { createdAt: "desc" },
    }),
  ])

  const items: AdminItem[] = [
    ...problems.map((p) => ({
      id: p.id,
      type: "problem" as const,
      title: p.title,
      createdAt: p.createdAt,
      reviewed: p.reviewed,
    })),
    ...solutions.map((s) => ({
      id: s.id,
      type: "solution" as const,
      title: s.title,
      createdAt: s.createdAt,
      reviewed: s.reviewed,
    })),
  ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

  return <AdminPageClient locale={locale} items={items} />
}
