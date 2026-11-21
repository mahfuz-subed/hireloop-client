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

/** Colours for the small caption under a stat value. */
const HINT_TONES = {
  positive: "text-emerald-400",
  warning: "text-amber-400",
  muted: "text-zinc-500",
}

/** Exported so other screens (e.g. recruiter applicants) reuse the same card. */
export function StatCard({
  label,
  value,
  highlight,
  hint,
  hintTone = "muted",
}: {
  label: string
  value: number | string
  highlight?: boolean
  /** Optional caption under the number, e.g. "12% of all users". */
  hint?: string
  hintTone?: keyof typeof HINT_TONES
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
      {hint ? (
        <p className={cn("mt-1 text-[11px]", HINT_TONES[hintTone])}>{hint}</p>
      ) : null}
    </div>
  )
}
