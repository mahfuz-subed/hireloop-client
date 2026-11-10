import { Job } from "@/app/dashboard/recruiter/jobs/new/page"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

export const getJobs = async () => {
  const res = await fetch(`${BASE_URL}/jobs`)
  const data = await res.json()
  return data
}
