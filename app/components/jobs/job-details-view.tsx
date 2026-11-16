"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { JobDetailsCard } from "@/app/components/jobs/job-details-card"
import { toast } from "@/components/ui/toast"
import { applyToAJob, getApplicationsCount } from "@/lib/actions/application"
import { useSession } from "@/lib/auth-client"
import type { JobRow } from "@/types/job"

/**
 * Holds the interactive parts of the job details page.
 *
 * The page (a server component) cannot store state or hold click handlers, so
 * it passes the job down to this client component. This file is the only place
 * where the "what happens when the user clicks" logic lives.
 *
 * Add new handlers here and pass them into `JobDetailsCard` as props.
 */
export function JobDetailsView({ job }: { job: JobRow }) {
  // Is this job saved? Starts as "not saved".
  const [saved, setSaved] = React.useState(false)
  // True while the application is being saved, so the button cannot be
  // clicked twice.
  const [isApplying, setIsApplying] = React.useState(false)

  const { data: session } = useSession()
  const user = session?.user
  const router = useRouter()

  function handleSave() {
    // Toggle: false -> true -> false -> true ...
    setSaved((current) => !current)
  }

  async function handleApply() {
    // 1. Not signed in yet -> send them to the sign-in page,
    //    then back to this job.
    if (!user) {
      router.push(`/sign-in?redirectTo=/browse-jobs/${job._id}`)
      return
    }

    // 2. Only job seekers can apply.
    if (user.role !== "seeker") {
      toast.add({ title: "Only job seekers can apply for a job." })
      return
    }

    setIsApplying(true)

    if (user.role === "seeker") {
      //number of jobs applied
      const countResult = await getApplicationsCount(`seekerId=${user.id}`)
      if (countResult.count >= 10) {
        //redirect to payment
        router.push("/payments")
        return
      }
    }

    try {
      // 3. Send every field the application row needs.
      //    The server adds status, archived, appliedAt and updatedAt.
      await applyToAJob({
        seekerId: user.id,
        seekerName: user.name,
        seekerEmail: user.email,
        jobId: job._id,
        jobTitle: job.title,
        companyName: job.companyName,
        jobType: job.jobType,
        category: job.category,
        location: job.location,
        isRemote: job.isRemote,
      })

      toast.add({ title: "You successfully applied to the job." })
      router.push("/dashboard/seeker/applications")
    } catch (error) {
      // 4. `applyToAJob` throws for 409 "already applied" and any other
      //    error, so show its message in a toast.
      toast.add({
        title:
          error instanceof Error
            ? error.message
            : "Could not save the application.",
      })
    } finally {
      setIsApplying(false)
    }
  }

  return (
    <JobDetailsCard
      job={job}
      saved={saved}
      onSave={handleSave}
      onApply={handleApply}
      isApplying={isApplying}
    />
  )
}
