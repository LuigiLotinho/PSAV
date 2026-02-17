"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"
import { isAdmin } from "@/lib/auth"

export async function toggleVisibility(
  type: "problem" | "solution",
  id: string
): Promise<{ ok: boolean; error?: string }> {
  const admin = await isAdmin()
  if (!admin) return { ok: false, error: "Unauthorized" }

  if (type === "problem") {
    const p = await prisma.problem.findUnique({ where: { id } })
    if (!p) return { ok: false, error: "Not found" }
    await prisma.problem.update({
      where: { id },
      data: { visible: !p.visible },
    })
  } else {
    const s = await prisma.solution.findUnique({ where: { id } })
    if (!s) return { ok: false, error: "Not found" }
    await prisma.solution.update({
      where: { id },
      data: { visible: !s.visible },
    })
  }

  revalidatePath("/", "layout")
  revalidatePath("/category")
  return { ok: true }
}
