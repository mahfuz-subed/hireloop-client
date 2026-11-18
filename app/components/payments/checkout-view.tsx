"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowLeft, CircleHelp, CreditCard, Info, Lock } from "lucide-react"

import { Toaster, toast } from "@/components/ui/toast"
import { cn } from "@/lib/utils"

/**
 * The interactive half of the checkout screen.
 *
 * `app/payments/page.tsx` is a server component, so it cannot hold state or
 * click handlers. It reads the session and passes the email down here.
 *
 * The "Pay" button does not charge anything yet - it only shows a message.
 * When you add Stripe, replace the body of `handlePay` with:
 *
 *   const res = await fetch("/api/checkout_sessions", { method: "POST" })
 *   const { url } = await res.json()
 *   window.location.href = url        // -> Stripe's hosted checkout page
 */

/** What the seeker is buying. Shown on the left and used for the total. */
const PLAN_NAME = "Hireloop Pro Plan"
const PLAN_DESCRIPTION = "Access to all features"
const PLAN_PRICE_USD = 20

/** 1 USD = 127.6665 BDT, so the plan costs 2,553.33 BDT. */
const USD_TO_BDT = 127.6665
const PLAN_PRICE_BDT = PLAN_PRICE_USD * USD_TO_BDT

const COUNTRIES = [
  "Bangladesh",
  "United States",
  "United Kingdom",
  "Canada",
  "Germany",
  "India",
]

/** 2553.33 -> "2,553.33" */
const formatAmount = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)

type Currency = "bdt" | "usd"

const inputClass =
  "h-10 w-full rounded-md border border-white/10 bg-white/[0.04] px-3 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition-colors focus:border-[#0570de] focus:ring-2 focus:ring-[#0570de]/30"

const labelClass =
  "text-[10px] font-semibold tracking-wider text-zinc-500 uppercase"

type CheckoutViewProps = {
  /** The signed-in user's email, used to pre-fill the form. */
  email?: string
  /** `true` when Stripe sent the user back after a canceled payment. */
  canceled?: boolean
}

