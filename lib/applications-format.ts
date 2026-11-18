import type { Application, ApplicationStatus } from "@/types/application"

/** Label, pill colour and dot colour for each application status. */
export const APPLICATION_STATUS_STYLES: Record<
  ApplicationStatus,
  { label: string; badge: string; dot: string }
> = {
  applied: {
    label: "Applied",
    badge: "bg-zinc-500/10 text-zinc-300",
    dot: "bg-zinc-400",
  },
  review: {
    label: "Review",
    badge: "bg-amber-500/10 text-amber-400",
    dot: "bg-amber-400",
  },
  shortlisted: {
    label: "Shortlisted",
    badge: "bg-sky-500/10 text-sky-400",
    dot: "bg-sky-400",
  },
  interview: {
    label: "Interview",
    badge: "bg-violet-500/10 text-violet-300",
    dot: "bg-violet-400",
  },
  offered: {
    label: "Offered",
    badge: "bg-emerald-500/10 text-emerald-400",
    dot: "bg-emerald-400",
  },
  rejected: {
    label: "Rejected",
    badge: "bg-red-500/10 text-red-400",
    dot: "bg-red-400",
  },
}

/**
 * Turns a date into "2 hours ago", "4 days ago", "2 weeks ago".
 * The table column is narrow, so we spell the unit out instead of using "2h".
 */
export const formatAppliedAgo = (date: string) => {
  const time = new Date(date).getTime()
  if (!date || Number.isNaN(time)) return "—"

  const minutes = Math.floor((Date.now() - time) / 60000)
  if (minutes < 1) return "just now"
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`

  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`

  const weeks = Math.floor(days / 7)
  if (weeks < 5) return `${weeks} week${weeks === 1 ? "" : "s"} ago`

  const months = Math.floor(days / 30)
  return `${months} month${months === 1 ? "" : "s"} ago`
}

/**
 * Pipeline numbers for a recruiter's applicants screen.
 *
 * `getApplicationStats` below is seeker-facing: it asks "how am I doing?".
 * This one is recruiter-facing: it asks "where is my pipeline?".
 */
export const getJobApplicationStats = (applications: Application[]) => {
  const countByStatus = (status: ApplicationStatus) =>
    applications.filter((application) => application.status === status).length

  return {
    total: applications.length,
    inReview: countByStatus("review"),
    shortlisted: countByStatus("shortlisted"),
    interviews: countByStatus("interview"),
  }
}

/** The four numbers in the cards at the top of "My Applications". */
export const getApplicationStats = (applications: Application[]) => {
  const total = applications.length
  const shortlisted = applications.filter(
    (application) => application.status === "shortlisted"
  ).length
  const interviews = applications.filter(
    (application) => application.status === "interview"
  ).length
  const offered = applications.filter(
    (application) => application.status === "offered"
  ).length

  // "Success rate" = how many applications turned into an offer.
  const successRate = total === 0 ? 0 : Math.floor((offered / total) * 100)

  return { total, shortlisted, interviews, offered, successRate }
}
