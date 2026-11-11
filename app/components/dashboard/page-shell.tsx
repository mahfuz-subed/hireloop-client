import type { ComponentProps, ReactNode } from "react"

import { cn } from "@/lib/utils"

/**
 * Consistent page padding + max width for every dashboard screen.
 * Pass a `className` such as `max-w-3xl` to narrow a single page.
 */
export function PageShell({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 lg:px-8",
        className
      )}
      {...props}
    />
  )
}

type PageHeaderProps = {
  breadcrumb?: ReactNode
  title: string
  description?: ReactNode
  action?: ReactNode
  className?: string
}

/** Title block shared by the dashboard pages. Stacks on small screens. */
export function PageHeader({
  breadcrumb,
  title,
  description,
  action,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
        className
      )}
    >
      <div className="min-w-0">
        {breadcrumb ? (
          <div className="mb-2 flex flex-wrap items-center gap-1 text-[11px] text-zinc-500">
            {breadcrumb}
          </div>
        ) : null}
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description ? (
          <p className="mt-1 max-w-2xl text-xs text-zinc-500">{description}</p>
        ) : null}
      </div>

      {action ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {action}
        </div>
      ) : null}
    </div>
  )
}
