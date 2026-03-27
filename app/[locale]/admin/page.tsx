import { redirect } from "next/navigation"
import { isAdmin } from "@/lib/auth"
import { AdminPageClient } from "@/app/admin/admin-page-client"
import { localePath, type Locale } from "@/lib/i18n/locales"
import prisma from "@/lib/prisma"
import { getMergedAdminItemsPaginated, getMergedAdminItemsCount } from "@/lib/admin-feed"
import { isFeedbackTableMissing } from "@/lib/feedback-db"

const POSTS_PAGE_SIZE = 5
const FEEDBACK_PAGE_SIZE = 5

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

export type AdminFeedback = {
  id: string
  message: string
  email: string | null
  createdAt: Date
}

export default async function AdminPage({ params }: PageProps) {
  const { locale } = await params
  const admin = await isAdmin()
  if (!admin) {
    redirect(localePath(locale, "/login") + "?callbackUrl=" + encodeURIComponent(localePath(locale, "/admin")))
  }

  const [mergedItems, itemsTotal] = await Promise.all([
    getMergedAdminItemsPaginated(0, POSTS_PAGE_SIZE),
    getMergedAdminItemsCount(),
  ])

  let feedbackTotal = 0
  let feedbackRows: AdminFeedback[] = []
  try {
    ;[feedbackTotal, feedbackRows] = await Promise.all([
      prisma.feedback.count(),
      prisma.feedback.findMany({
        orderBy: { createdAt: "desc" },
        take: FEEDBACK_PAGE_SIZE,
        skip: 0,
        select: { id: true, message: true, email: true, createdAt: true },
      }),
    ])
  } catch (e) {
    if (!isFeedbackTableMissing(e)) throw e
  }

  const items: AdminItem[] = mergedItems.map((m) => ({
    id: m.id,
    type: m.type,
    title: m.title,
    createdAt: m.createdAt,
    reviewed: m.reviewed,
  }))

  return (
    <AdminPageClient
      locale={locale}
      items={items}
      itemsTotal={itemsTotal}
      postsPageSize={POSTS_PAGE_SIZE}
      feedbacks={feedbackRows}
      feedbackTotal={feedbackTotal}
      feedbackPageSize={FEEDBACK_PAGE_SIZE}
    />
  )
}
