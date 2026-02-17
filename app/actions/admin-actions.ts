"use server"

import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma"
import { isAdmin } from "@/lib/auth"

export async function addAdmin(
  email: string,
  password: string
): Promise<{ ok: boolean; error?: string }> {
  const admin = await isAdmin()
  if (!admin) return { ok: false, error: "Unauthorized" }

  const trimmedEmail = email.trim().toLowerCase()
  if (!trimmedEmail) return { ok: false, error: "E-Mail erforderlich" }
  if (!password || password.length < 6) return { ok: false, error: "Passwort muss mindestens 6 Zeichen haben" }

  const existing = await prisma.admin.findUnique({ where: { email: trimmedEmail } })
  if (existing) return { ok: false, error: "Ein Admin mit dieser E-Mail existiert bereits" }

  const passwordHash = await bcrypt.hash(password, 10)
  await prisma.admin.create({
    data: { email: trimmedEmail, passwordHash },
  })

  return { ok: true }
}
