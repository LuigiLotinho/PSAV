"use client"

import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { toggleVisibility } from "@/app/actions/visibility-actions"
import { useRouter } from "next/navigation"

type Props = {
  type: "problem" | "solution"
  id: string
  visible: boolean | null | undefined
}

export function VisibilityToggleButton({ type, id, visible: visibleProp }: Props) {
  const visible = visibleProp !== false
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (loading) return
    setLoading(true)
    try {
      const res = await toggleVisibility(type, id)
      if (res.ok) router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${
        visible
          ? "text-green-600 hover:text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:text-green-300 dark:hover:bg-green-950/30"
          : "text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/30"
      }`}
      title={visible ? "Sichtbar – klicken zum Verstecken" : "Versteckt – klicken zum Anzeigen"}
      aria-label={visible ? "Hide entry" : "Show entry"}
    >
      {visible ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
    </button>
  )
}
