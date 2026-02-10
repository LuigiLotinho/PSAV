type RankingGridProps = {
  /** Solutions: impact, urgency, feasibility (English). Problems: impact, urgency (Dringlichkeit), reach (Reichweite). */
  rankings: Record<string, number>
}

const solutionMeta = [
  { key: "impact", label: "Impact", color: "bg-red-500" },
  { key: "urgency", label: "Urgency", color: "bg-orange-500" },
  { key: "feasibility", label: "Feasibility", color: "bg-yellow-500" },
] as const

const problemMeta = [
  { key: "impact", label: "Impact", color: "bg-red-500" },
  { key: "urgency", label: "Urgency", color: "bg-orange-500" },
  { key: "reach", label: "Reach", color: "bg-blue-500" },
] as const

export function RankingGrid({ rankings }: RankingGridProps) {
  const isProblem = "reach" in rankings
  const rankingMeta = isProblem ? problemMeta : solutionMeta
  const entries = rankingMeta.filter((meta) => meta.key in rankings)
  return (
    <div className={`grid gap-4 ${entries.length === 3 ? "grid-cols-1 md:grid-cols-3" : "grid-cols-2 md:grid-cols-5"}`}>
      {entries.map((meta) => {
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
