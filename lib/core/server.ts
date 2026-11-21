"use server"
import { auth } from "@/lib/auth" // path to your Better Auth server instance
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export const getSession = async () => {
  "use server"
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  })
  return session
}

export const getToken = async () => {
  const session = await getSession()
  if (!session || !session.session?.token) {
    redirect("/unauthorized")
  }
  return session.session.token
}

export const authFetch = async (api: string) => {
  const token = await getToken()
  const res = await fetch(api, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  })
  return res
}

export const requireRole = async (role: string) => {
  const session = await getSession()
  if (!session || session?.user.role !== role) {
    redirect("/unauthorized")
  }
  return session
}
