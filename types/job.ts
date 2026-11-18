/**
 * Shared job types and option lists.
 *
 * `Job` is the persisted shape returned by the API.
 * `JobInput` is the payload used to create a job (no `_id` yet).
 * `JobRow` is a persisted job plus the extra columns the recruiter table needs.
 */

export const JOB_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
] as const

export type JobType = (typeof JOB_TYPES)[number]

export const SALARY_FREQUENCIES = ["per hour", "per month", "per year"] as const

export type SalaryFrequency = (typeof SALARY_FREQUENCIES)[number]

export const JOB_CATEGORIES = [
  "Engineering & Tech",
  "Design",
  "Marketing",
  "Sales",
  "Operations",
  "Finance",
  "Other",
] as const

export type JobCategory = (typeof JOB_CATEGORIES)[number]

export type JobStatus = "active" | "expired"

/** The API stores booleans as the strings "true" / "false". */
export type RemoteFlag = "true" | "false"

export type Job = {
  _id: string
  title: string
  recruiterId: string
  companyName: string
  category: string
  jobType: string
  isRemote: RemoteFlag
  location: string
  deadline: string
  minSalary: string
  maxSalary: string
  frequency: string
  responsibilities: string
  qualifications: string
}

/** Everything the create form sends. The server assigns `_id`. */
export type JobInput = Omit<Job, "_id" | "recruiterId">

/** A job as rendered in the recruiter "Manage Jobs" table. */
export type JobRow = {
  _id: string
  title: string
  recruiterId: string
  companyName: string
  category: string
  jobType: string
  isRemote: RemoteFlag
  location: string
  deadline: string
  minSalary: string
  maxSalary: string
  frequency: string
  responsibilities: string
  qualifications: string
  applicants: number
  status: JobStatus
  posted: string
}
