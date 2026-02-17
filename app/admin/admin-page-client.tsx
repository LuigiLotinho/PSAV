"use client"

import { useState } from "react"
import { signOut } from "next-auth/react"
import Link from "next/link"
import { addAdmin } from "@/app/actions/admin-actions"
import { toast } from "sonner"

export function AdminPageClient() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleLogout() {
    await signOut({ callbackUrl: "/" })
  }

  async function handleAddAdmin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await addAdmin(email, password)
      if (res.ok) {
        toast.success("Admin erfolgreich hinzugefügt.")
        setEmail("")
        setPassword("")
      } else {
        toast.error(res.error ?? "Fehler beim Hinzufügen")
      }
    } catch {
      toast.error("Ein Fehler ist aufgetreten.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-10 max-w-xl space-y-10">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← Zurück zur Startseite
          </Link>
        </div>

        <h1 className="text-2xl font-bold">Admin-Bereich</h1>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Abmelden</h2>
          <button
            type="button"
            onClick={handleLogout}
            className="px-4 py-2 rounded-md border bg-muted hover:bg-muted/80 text-sm font-medium transition-colors"
          >
            Logout
          </button>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Neuen Admin hinzufügen</h2>
          <form onSubmit={handleAddAdmin} className="space-y-4">
            <div>
              <label htmlFor="admin-email" className="block text-sm font-medium mb-2">
                E-Mail
              </label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label htmlFor="admin-password" className="block text-sm font-medium mb-2">
                Passwort
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                placeholder="Mindestens 6 Zeichen"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium disabled:opacity-50"
            >
              {loading ? "Wird hinzugefügt..." : "Hinzufügen"}
            </button>
          </form>
        </section>
      </main>
    </div>
  )
}
