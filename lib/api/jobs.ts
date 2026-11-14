import type { JobRow } from "@/types/job"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

export const getJobs = async (query = ""): Promise<JobRow[]> => {
  const res = await fetch(`${BASE_URL}/jobs?${query}`, { cache: "no-store" })
  const data = await res.json()
  return data as JobRow[]
}

/** One job by id. Returns `null` when the API has no job with that id. */
export const getJob = async (id: string): Promise<JobRow | null> => {
  const res = await fetch(`${BASE_URL}/jobs/${id}`, { cache: "no-store" })
  if (!res.ok) return null

  const data = await res.json()
  return data as JobRow | null
}
