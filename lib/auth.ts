import { auth } from "@/auth"
import prisma from "@/lib/prisma"

export async function getSession() {
  return auth()
}

export async function isAdmin(): Promise<boolean> {
  const session = await auth()
  const email = session?.user?.email?.trim().toLowerCase()
  if (!email) return false
  const admin = await prisma.admin.findUnique({ where: { email } })
  return !!admin
}
