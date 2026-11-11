import type { JobRow } from "@/types/job"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

export const getJobs = async (): Promise<JobRow[]> => {
  const res = await fetch(`${BASE_URL}/jobs`)
  const data = await res.json()
  return data as JobRow[]
}