export function CheckoutView({ email, canceled = false }: CheckoutViewProps) {
  const [currency, setCurrency] = React.useState<Currency>("bdt")
  const [isPaying, setIsPaying] = React.useState(false)

  // Shown in the summary boxes and used by the Pay button.
  const total =
    currency === "bdt"
      ? `BDT ${formatAmount(PLAN_PRICE_BDT)}`
      : `$${formatAmount(PLAN_PRICE_USD)}`

  async function handlePay(event: React.FormEvent<HTMLFormElement>) {
    // Stop the browser from reloading the page.
    event.preventDefault()
    setIsPaying(true)

    const res = await fetch("/api/checkout_sessions", { method: "POST" })
    const data = await res.json()

    if (!res.ok) {
      toast.add({ title: data.error ?? "Could not start checkout." })
      setIsPaying(false)
      return
    }

    // Hand the browser over to Stripe's hosted checkout page.
    // `isPaying` stays `true` on purpose: we are leaving this page now.
    window.location.href = data.url
  }

  return (
      <div className="min-h-svh bg-[#010103] text-zinc-100">
        <header className="border-b border-white/10">
          <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4 sm:px-6">
            <Link
              href="/browse-jobs"
              className="inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-zinc-100"
            >
              <ArrowLeft aria-hidden className="size-4" />
              Back
            </Link>

            <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[10px] font-semibold tracking-wider text-amber-400 uppercase">
              Sandbox
            </span>
          </div>
        </header>

        <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:py-12">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            {/* ------------------------------------------------------ left */}
            <section>
              <p className={labelClass}>Choose a currency:</p>

              <div className="mt-2 grid grid-cols-2 gap-3">
                <CurrencyButton
                  active={currency === "bdt"}
                  onClick={() => setCurrency("bdt")}
                  label={`BDT ${formatAmount(PLAN_PRICE_BDT)}`}
                  flag={
                    <span
                      aria-hidden
                      className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#006a4e]"
                    >
                      <span className="size-2 rounded-full bg-[#f42a41]" />
                    </span>
                  }
                />

                <CurrencyButton
                  active={currency === "usd"}
                  onClick={() => setCurrency("usd")}
                  label={`$${formatAmount(PLAN_PRICE_USD)}`}
                  flag={
                    <span
                      aria-hidden
                      className="h-3.5 w-5 shrink-0 rounded-[2px] bg-[repeating-linear-gradient(180deg,#b22234_0_2px,#ffffff_2px_4px)] ring-1 ring-white/20 ring-inset"
                    />
                  }
                />
              </div>

              <p className="mt-2 text-[11px] text-zinc-500">
                1 USD = {USD_TO_BDT} BDT
              </p>

              <div className="mt-8 flex items-start justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium">{PLAN_NAME}</p>
                  <p className="mt-0.5 text-xs text-zinc-500">
                    {PLAN_DESCRIPTION}
                  </p>
                </div>
                <p className="shrink-0 text-sm font-semibold">{total}</p>
              </div>

              <div className="mt-3 flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-4 text-sm">
                <span className="text-zinc-400">Total due today</span>
                <span className="font-semibold">{total}</span>
              </div>

              <p className="mt-6 text-[11px] leading-relaxed text-zinc-500">
                A plan is needed to apply for more than 10 jobs. You are charged
                once and can keep applying afterwards.
              </p>
            </section>

            {/* ----------------------------------------------------- right */}
            <section>
              <form
                onSubmit={handlePay}
                action="/api/checkout_sessions"
                method="POST"
              >
                {/* Stripe sends the user back here with `?canceled=true`. */}
                {canceled ? (
                  <div className="mb-4 flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2.5 text-xs text-amber-300">
                    <Info aria-hidden className="mt-0.5 size-3.5 shrink-0" />
                    <span>
                      Payment was canceled. You can try again whenever you are
                      ready.
                    </span>
                  </div>
                ) : null}

                {/* Stripe's express checkout bar (visual only for now) */}
                <div
                  aria-hidden
                  className="flex h-11 items-center justify-center gap-2 rounded-lg bg-[#00d66f]"
                >
                  <span className="rounded-[4px] bg-[#0a0a0a] px-2.5 py-1 text-[11px] font-semibold text-white">
                    Link
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-[4px] bg-[#f6f8fb] px-2.5 py-1 text-[11px] font-semibold text-[#0a0a0a]">
                    <CreditCard className="size-3" />
                    card
                  </span>
                </div>

                <h2 className="mt-6 text-sm font-semibold">
                  Contact information
                </h2>

                <div className="mt-3">
                  <label htmlFor="email" className={labelClass}>
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="email@example.com"
                    defaultValue={email}
                    className={cn(inputClass, "mt-1.5")}
                  />
                </div>

                <h2 className="mt-6 text-sm font-semibold">Payment method</h2>

                <div className="mt-3 flex items-center gap-2 rounded-md border border-white/10 px-3 py-2.5 text-sm">
                  <CreditCard aria-hidden className="size-4 text-zinc-400" />
                  Card
                </div>

                <div className="mt-3 rounded-lg border border-white/10 bg-white/[0.02] p-3">
                  <p className={labelClass}>Card information</p>

                  <div className="relative mt-2">
                    <input
                      aria-label="Card number"
                      placeholder="1234 1234 1234 1234"
                      inputMode="numeric"
                      autoComplete="cc-number"
                      className={cn(inputClass, "pr-24")}
                    />
                    <div
                      aria-hidden
                      className="pointer-events-none absolute top-1/2 right-2.5 flex -translate-y-1/2 items-center gap-1"
                    >
                      <span className="rounded-[3px] bg-white/90 px-1 text-[8px] font-bold text-[#1434cb]">
                        VISA
                      </span>
                      <span className="rounded-[3px] bg-white/90 px-1 text-[8px] font-bold text-[#eb001b]">
                        MC
                      </span>
                      <span className="rounded-[3px] bg-white/90 px-1 text-[8px] font-bold text-[#2e77bb]">
                        AMEX
                      </span>
                    </div>
                  </div>

                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <input
                      aria-label="Expiry date"
                      placeholder="MM / YY"
                      autoComplete="cc-exp"
                      className={inputClass}
                    />
                    <div className="relative">
                      <input
                        aria-label="CVC"
                        placeholder="CVC"
                        autoComplete="cc-csc"
                        className={cn(inputClass, "pr-9")}
                      />
                      <CircleHelp
                        aria-hidden
                        className="pointer-events-none absolute top-1/2 right-3 size-3.5 -translate-y-1/2 text-zinc-500"
                      />
                    </div>
                  </div>

                  <div className="mt-3">
                    <label htmlFor="cardholder" className={labelClass}>
                      Cardholder name
                    </label>
                    <input
                      id="cardholder"
                      name="cardholder"
                      autoComplete="cc-name"
                      placeholder="Full name on card"
                      className={cn(inputClass, "mt-1.5")}
                    />
                  </div>

                  <div className="mt-3">
                    <label htmlFor="country" className={labelClass}>
                      Country or region
                    </label>
                    <select
                      id="country"
                      name="country"
                      defaultValue="Bangladesh"
                      className={cn(inputClass, "appearance-none bg-[#0f1012]")}
                    >
                      {COUNTRIES.map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <label className="mt-4 flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="mt-0.5 size-4 shrink-0 rounded border-white/20 bg-white/5 accent-[#0570de]"
                  />
                  <span className="text-xs text-zinc-300">
                    Save my information for faster checkout
                    <span className="mt-0.5 block text-[11px] text-zinc-500">
                      Pay securely on this site and everywhere Link is accepted.
                    </span>
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={isPaying}
                  className="mt-5 h-11 w-full rounded-md bg-[#0570de] text-sm font-semibold text-white transition-colors hover:bg-[#0068cf] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isPaying ? "Redirecting to Stripe..." : "Pay"}
                </button>

                <p className="mt-3 text-center text-[11px] text-zinc-500">
                  You will be redirected to Stripe to finish the payment.
                </p>
              </form>
            </section>
          </div>
        </main>

        <footer className="mx-auto w-full max-w-5xl px-4 pb-10 text-center text-[11px] text-zinc-600">
          <p className="flex items-center justify-center gap-1.5">
            <Lock aria-hidden className="size-3" />
            Powered by{" "}
            <span className="font-semibold text-zinc-400">Stripe</span>
          </p>
          <p className="mt-1">Terms · Privacy</p>
        </footer>

        {/* Shows the message when "Pay" is clicked. */}
        <Toaster />
      </div>
    )
}

/** One of the two currency options on the left. */
function CurrencyButton({
  active,
  onClick,
  flag,
  label,
}: {
  active: boolean
  onClick: () => void
  flag: React.ReactNode
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex h-11 items-center gap-2.5 rounded-lg border px-3 text-sm transition-colors",
        active
          ? "border-zinc-500 bg-white/[0.06] text-zinc-100"
          : "border-white/10 text-zinc-400 hover:border-white/20 hover:text-zinc-200"
      )}
    >
      {flag}
      <span className="font-medium">{label}</span>
    </button>
  )
}
