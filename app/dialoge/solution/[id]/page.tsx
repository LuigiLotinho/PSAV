import Link from "next/link"
import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import { isAdmin } from "@/lib/auth"

export const dynamic = "force-dynamic"

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function DialogeSolutionPage({ params }: PageProps) {
  const { id } = await params
  const solution = await prisma.solution.findUnique({
    where: { id },
    select: { id: true, visible: true },
  })
  if (!solution) notFound()
  const admin = await isAdmin()
  if (!admin && !solution.visible) notFound()

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <Link href="/" className="text-xl font-semibold text-foreground">
            Auroville Problem-Solution Platform
          </Link>
        </div>
      </header>
      <main className="container mx-auto px-4 py-10">
        <p className="text-xl font-medium">Join the dialogue</p>
      </main>
    </div>
  )
}
