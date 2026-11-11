/** Auth types shared by the auth form, auth pages and better-auth helpers. */

export type AuthMode = "signin" | "signup"

/** Mirrors the `user.additionalFields.role` enum in `lib/auth.ts`. */
export type UserRole = "seeker" | "recruiter" | "admin"

export type AuthFormData = {
  email: string
  password: string
  name?: string
  role?: UserRole
}
