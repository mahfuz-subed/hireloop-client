import Link from "next/link"
import { redirect } from "next/navigation"
import {
  ArrowLeft,
  Check,
  CircleAlert,
  CreditCard,
  Lock,
  ReceiptText,
} from "lucide-react"

import { CopyButton } from "@/app/components/payments/copy-button"
import { checkoutVerify } from "@/lib/actions/payments"
import { stripe } from "@/lib/stripe"

/**
 * Shown after Stripe sends the buyer back from the hosted checkout page:
 *
 *   /payments/success?session_id=cs_test_...
 *
 * This is a server component, so it can read Stripe directly. The only
 * interactive thing on the page is the little "Copy" button next to the
 * transaction id, which is a separate client component.
 */

/** 2000 + "usd" -> "$20.00" */
const formatAmount = (amount: number | null, currency: string | null) => {
  if (amount === null || !currency) return "—"

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100)
}

/** Stripe gives dates in seconds since 1970. */
const formatDate = (seconds: number | null) => {
  if (!seconds) return "—"

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(seconds * 1000))
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id } = await searchParams

  if (!session_id)
    throw new Error("Please provide a valid session_id (`cs_test_...`)")

  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items", "payment_intent"],
  })

  // The buyer never finished paying: nothing to show yet.
  if (session.status === "open") {
    return redirect("/")
  }

  // Marks the buyer as premium on the Express server (and stores the payment).
  await checkoutVerify(session_id)

  const {
    line_items,
    amount_total,
    currency,
    created,
    customer_details,
    payment_method_types,
  } = session

  const email = session.customer_email ?? customer_details?.email ?? null
  const planName = line_items?.data[0]?.description ?? "Hireloop Pro Plan"
  const paymentMethod = payment_method_types[0] ?? "card"

  // `payment_intent` is expanded to an object, but it can still be a plain
  // string (or null) for sessions where no payment was created.
  const paymentIntent =
    typeof session.payment_intent === "object" && session.payment_intent !== null
      ? session.payment_intent
      : null

  const transactionId = paymentIntent?.id ?? null
  const isPaid = session.payment_status === "paid"

  return (
    <div className="min-h-svh bg-[#010103] text-zinc-100">
      <header className="border-b border-white/10">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/browse-jobs"
            className="inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-zinc-100"
          >
            <ArrowLeft aria-hidden className="size-4" />
            Back to jobs
          </Link>

          <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[10px] font-semibold tracking-wider text-amber-400 uppercase">
            Sandbox
          </span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-lg px-4 py-10 sm:px-6 lg:py-14">
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
          {/* ------------------------------------------------ headline */}
          <div className="flex flex-col items-center text-center">
            <span
              className={
                isPaid
                  ? "flex size-14 items-center justify-center rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/30"
                  : "flex size-14 items-center justify-center rounded-full bg-amber-500/10 ring-1 ring-amber-500/30"
              }
            >
              {isPaid ? (
                <Check
                  aria-hidden
                  className="size-7 text-emerald-400"
                  strokeWidth={3}
                />
              ) : (
                <CircleAlert aria-hidden className="size-7 text-amber-400" />
              )}
            </span>

            <h1 className="mt-4 text-xl font-semibold sm:text-2xl">
              {isPaid ? "Payment successful" : "Payment not completed"}
            </h1>

            <p className="mt-1.5 max-w-sm text-sm text-zinc-400">
              {isPaid
                ? email
                  ? `Thanks, ${email}. Your Hireloop Pro plan is now active.`
                  : "Thanks! Your Hireloop Pro plan is now active."
                : "We could not confirm this payment yet. If money left your account, contact support with the transaction id below."}
            </p>
          </div>

          {/* -------------------------------------------------- amount */}
          <div className="mt-7 flex items-end justify-between gap-4 rounded-xl border border-white/10 bg-[#0b0c0f] px-4 py-4">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold tracking-wider text-zinc-500 uppercase">
                Amount paid
              </p>
              <p className="mt-1 truncate text-2xl font-semibold">
                {formatAmount(amount_total, currency ?? null)}
              </p>
            </div>

            <span
              className={
                isPaid
                  ? "inline-flex shrink-0 items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-300"
                  : "inline-flex shrink-0 items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[11px] font-medium text-amber-300"
              }
            >
              {isPaid ? "Paid" : "Pending"}
            </span>
          </div>

          {/* ------------------------------------------------- details */}
          <dl className="mt-6 space-y-3 text-sm">
            <DetailRow label="Plan" value={planName} />
            <DetailRow
              label="Payment method"
              value={
                <span className="inline-flex items-center gap-1.5 capitalize">
                  <CreditCard aria-hidden className="size-3.5 text-zinc-400" />
                  {paymentMethod}
                </span>
              }
            />
            <DetailRow label="Date" value={formatDate(created)} />
            {email ? (
              <DetailRow
                label="Email"
                value={<span className="break-all">{email}</span>}
              />
            ) : null}
            <DetailRow
              label="Status"
              value={<span className="capitalize">{session.status}</span>}
            />
          </dl>

          {/* ------------------------------------------ transaction id */}
          <div className="mt-6 rounded-xl border border-white/10 bg-[#0b0c0f] p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="flex items-center gap-1.5 text-[10px] font-semibold tracking-wider text-zinc-500 uppercase">
                <ReceiptText aria-hidden className="size-3.5" />
                Transaction ID
              </p>

              {transactionId ? <CopyButton value={transactionId} /> : null}
            </div>

            <p className="mt-2 font-mono text-[11px] leading-relaxed break-all text-zinc-200">
              {transactionId ?? "Not available"}
            </p>

            <p className="mt-1 text-[11px] text-zinc-500">
              Keep this id if you need help with the payment.
            </p>
          </div>

          <div className="mt-3 rounded-xl border border-white/10 px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[10px] font-semibold tracking-wider text-zinc-500 uppercase">
                Checkout session
              </p>
              <CopyButton value={session.id} />
            </div>
            <p className="mt-1.5 font-mono text-[11px] leading-relaxed break-all text-zinc-400">
              {session.id}
            </p>
          </div>
        </div>

        {/* -------------------------------------------------- actions */}
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Link
            href="/browse-jobs"
            className="inline-flex h-11 items-center justify-center rounded-lg bg-brand text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            Browse more jobs
          </Link>

          <Link
            href="/dashboard/seeker/applications"
            className="inline-flex h-11 items-center justify-center rounded-lg border border-white/10 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40"
          >
            My applications
          </Link>
        </div>

        <p className="mt-6 text-center text-[11px] text-zinc-500">
          A receipt has been sent to {email ?? "your email address"}.
        </p>

        <footer className="mt-8 text-center text-[11px] text-zinc-600">
          <p className="flex items-center justify-center gap-1.5">
            <Lock aria-hidden className="size-3" />
            Secured by
            <span className="font-semibold text-zinc-400">Stripe</span>
          </p>
          <p className="mt-1">Terms · Privacy</p>
        </footer>
      </main>
    </div>
  )
}

/** One "label — value" line inside the receipt. */
function DetailRow({
  label,
  value,
}: {
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="shrink-0 text-zinc-500">{label}</dt>
      <dd className="min-w-0 text-right text-zinc-200">{value}</dd>
    </div>
  )
}
