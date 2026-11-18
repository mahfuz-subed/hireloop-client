import { StatCard } from "@/app/components/dashboard/applications/application-stats"
import type { getJobApplicationStats } from "@/lib/applications-format"

type JobApplicationStatsProps = {
  stats: ReturnType<typeof getJobApplicationStats>
}

/** Pipeline summary shown above the recruiter's applicants table. */
export function JobApplicationStats({ stats }: JobApplicationStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <StatCard label="Total Applicants" value={stats.total} />
      <StatCard label="In Review" value={stats.inReview} />
      <StatCard label="Shortlisted" value={stats.shortlisted} />
      <StatCard label="Interviews" value={stats.interviews} />
    </div>
  )
}
