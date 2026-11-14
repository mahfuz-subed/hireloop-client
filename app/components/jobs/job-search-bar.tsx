"use client"

import { Search } from "lucide-react"

type JobSearchBarProps = {
  /** The search term that is currently applied (comes from the URL). */
  defaultValue?: string
  /** Called with the typed text when the form is submitted. */
  onSearch: (query: string) => void
  placeholder?: string
}

/**
 * Search form. It does not store state: on submit we read the input with
 * `FormData` and hand the text to `onSearch`, which updates the URL.
 *
 * `key={defaultValue}` re-creates the input when the applied search changes
 * (for example when the list is cleared), so the box always shows what the
 * server is actually filtering by.
 */
export function JobSearchBar({
  defaultValue = "",
  onSearch,
  placeholder = "Search jobs, keywords...",
}: JobSearchBarProps) {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const query = String(formData.get("search") ?? "").trim()

    onSearch(query)
  }

  return (
    <form
      role="search"
      aria-label="Search jobs"
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 rounded-lg border border-white/10 bg-surface p-1.5 sm:flex-row sm:items-center"
    >
      <label className="flex min-w-0 flex-1 items-center gap-2.5 px-2">
        <Search aria-hidden className="size-4 shrink-0 text-zinc-500" />
        <span className="sr-only">Search jobs</span>
        <input
          key={defaultValue}
          name="search"
          defaultValue={defaultValue}
          placeholder={placeholder}
          className="h-9 min-w-0 flex-1 bg-transparent text-sm text-zinc-100 outline-none placeholder:text-zinc-500"
        />
      </label>

      <button
        type="submit"
        className="h-9 shrink-0 rounded-md bg-white px-4 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40 max-sm:w-full"
      >
        Search Jobs
      </button>
    </form>
  )
}
