"use server"

import { z } from "zod"
import prisma from "@/lib/prisma"
import { isFeedbackTableMissing } from "@/lib/feedback-db"
import { isAdmin } from "@/lib/auth"
import { getMergedAdminItemsPaginated } from "@/lib/admin-feed"
import type { MergedAdminItem } from "@/lib/admin-feed"
import type { AdminItem } from "@/app/[locale]/admin/page"

export async function submitFeedback(
  message: string,
  email?: string
): Promise<{ ok: boolean; error?: string }> {
  const msg = typeof message === "string" ? message.trim() : ""
  if (!msg) return { ok: false, error: "Message required" }
  if (msg.length > 5000) return { ok: false, error: "Message too long" }

  let emailOut: string | null = null
  const rawEmail = typeof email === "string" ? email.trim() : ""
  if (rawEmail) {
    const parsedEmail = z.string().email().safeParse(rawEmail)
    if (!parsedEmail.success) return { ok: false, error: "Invalid email" }
    emailOut = parsedEmail.data
  }

  try {
    await prisma.feedback.create({
      data: {
        message: msg,
        email: emailOut,
      },
    })
  } catch (e) {
    if (isFeedbackTableMissing(e)) {
      return { ok: false, error: "Feedback storage is not available yet. Please try again later." }
    }
    throw e
  }

  return { ok: true }
}

function toAdminItem(row: MergedAdminItem): AdminItem {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    createdAt: row.createdAt,
    reviewed: row.reviewed,
  }
}

export async function loadMoreAdminPosts(
  offset: number,
  limit: number = 10
): Promise<{ ok: boolean; items?: AdminItem[]; error?: string }> {
  const admin = await isAdmin()
  if (!admin) return { ok: false, error: "Unauthorized" }

  const rows = await getMergedAdminItemsPaginated(offset, limit)
  return { ok: true, items: rows.map(toAdminItem) }
}

export type AdminFeedbackRow = {
  id: string
  message: string
  email: string | null
  createdAt: Date
}

export async function loadAdminFeedbackPage(
  offset: number,
  limit: number = 5
): Promise<{ ok: boolean; items?: AdminFeedbackRow[]; error?: string }> {
  const admin = await isAdmin()
  if (!admin) return { ok: false, error: "Unauthorized" }

  try {
    const items = await prisma.feedback.findMany({
      orderBy: { createdAt: "desc" },
      skip: offset,
      take: limit,
      select: { id: true, message: true, email: true, createdAt: true },
    })
    return { ok: true, items }
  } catch (e) {
    if (isFeedbackTableMissing(e)) {
      return { ok: true, items: [] }
    }
    throw e
  }
}
