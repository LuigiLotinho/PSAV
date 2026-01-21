import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Item } from "@/lib/mock-data"

type ItemCardProps = {
  item: Item
  href: string
}

export function ItemCard({ item, href }: ItemCardProps) {
  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardHeader className="space-y-2">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="secondary">{item.categoryName}</Badge>
          <span>{item.upvotes} upvotes</span>
        </div>
        <CardTitle className="text-lg">
          <Link href={href} className="hover:underline">
            {item.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{item.short_text}</p>
      </CardContent>
    </Card>
  )
}
