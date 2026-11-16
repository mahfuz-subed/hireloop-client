import type { RemoteFlag } from "@/types/job"

/**
 * Job application types.
 *
 * `Application` is one document in the `applications` collection.
 * `ApplicationInput` is what the "Apply Now" button sends. The server fills in
 * `status`, `archived`, `appliedAt` and `updatedAt`, so the browser can never
 * fake them.
 */

/** The stages an application moves through. */
export const APPLICATION_STATUSES = [
  "applied",
  "review",
  "shortlisted",
  "interview",
  "offered",
  "rejected",
] as const

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number]

export type Application = {
  _id: string

  /** Who applied. */
  seekerId: string
  seekerName: string
  seekerEmail: string
  seekerPhone?: string
  resumeUrl?: string
  coverLetter?: string

  /**
   * What they applied to. These are copied from the job on purpose: if the
   * recruiter later edits or deletes the job, the application row still makes
   * sense.
   */
  jobId: string
  jobTitle: string
  companyName: string
  jobType: string
  category: string
  location: string
  isRemote: RemoteFlag

  /** Where the application stands. */
  status: ApplicationStatus
  archived: boolean
  appliedAt: string
  updatedAt: string
}

/** Everything the browser is allowed to send when applying. */
export type ApplicationInput = Pick<
  Application,
  | "seekerId"
  | "seekerName"
  | "seekerEmail"
  | "seekerPhone"
  | "resumeUrl"
  | "coverLetter"
  | "jobId"
  | "jobTitle"
  | "companyName"
  | "jobType"
  | "category"
  | "location"
  | "isRemote"
>
