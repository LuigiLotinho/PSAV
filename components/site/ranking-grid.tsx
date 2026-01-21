import type { Rankings } from "@/lib/mock-data"

type RankingGridProps = {
  rankings: Rankings
}

const rankingMeta = [
  { key: "impact", label: "Impact", color: "bg-red-500" },
  { key: "urgency", label: "Urgency", color: "bg-orange-500" },
  { key: "feasibility", label: "Feasibility", color: "bg-yellow-500" },
  { key: "affected", label: "Affected", color: "bg-blue-500" },
  { key: "costs", label: "Costs", color: "bg-purple-500" },
] as const

export function RankingGrid({ rankings }: RankingGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {rankingMeta.map((meta) => {
        const value = rankings[meta.key]
        return (
          <div key={meta.key} className="text-center p-4 bg-muted/50 rounded-xl">
            <div className={`w-12 h-12 ${meta.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
              <span className="text-xl font-bold text-white">{value}</span>
            </div>
            <div className="text-sm font-medium">{meta.label}</div>
          </div>
        )
      })}
    </div>
  )
}
