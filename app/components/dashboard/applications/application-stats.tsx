import { cn } from "@/lib/utils"
import type { getApplicationStats } from "@/lib/applications-format"

type ApplicationStatsProps = {
  stats: ReturnType<typeof getApplicationStats>
}

/** The four summary cards above the applications table. */
export function ApplicationStats({ stats }: ApplicationStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <StatCard label="Total Applied" value={stats.total} />
      <StatCard label="Shortlisted" value={stats.shortlisted} />
      <StatCard label="Interviews" value={stats.interviews} />
      <StatCard
        label="Success Rate"
        value={`${stats.successRate}%`}
        highlight
      />
    </div>
  )
}

function StatCard({
  label,
  value,
  highlight,
}: {
  label: string
  value: number | string
  highlight?: boolean
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-surface p-4">
      <p className="text-[11px] text-zinc-500">{label}</p>
      <p
        className={cn(
          "mt-2 text-2xl font-semibold",
          highlight ? "text-emerald-400" : "text-zinc-100"
        )}
      >
        {value}
      </p>
    </div>
  )
}
