"use client"

import { ArrowRight, Pencil } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/toast"
import { JobFormFields } from "@/app/components/dashboard/job-form"
import type { Job } from "@/types/job"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

export function UpdateJobs({ job }: { job: Job }) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const data = Object.fromEntries(formData.entries())

    const res = await fetch(`${BASE_URL}/jobs/${job._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    const result = await res.json()

    if (result.acknowledged) {
      toast.add({
        title: `${job.title} updated successfully.`,
      })
      router.refresh()
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 border-0 bg-brand/15 px-3 text-[11px] text-brand hover:bg-brand/25"
          >
            <Pencil size={12} />
            Update
          </Button>
        }
      />

      <DialogContent className="max-h-[90dvh] w-[calc(100vw-1.5rem)] max-w-3xl overflow-y-auto rounded-xl bg-surface p-4 text-zinc-100 sm:w-full sm:max-w-3xl sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Update Job Post
          </DialogTitle>
          <DialogDescription className="text-xs text-zinc-500">
            Modify position specifications, compensation range, and candidate
            requirements for this listing.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleUpdate} className="space-y-5">
          <JobFormFields defaultValues={job} />

          <Button
            type="submit"
            variant="brand"
            size="lg"
            className="w-full gap-1.5 sm:w-auto"
          >
            Update Job
            <ArrowRight size={14} />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
