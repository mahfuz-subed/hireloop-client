"use client"

import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { deleteJob } from "@/lib/actions/jobs"
import type { Job } from "@/types/job"

export function DeleteJobs({ job }: { job: Job }) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    const res = await deleteJob(job._id)

    if (res.deletedCount) {
      setOpen(false)
      toast.add({
        title: "Job deleted",
        description: "The job was permanently deleted.",
      })
      router.refresh()
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={
          <Button
            variant="destructive"
            size="icon-sm"
            aria-label={`Delete ${job.title}`}
          >
            <Trash2 size={14} />
          </Button>
        }
      />
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/15 text-destructive">
            <Trash2 />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete this job?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete &quot;{job.title}&quot;. This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} variant="destructive">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
