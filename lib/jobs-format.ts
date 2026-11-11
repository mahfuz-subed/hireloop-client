import type { JobRow, JobStatus } from "@/types/job"

const FREQUENCY_LABEL: Record<string, string> = {
  "per hour": "hr",
  "per month": "mo",
  "per year": "yr",
}

const money = (value: string) => {
  const n = Number(value)
  if (!value || Number.isNaN(n)) return "—"
  return n >= 1000 ? `€${n / 1000}k` : `€${n}`
}

export const formatCompensation = (
  job: Pick<JobRow, "minSalary" | "maxSalary" | "frequency">
) => {
  if (!job.minSalary && !job.maxSalary) return "—"
  const range = [job.minSalary, job.maxSalary]
    .filter(Boolean)
    .map(money)
    .join(" – ")
  return `${range} / ${FREQUENCY_LABEL[job.frequency] ?? job.frequency}`
}

export const formatDate = (date: string) => {
  const time = new Date(date).getTime()
  return date && !Number.isNaN(time)
    ? new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
        timeZone: "UTC",
      })
    : "—"
}

export const timeAgo = (date: string) => {
  const t = new Date(date).getTime()
  if (!date || Number.isNaN(t)) return ""
  const mins = Math.floor((Date.now() - t) / 60000)
  if (mins < 1) return "Posted just now"
  if (mins < 60) return `Posted ${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `Posted ${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `Posted ${days}d ago`
  return `Posted ${Math.floor(days / 30)}mo ago`
}

export const JOB_STATUS_STYLES: Record<
  JobStatus,
  { label: string; badge: string; dot: string }
> = {
  active: {
    label: "Active",
    badge: "bg-emerald-500/10 text-emerald-400",
    dot: "bg-emerald-400",
  },
  expired: {
    label: "Expired",
    badge: "bg-zinc-500/10 text-zinc-400",
    dot: "bg-zinc-500",
  },
}
