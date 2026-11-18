import { headers } from "next/headers"

import { CheckoutView } from "@/app/components/payments/checkout-view"
import { auth } from "@/lib/auth"

/**
 * Payment / Checkout
 *
 * A server component, so it can be `async` and read things before the page is
 * sent to the browser:
 *
 *   - `searchParams`  -> Stripe sends people back with `?canceled=true`
 *   - `getSession()`  -> the signed-in user, used to pre-fill the email
 *
 * No `useState`, no `onClick`, no `"use client"` here. The interactive parts
 * (the currency switch) live in `CheckoutView`, because a server component
 * cannot hold state or handlers.
 */
const PaymentsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ canceled?: string; plan?: string }>
}) => {
  const { canceled } = await searchParams

  if (canceled) {
    console.log(
      "Order canceled -- continue to shop around and check out when you're ready."
    )
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  })

  return <CheckoutView email={session?.user.email} />
}

export default PaymentsPage
