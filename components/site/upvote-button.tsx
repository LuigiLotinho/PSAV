"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"

type UpvoteButtonProps = {
  type: "problem" | "solution"
  id: string
  className?: string
  iconClassName?: string
}

export function UpvoteButton({ type, id, className, iconClassName }: UpvoteButtonProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleClick() {
    startTransition(async () => {
      await fetch(`/api/${type}/${id}/upvote`, { method: "POST" })
      router.refresh()
    })
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={className}
      onClick={handleClick}
      disabled={isPending}
      aria-label="Upvote"
    >
      <ArrowUp className={iconClassName ?? "h-5 w-5"} />
    </Button>
  )
}
