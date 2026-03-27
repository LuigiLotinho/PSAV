"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { addAdmin } from "@/app/actions/admin-actions"
import { toggleReviewed } from "@/app/actions/visibility-actions"
import { loadMoreAdminPosts, loadAdminFeedbackPage } from "@/app/actions/feedback-actions"
import { toast } from "sonner"
import { localePath, type Locale } from "@/lib/i18n/locales"
import type { AdminItem, AdminFeedback } from "@/app/[locale]/admin/page"

type AdminPageClientProps = {
  locale: Locale
  items: AdminItem[]
  itemsTotal: number
  postsPageSize: number
  feedbacks: AdminFeedback[]
  feedbackTotal: number
  feedbackPageSize: number
}

function ReviewedButton({
  type,
  id,
  reviewed,
  label,
}: {
  type: "problem" | "solution"
  id: string
  reviewed: boolean
  label: string
}) {
  const [optimistic, setOptimistic] = useState(reviewed)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleClick() {
    if (loading) return
    setLoading(true)
    setOptimistic(!optimistic)
    try {
      const res = await toggleReviewed(type, id)
      if (!res.ok) {
        setOptimistic(reviewed)
        toast.error(res.error)
      }
      router.refresh()
    } catch {
      setOptimistic(reviewed)
      toast.error("Fehler")
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={`px-2 py-1 text-xs font-medium rounded transition-colors shrink-0 ${
        optimistic
          ? "bg-green-600 text-white hover:bg-green-700"
          : "bg-muted text-muted-foreground hover:bg-muted/80"
      } disabled:opacity-50`}
    >
      {label}
    </button>
  )
}

export function AdminPageClient({
  locale,
  items: initialItems,
  itemsTotal,
  postsPageSize,
  feedbacks: initialFeedbacks,
  feedbackTotal,
  feedbackPageSize,
}: AdminPageClientProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [posts, setPosts] = useState(initialItems)
  /** Verschiebung in der nach Datum sortierten Liste (ein Schritt = ein Eintrag), Fenstergröße = postsPageSize. */
  const [postsSkip, setPostsSkip] = useState(0)
  const [loadingPosts, setLoadingPosts] = useState(false)
  const [feedbacks, setFeedbacks] = useState(initialFeedbacks)
  const [feedbackOffset, setFeedbackOffset] = useState(0)
  const [loadingFeedback, setLoadingFeedback] = useState(false)

  const t = useTranslations("admin")
  const tAuth = useTranslations("auth")

  /** Ein „Schritt“ = ein Eintrag nach vorn/hinten (gleitendes Fenster mit feedbackPageSize Kacheln). */
  const maxFeedbackOffset = Math.max(0, feedbackTotal - feedbackPageSize)
  const feedbackRangeStart = feedbackTotal === 0 ? 0 : feedbackOffset + 1
  const feedbackRangeEnd =
    feedbackTotal === 0 ? 0 : Math.min(feedbackOffset + feedbacks.length, feedbackTotal)
  const canPrevFeedback = feedbackOffset > 0 && !loadingFeedback
  const canNextFeedback = feedbackOffset < maxFeedbackOffset && !loadingFeedback

  const maxPostsOffset = Math.max(0, itemsTotal - postsPageSize)
  const postsRangeStart = itemsTotal === 0 ? 0 : postsSkip + 1
  const postsRangeEnd =
    itemsTotal === 0 ? 0 : Math.min(postsSkip + posts.length, itemsTotal)
  const canPrevPosts = postsSkip > 0 && !loadingPosts
  const canNextPosts = postsSkip < maxPostsOffset && !loadingPosts

  async function handleLogout() {
    await signOut({ callbackUrl: localePath(locale, "/") })
  }

  async function handleAddAdmin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await addAdmin(email, password)
      if (res.ok) {
        toast.success(t("addSuccess"))
        setEmail("")
        setPassword("")
      } else {
        toast.error(res.error ?? t("addError"))
      }
    } catch {
      toast.error(t("genericError"))
    } finally {
      setLoading(false)
    }
  }

  async function handlePostsPrev() {
    if (!canPrevPosts) return
    const nextSkip = Math.max(0, postsSkip - 1)
    setLoadingPosts(true)
    try {
      const res = await loadMoreAdminPosts(nextSkip, postsPageSize)
      if (res.ok && res.items) {
        setPosts(res.items)
        setPostsSkip(nextSkip)
      } else {
        toast.error(res?.error ?? t("genericError"))
      }
    } catch {
      toast.error(t("genericError"))
    } finally {
      setLoadingPosts(false)
    }
  }

  async function handlePostsNext() {
    if (!canNextPosts) return
    const nextSkip = Math.min(postsSkip + 1, maxPostsOffset)
    setLoadingPosts(true)
    try {
      const res = await loadMoreAdminPosts(nextSkip, postsPageSize)
      if (res.ok && res.items) {
        setPosts(res.items)
        setPostsSkip(nextSkip)
      } else {
        toast.error(res?.error ?? t("genericError"))
      }
    } catch {
      toast.error(t("genericError"))
    } finally {
      setLoadingPosts(false)
    }
  }

  async function handleFeedbackPrev() {
    if (!canPrevFeedback) return
    const nextOffset = Math.max(0, feedbackOffset - 1)
    setLoadingFeedback(true)
    try {
      const res = await loadAdminFeedbackPage(nextOffset, feedbackPageSize)
      if (res.ok && res.items) {
        setFeedbacks(res.items)
        setFeedbackOffset(nextOffset)
      } else {
        toast.error(res?.error ?? t("genericError"))
      }
    } catch {
      toast.error(t("genericError"))
    } finally {
      setLoadingFeedback(false)
    }
  }

  async function handleFeedbackNext() {
    if (!canNextFeedback) return
    const nextOffset = Math.min(feedbackOffset + 1, maxFeedbackOffset)
    setLoadingFeedback(true)
    try {
      const res = await loadAdminFeedbackPage(nextOffset, feedbackPageSize)
      if (res.ok && res.items) {
        setFeedbacks(res.items)
        setFeedbackOffset(nextOffset)
      } else {
        toast.error(res?.error ?? t("genericError"))
      }
    } catch {
      toast.error(t("genericError"))
    } finally {
      setLoadingFeedback(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-10 max-w-2xl space-y-10">
        <div className="flex items-center justify-between">
          <Link href={localePath(locale, "/")} className="text-sm text-muted-foreground hover:text-foreground">
            ← {t("back")}
          </Link>
        </div>

        <h1 className="text-2xl font-bold">{t("title")}</h1>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">{t("addAdminSection")}</h2>
          <form onSubmit={handleAddAdmin} className="space-y-4">
            <div>
              <label htmlFor="admin-email" className="block text-sm font-medium mb-2">
                {tAuth("email")}
              </label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                placeholder={t("emailPlaceholder")}
              />
            </div>
            <div>
              <label htmlFor="admin-password" className="block text-sm font-medium mb-2">
                {tAuth("password")}
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                placeholder={t("passwordPlaceholder")}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium disabled:opacity-50"
            >
              {loading ? t("addingButton") : t("addButton")}
            </button>
          </form>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">{t("recentItems")}</h2>
          {itemsTotal === 0 ? (
            <p className="text-sm text-muted-foreground">{t("noPosts")}</p>
          ) : (
            <div className="space-y-3">
              <div className={loadingPosts ? "opacity-60" : ""}>
                <ul className="space-y-2">
                  {posts.map((item) => (
                    <li
                      key={`${item.type}-${item.id}`}
                      className="flex items-center gap-3 py-2 border-b border-border last:border-0"
                    >
                      <Link
                        href={localePath(locale, `/${item.type}/${item.id}`)}
                        className="flex-1 text-sm hover:underline truncate"
                      >
                        <span className="text-muted-foreground mr-2">
                          {item.type === "problem" ? t("problem") : t("solution")}:
                        </span>
                        {item.title}
                      </Link>
                      <ReviewedButton
                        type={item.type}
                        id={item.id}
                        reviewed={item.reviewed}
                        label={t("reviewed")}
                      />
                    </li>
                  ))}
                </ul>
              </div>
              <>
                {maxPostsOffset === 0 && (
                  <p className="text-xs text-muted-foreground pt-1">{t("postsAllVisibleHint")}</p>
                )}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handlePostsPrev}
                    disabled={!canPrevPosts}
                    className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label={t("feedbackPrev")}
                  >
                    <ChevronLeft className="h-5 w-5 shrink-0 text-foreground" strokeWidth={2.25} aria-hidden />
                    {t("feedbackPrev")}
                  </button>
                  <span className="text-xs text-muted-foreground tabular-nums text-center px-1">
                    {t("feedbackRangeIndicator", {
                      start: postsRangeStart,
                      end: postsRangeEnd,
                      total: itemsTotal,
                    })}
                  </span>
                  <button
                    type="button"
                    onClick={handlePostsNext}
                    disabled={!canNextPosts}
                    className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label={t("feedbackNext")}
                  >
                    {t("feedbackNext")}
                    <ChevronRight className="h-5 w-5 shrink-0 text-foreground" strokeWidth={2.25} aria-hidden />
                  </button>
                </div>
              </>
            </div>
          )}
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">{t("feedbackSection")}</h2>
          {feedbackTotal === 0 ? (
            <p className="text-sm text-muted-foreground">{t("noFeedback")}</p>
          ) : (
            <div className="space-y-3">
              <div className={loadingFeedback ? "opacity-60" : ""}>
                <ul className="space-y-3">
                  {feedbacks.map((fb) => (
                    <li
                      key={fb.id}
                      className="rounded-md border border-border bg-muted/30 p-3 text-sm space-y-1"
                    >
                      <p className="whitespace-pre-wrap break-words text-foreground">{fb.message}</p>
                      {fb.email && (
                        <p className="text-xs text-muted-foreground">
                          {tAuth("email")}: {fb.email}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {new Date(fb.createdAt).toLocaleString()}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
              {feedbackTotal > 0 && (
                <>
                  {maxFeedbackOffset === 0 && (
                    <p className="text-xs text-muted-foreground pt-1">{t("feedbackAllVisibleHint")}</p>
                  )}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleFeedbackPrev}
                      disabled={!canPrevFeedback}
                      className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label={t("feedbackPrev")}
                    >
                      <ChevronLeft className="h-5 w-5 shrink-0 text-foreground" strokeWidth={2.25} aria-hidden />
                      {t("feedbackPrev")}
                    </button>
                    <span className="text-xs text-muted-foreground tabular-nums text-center px-1">
                      {t("feedbackRangeIndicator", {
                        start: feedbackRangeStart,
                        end: feedbackRangeEnd,
                        total: feedbackTotal,
                      })}
                    </span>
                    <button
                      type="button"
                      onClick={handleFeedbackNext}
                      disabled={!canNextFeedback}
                      className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label={t("feedbackNext")}
                    >
                      {t("feedbackNext")}
                      <ChevronRight className="h-5 w-5 shrink-0 text-foreground" strokeWidth={2.25} aria-hidden />
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">{t("signOutSection")}</h2>
          <button
            type="button"
            onClick={handleLogout}
            className="px-4 py-2 rounded-md border bg-muted hover:bg-muted/80 text-sm font-medium transition-colors"
          >
            {t("logout")}
          </button>
        </section>
      </main>
    </div>
  )
}
