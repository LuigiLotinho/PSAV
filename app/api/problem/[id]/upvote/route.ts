import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

type RouteContext = {
  params: Promise<{
    id: string
  }>
}

export async function POST(_: Request, context: RouteContext) {
  const { id } = await context.params
  const updated = await prisma.problem.update({
    where: { id },
    data: {
      upvotes: { increment: 1 },
    },
  })
  return NextResponse.json({ upvotes: updated.upvotes })
}
