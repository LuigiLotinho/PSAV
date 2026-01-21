import { Badge } from "@/components/ui/badge"
import { RankingGrid } from "@/components/site/ranking-grid"
import type { Item } from "@/lib/mock-data"

type ItemDetailProps = {
  item: Item
}

export function ItemDetail({ item }: ItemDetailProps) {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
        <Badge variant="secondary">{item.categoryName}</Badge>
        <span>{item.upvotes} upvotes</span>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">{item.title}</h1>
      </div>

      <div className="bg-primary/5 border-l-4 border-primary p-4 rounded-r-lg">
        <p className="text-lg text-foreground">{item.short_text}</p>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">Detailed Description</h2>
        <p className="text-muted-foreground">{item.long_text}</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Rankings (1–10)</h2>
        <RankingGrid rankings={item.rankings} />
      </div>
    </div>
  )
}
