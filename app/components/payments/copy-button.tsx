"use client"

import * as React from "react"
import { Check, Copy } from "lucide-react"

/**
 * Tiny "copy to clipboard" button used by the receipt page.
 *
 * It lives in its own client component because `app/payments/success/page.tsx`
 * is a server component and cannot hold state or click handlers.
 */
export function CopyButton({
  value,
  label = "Copy",
}: {
  /** The text that ends up in the clipboard. */
  value: string
  /** Text shown on the button. */
  label?: string
}) {
  const [copied, setCopied] = React.useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      // Go back to "Copy" after a moment.
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard access can be blocked by the browser. Nothing to do here.
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-white/10 px-2 py-1 text-[11px] font-medium text-zinc-400 transition-colors hover:bg-white/5 hover:text-zinc-200"
    >
      {copied ? (
        <Check aria-hidden className="size-3 text-emerald-400" />
      ) : (
        <Copy aria-hidden className="size-3" />
      )}
      {copied ? "Copied" : label}
    </button>
  )
}
