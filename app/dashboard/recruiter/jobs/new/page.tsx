"use client"

import { useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react"

import { createJob } from "@/lib/actions/jobs"
import { toast } from "@/components/ui/toast"
import { Button } from "@/components/ui/button"
import { PageHeader, PageShell } from "@/app/components/dashboard/page-shell"
import { JobFormFields } from "@/app/components/dashboard/job-form"
import type { JobInput } from "@/types/job"

const FORM_ID = "new-job-form"

export default function AddJobsPage() {
  const router = useRouter()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const data = Object.fromEntries(formData.entries()) as unknown as JobInput

    const result = await createJob(data)
    if (result.acknowledged) {
      toast.add({ title: "Job Added Successfully" })
      router.push("/dashboard/recruiter/jobs")
    }
  }

  return (
    <PageShell className="max-w-3xl">
      <PageHeader
        breadcrumb={
          <>
            Manage Jobs /{" "}
            <span className="text-brand">Create New Listing</span>
          </>
        }
        title="Post a New Job"
        description="Fill in the position specifications to attract qualified talent across our network."
        action={
          <Button
            type="submit"
            form={FORM_ID}
            variant="brand"
            size="lg"
            className="w-full gap-1.5 sm:w-auto"
          >
            Publish Job
            <ArrowRight size={14} />
          </Button>
        }
      />

      <form id={FORM_ID} onSubmit={handleSubmit} className="space-y-5">
        <JobFormFields />

        <div className="flex justify-end sm:hidden">
          <Button
            type="submit"
            variant="brand"
            size="lg"
            className="w-full gap-1.5"
          >
            Publish Job
            <ArrowRight size={14} />
          </Button>
        </div>
      </form>
    </PageShell>
  )
}
