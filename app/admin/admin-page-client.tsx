"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { addAdmin } from "@/app/actions/admin-actions"
import { toggleReviewed } from "@/app/actions/visibility-actions"
import { toast } from "sonner"
import { localePath, type Locale } from "@/lib/i18n/locales"
import type { AdminItem } from "@/app/[locale]/admin/page"

type AdminPageClientProps = {
  locale: Locale
  items: AdminItem[]
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

export function AdminPageClient({ locale, items }: AdminPageClientProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const t = useTranslations("admin")
  const tAuth = useTranslations("auth")

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

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-10 max-w-xl space-y-10">
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
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t("noPosts")}</p>
          ) : (
            <ul className="space-y-2">
              {items.map((item) => (
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
