import { NextResponse } from "next/server"
import { headers } from "next/headers"

import { stripe } from "../../../lib/stripe"
import { getSession } from "@/lib/core/server"

export async function POST() {
  const userSession = await getSession()
  try {
    const headersList = await headers()
    const origin = headersList.get("origin")

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, price_1234) of the product you want to sell
          price: "price_1UcHzXRtwAf8bjNj8gbu15Aj",
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: userSession?.user?.email,
      metadata: {
        userId: userSession?.user.id,
      },
      success_url: `${origin}/payments/success?session_id={CHECKOUT_SESSION_ID}`,
      // Where Stripe sends the user if they click "back" on Stripe's page.
      // `app/payments/page.tsx` checks for this `canceled` flag.
      cancel_url: `${origin}/payments?canceled=true`,
      // Provide a name (for example, hosted_web_0001) to label this Checkout integration and measure its conversion independently
      integration_identifier: "hire_loop_web_001",
    })
    // Send the URL back as JSON so the client can decide when to navigate.
    return NextResponse.json({ url: session.url })
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err))
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
