"use client"

import * as React from "react"
import Link from "next/link"
import { Eye, EyeOff, ImagePlus, Lock, Mail, User, Users } from "lucide-react"

import { cn } from "@/lib/utils"
import type { AuthFormData, AuthMode, UserRole } from "@/types/auth"

// Re-exported so existing imports from "@/components/auth-form" keep working.
export type { AuthFormData, AuthMode, UserRole }

const COPY = {
  signin: {
    title: "Welcome back",
    subtitle: "Sign in to continue your job hunt.",
    submitLabel: "Sign In",
    showName: false,
    footer: "New to HireLoop?",
    footerLinkHref: "/sign-up",
    footerLinkLabel: "Create an account",
  },
  signup: {
    title: "Create your account",
    subtitle: "Three minutes to set up. Matches start arriving today.",
    submitLabel: "Sign Up",
    showName: true,
    footer: "Already have an account?",
    footerLinkHref: "/sign-in",
    footerLinkLabel: "Sign in",
  },
} as const

const inputClass =
  "h-12 w-full rounded-lg border border-white/10 bg-[#1A1A1F] pl-10 pr-3 text-base tracking-[-0.0125rem] text-[#EDEDEF] shadow-[inset_0_3px_10px_rgba(255,255,255,0.04)] outline-none transition-colors placeholder:text-white/60 focus:border-[#5C53FE]/60 focus:ring-2 focus:ring-[#5C53FE]/30 aria-invalid:border-destructive/60"
const labelClass = "mb-2 block text-left text-sm text-[#EDEDEF]/80"

// Sign-up role picker — values match better-auth's `role` field in lib/auth.ts.
const ROLES: {
  value: UserRole
  label: string
  icon: React.ComponentType<{ className?: string }>
}[] = [
  { value: "seeker", label: "Job Seeker", icon: Users },
  { value: "recruiter", label: "Recruiter", icon: User },
]

const rolePillClass =
  "flex h-full w-full cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border px-2 py-3 text-sm tracking-[-0.0125rem] transition-colors has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-[#5C53FE]/60"

