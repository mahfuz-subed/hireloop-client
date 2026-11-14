"use client"

import * as React from "react"

import { JobDetailsCard } from "@/app/components/jobs/job-details-card"
import type { JobRow } from "@/types/job"
import { useSession } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/toast"
import { applyToAJob } from "@/lib/actions/application"

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
  const { data: session } = useSession()
  const user = session?.user

  const router = useRouter()
  function handleSave() {
    // Toggle: false -> true -> false -> true ...
    setSaved((current) => !current)
  }

  const handleApply = async () => {
    // TODO: connect this to your real apply flow.
    if (!user) {
      router.push(`/sign-in?redirectTo=/browse-jobs/${job._id}`)
      console.log("Apply clicked for job:", job._id)
    } else if (user?.role === "seeker") {
      const application = {
        jobId: job._id,
        userId: user.id,

        email: user.email,
        jobTitle: job.title,
        companyName: job.companyName,
      }
      const result = await applyToAJob(application)
      if (result.insertedId) {
        toast.add({ title: "You successfully applied to the job." })
        router.push("/browse-jobs")
      }
      console.log("saving the application to the database")
    } else {
      toast.add({ title: "Only job seekers can apply for a job." })
    }
  }

  return (
    <JobDetailsCard
      job={job}
      saved={saved}
      onSave={handleSave}
      onApply={handleApply}
    />
  )
}
