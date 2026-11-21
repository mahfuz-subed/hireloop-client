"use server"
import { headers } from "next/headers"
import { auth } from "../auth"
import { normalizeRole } from "@/lib/users-format"
import type { AdminUser } from "@/types/user"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

export const getUsers = async () => {
  const users = await auth.api.listUsers({
    query: {
      sortBy: "name", // The field to sort by.
      sortDirection: "desc", // The direction to sort by.
    },
    // This endpoint requires session cookies.
    headers: await headers(),
  })
  return users
}

/**
 * Every user, trimmed to the fields the admin screen renders and sorted
 * newest-first. Requires an admin session - Better Auth enforces that.
 */
export const getAdminUsers = async (): Promise<AdminUser[]> => {
  const { users } = await getUsers()

  return users
    .map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image ?? null,
      role: normalizeRole(user.role),
      emailVerified: Boolean(user.emailVerified),
      createdAt: new Date(user.createdAt).toISOString(),
    }))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export const getUserPremiumById = async (userId: string) => {
  const response = await fetch(`${BASE_URL}/users/${userId}/premium`)
  return response.json()
}