export function AuthForm({
  mode,
  onSubmit,
  error,
}: {
  mode: AuthMode
  /** Called with the collected form values when the form is submitted. */
  onSubmit?: (data: AuthFormData) => void
  /** Shown under the submit button, e.g. an auth API error message. */
  error?: string | null
}) {
  const copy = COPY[mode]
  const isSignup = mode === "signup"

  const [values, setValues] = React.useState<AuthFormData>({
    email: "",
    password: "",
    name: "",
    role: "seeker",
  })
  const [showPassword, setShowPassword] = React.useState(false)
  const [imageFile, setImageFile] = React.useState<File | null>(null)
  const [isUploading, setIsUploading] = React.useState(false)
  const [uploadError, setUploadError] = React.useState<string | null>(null)

  const setField =
    (field: keyof AuthFormData) =>
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setValues((prev) => ({ ...prev, [field]: event.target.value }))

  /**
   * Runs when the user picks an image in the sign-up form.
   *
   * 1. Saves the file so the field can show its name.
   * 2. Sends it to `/api/upload`, which uploads it to imgbb (the API key is a
   *    server-only secret, so the browser must not call imgbb itself).
   * 3. Stores the returned URL in the form values as `image`.
   */
  async function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null

    setImageFile(file)
    setUploadError(null)
    setValues((prev) => ({ ...prev, image: undefined }))

    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("image", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result?.error || "The image could not be uploaded.")
      }

      // Sign-up reads this value and sends it to better-auth as `image`.
      setValues((prev) => ({ ...prev, image: result.url }))
    } catch (error) {
      setUploadError(
        error instanceof Error
          ? error.message
          : "The image could not be uploaded."
      )
    } finally {
      setIsUploading(false)
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    // Collect the form data; wire this into better-auth later.
    const data: AuthFormData = {
      email: values.email,
      password: values.password,
      ...(isSignup
        ? { name: values.name, role: values.role, image: values.image }
        : {}),
    }
    console.log(`${mode} form data:`, data)
    onSubmit?.(data)
  }

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-[#101010]/95 p-8 shadow-[inset_0_3px_10px_rgba(255,255,255,0.06)]">
      <div className="mb-8 flex flex-col gap-2 text-center">
        <h1 className="font-heading text-[28px] leading-[1.15] font-bold tracking-[-0.02em] text-white">
          {copy.title}
        </h1>
        <p className="text-base leading-[1.6] text-white/70">{copy.subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {copy.showName ? (
          <fieldset>
            <legend className={labelClass}>Joining HireLoop as</legend>
            <div className="grid grid-cols-3 gap-2">
              {ROLES.map(({ value, label, icon: Icon }) => {
                const selected = values.role === value

                return (
                  <label
                    key={value}
                    className={cn(
                      rolePillClass,
                      selected
                        ? "border-[#5C53FE] bg-[#5C53FE]/15 text-white"
                        : "border-white/10 bg-[#1A1A1F] text-white/70 hover:border-white/25 hover:text-white"
                    )}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={value}
                      checked={selected}
                      onChange={() =>
                        setValues((prev) => ({ ...prev, role: value }))
                      }
                      className="sr-only"
                    />
                    <Icon aria-hidden className="size-5" />
                    <span>{label}</span>
                  </label>
                )
              })}
            </div>
          </fieldset>
        ) : null}

        {copy.showName ? (
          <div>
            <label htmlFor="name" className={labelClass}>
              Full name
            </label>
            <div className="relative">
              <User
                aria-hidden
                className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-white/50"
              />
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                minLength={2}
                maxLength={80}
                value={values.name ?? ""}
                onChange={setField("name")}
                placeholder="Jane Doe"
                className={inputClass}
              />
            </div>
          </div>
        ) : null}

        {copy.showName ? (
          <div>
            <label htmlFor="image" className={labelClass}>
              Profile photo
            </label>
            <label
              htmlFor="image"
              className="flex h-12 w-full cursor-pointer items-center gap-3 rounded-lg border border-white/10 bg-[#1A1A1F] px-3 text-base tracking-[-0.0125rem] text-[#EDEDEF] shadow-[inset_0_3px_10px_rgba(255,255,255,0.04)] transition-colors focus-within:border-[#5C53FE]/60 focus-within:ring-2 focus-within:ring-[#5C53FE]/30 hover:border-white/25"
            >
              <ImagePlus
                aria-hidden
                className="size-5 shrink-0 text-white/50"
              />
              <span
                className={cn(
                  "truncate",
                  imageFile ? "text-[#EDEDEF]" : "text-white/60"
                )}
              >
                {isUploading
                  ? "Uploading…"
                  : imageFile
                    ? imageFile.name
                    : "Choose an image"}
              </span>
            </label>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="sr-only"
            />
            {uploadError ? (
              <p role="alert" className="mt-2 text-sm text-destructive">
                {uploadError}
              </p>
            ) : null}
          </div>
        ) : null}

        <div>
          <label htmlFor="email" className={labelClass}>
            Email address
          </label>
          <div className="relative">
            <Mail
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-white/50"
            />
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={values.email}
              onChange={setField("email")}
              placeholder="you@example.com"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <div className="flex items-baseline justify-between">
            <label htmlFor="password" className={labelClass}>
              Password
            </label>
            {isSignup ? null : (
              <Link
                href="/forgot-password"
                className="mb-2 text-sm text-[#8B85FF] transition-colors hover:text-white"
              >
                Forgot password?
              </Link>
            )}
          </div>
          <div className="relative">
            <Lock
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-white/50"
            />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete={isSignup ? "new-password" : "current-password"}
              required
              minLength={8}
              maxLength={72}
              value={values.password}
              onChange={setField("password")}
              placeholder={isSignup ? "At least 8 characters" : "Your password"}
              className={cn(inputClass, "pr-11")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-1.5 text-white/50 transition-colors hover:text-white"
            >
              {showPassword ? (
                <EyeOff aria-hidden className="size-4" />
              ) : (
                <Eye aria-hidden className="size-4" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isUploading}
          className="mt-1 h-[52px] w-full rounded-[8px] bg-[#5C53FE] text-lg font-medium text-[#EDEDEF] shadow-[inset_0_3px_10px_rgba(255,255,255,0.2)] transition-colors hover:bg-[#7B74FF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {copy.submitLabel}
        </button>

        {error ? (
          <p
            role="alert"
            className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            {error}
          </p>
        ) : null}
      </form>

      <p className="mt-8 text-center text-base text-white/70">
        {copy.footer}{" "}
        <Link
          href={copy.footerLinkHref}
          className="font-semibold text-[#8B85FF] transition-colors hover:text-white"
        >
          {copy.footerLinkLabel}
        </Link>
      </p>
    </div>
  )
}
