import type { Application, ApplicationInput } from "@/types/application"
import { authFetch } from "../core/server"

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

/**
 * Loads applications for the "My Applications" page, newest first.
 *
 * The query is a plain string, just like `getApplicationsCount`:
 *
 *   getApplications(`seekerId=${user.id}`)
 *   getApplications(`seekerId=${user.id}&archived=false`)
 *   getApplications()  // every application
 */
export const getApplications = async (query = ""): Promise<Application[]> => {
  const api = `${BASE_URL}/applications?${query}`
  const res = await authFetch(api)
  return res.json()
}

export const getApplicationsCount = async (
  query = ""
): Promise<{ count: number }> => {
  const res = await fetch(`${BASE_URL}/applications/count?${query}`)
  return res.json()
}

export const updateApplicationStatus = async (
  id: string,
  data: { status: string }
) => {
  const response = await fetch(`${BASE_URL}/applications${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  return response.json()
}
