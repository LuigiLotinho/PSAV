import { Prisma } from "@prisma/client"

/** True wenn die Feedback-Tabelle in der DB noch fehlt (Migration nicht angewendet). */
export function isFeedbackTableMissing(error: unknown): boolean {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) return false
  const meta = error.meta as { table?: string; modelName?: string } | undefined
  const nameHint = String(meta?.table ?? meta?.modelName ?? "")
  if (error.code === "P2021" && nameHint.includes("Feedback")) return true
  const msg = error.message
  return msg.includes("Feedback") && msg.includes("does not exist")
}
