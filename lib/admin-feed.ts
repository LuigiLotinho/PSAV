import { Prisma } from "@prisma/client"
import prisma from "@/lib/prisma"

export type MergedAdminItem = {
  id: string
  type: "problem" | "solution"
  title: string
  createdAt: Date
  reviewed: boolean
}

type RawMergedRow = {
  id: string
  type: string
  title: string
  createdAt: Date
  reviewed: boolean
}

export async function getMergedAdminItemsPaginated(offset: number, limit: number): Promise<MergedAdminItem[]> {
  const rows = (await prisma.$queryRaw(
    Prisma.sql`
      SELECT id, type, title, "createdAt", reviewed
      FROM (
        SELECT id, 'problem'::text AS type, title, "createdAt", reviewed FROM "Problem"
        UNION ALL
        SELECT id, 'solution'::text AS type, title, "createdAt", reviewed FROM "Solution"
      ) AS t
      ORDER BY "createdAt" DESC
      LIMIT ${limit} OFFSET ${offset}
    `
  )) as RawMergedRow[]
  return rows.map((r: RawMergedRow) => ({
    ...r,
    type: r.type === "solution" ? "solution" : "problem",
  }))
}

export async function getMergedAdminItemsCount(): Promise<number> {
  const rows = (await prisma.$queryRaw(
    Prisma.sql`
      SELECT COUNT(*)::bigint AS count FROM (
        SELECT id FROM "Problem"
        UNION ALL
        SELECT id FROM "Solution"
      ) AS t
    `
  )) as [{ count: bigint }]
  return Number(rows[0]?.count ?? 0)
}
