import Link from "next/link"
import { notFound } from "next/navigation"
import { Breadcrumbs } from "@/components/site/breadcrumbs"
import { ItemDetail } from "@/components/site/item-detail"
import { getItemById } from "@/lib/mock-data"

type PageProps = {
  params: {
    id: string
  }
}

export default function SolutionDetailPage({ params }: PageProps) {
  const item = getItemById("solution", params.id)

  if (!item) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <Link href="/" className="text-xl font-semibold text-foreground">
            Auroville Problem-Solution Platform
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 space-y-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Solutions", href: `/category/solutions/${item.categorySlug}` },
            { label: item.categoryName, href: `/category/solutions/${item.categorySlug}` },
            { label: item.title },
          ]}
        />

        <ItemDetail item={item} />
      </main>
    </div>
  )
}
