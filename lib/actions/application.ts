import type {
  Application,
  ApplicationInput,
  ApplicationStatus,
} from "@/types/application"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

/**
 * Saves one application in the database.
 *
 * `ApplicationInput` is the list of fields the browser is allowed to send.
 * The server adds `status`, `appliedAt`, `updatedAt` and `archived` itself.
 */
export const applyToAJob = async (
  application: ApplicationInput
): Promise<Application> => {
  const res = await fetch(`${BASE_URL}/applications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(application),
  })

  const data = await res.json()

  if (!res.ok) {
    // The API sends `{ message: "..." }` for things like "already applied".
    throw new Error(data?.message ?? "Could not save the application.")
  }

  return data as Application
}

export type ApplicationQuery = {
  seekerId?: string
  jobId?: string
  status?: ApplicationStatus
  archived?: boolean
}

/** Loads applications for the "My Applications" page, newest first. */
export const getApplications = async (
  query: ApplicationQuery = {}
): Promise<Application[]> => {
  const params = new URLSearchParams()

  if (query.seekerId) params.set("seekerId", query.seekerId)
  if (query.jobId) params.set("jobId", query.jobId)
  if (query.status) params.set("status", query.status)
  if (query.archived !== undefined) {
    params.set("archived", String(query.archived))
  }

  const res = await fetch(`${BASE_URL}/applications?${params}`, {
    cache: "no-store",
  })

  if (!res.ok) return []

  return (await res.json()) as Application[]
}

export const getApplicationsCount = async (
  query = ""
): Promise<{ count: number }> => {
  const res = await fetch(`${BASE_URL}/applications/count?${query}`)
  return res.json()
}
