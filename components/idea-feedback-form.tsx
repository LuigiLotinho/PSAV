"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import { submitFeedback } from "@/app/actions/feedback-actions"

export function IdeaFeedbackForm() {
  const t = useTranslations("idea")
  const [message, setMessage] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await submitFeedback(message, email)
      if (res.ok) {
        toast.success(t("feedbackSuccess"))
        setMessage("")
        setEmail("")
      } else {
        toast.error(res.error ?? t("feedbackError"))
      }
    } catch {
      toast.error(t("feedbackError"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="mt-12 pt-10 border-t border-border">
      <h2 className="text-xl font-semibold text-foreground mb-2">{t("feedbackSectionTitle")}</h2>
      <p className="text-sm text-muted-foreground mb-6">{t("feedbackIntro")}</p>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        <div>
          <label htmlFor="idea-feedback-message" className="block text-sm font-medium mb-2">
            {t("feedbackLabel")}
          </label>
          <textarea
            id="idea-feedback-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={5}
            maxLength={5000}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm min-h-[120px] resize-y"
            placeholder={t("feedbackPlaceholder")}
          />
        </div>
        <div>
          <label htmlFor="idea-feedback-email" className="block text-sm font-medium mb-2">
            {t("emailOptional")}
          </label>
          <input
            id="idea-feedback-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium disabled:opacity-50"
        >
          {loading ? t("submittingFeedback") : t("submitFeedback")}
        </button>
      </form>
    </section>
  )
}
