"use client"
import { useState } from "react"

import {
  Building2,
  Globe,
  MapPin,
  Calendar,
  ChevronDown,
  ArrowRight,
  Euro,
} from "lucide-react"
import { createJob } from "@/lib/actions/jobs"

export interface Job {
  title: string
  companyName: string
  category: string
  jobType: string
  isRemote: string // "true" | "false"
  location: string
  deadline: string
  minSalary: string
  maxSalary: string
  frequency: string
  responsibilities: string
  qualifications: string
}

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship"] as const
const FREQUENCIES = ["per hour", "per month", "per year"] as const

export type JobType = (typeof JOB_TYPES)[number]
export type SalaryFrequency = (typeof FREQUENCIES)[number]

const field =
  "w-full rounded-lg bg-[#1a1a1d] border border-transparent px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
const label = "mb-1.5 block text-xs font-medium text-zinc-400"
const sectionTitle =
  "mb-5 flex items-center gap-2 text-sm font-semibold text-zinc-100"
const dot = "h-1.5 w-1.5 rounded-full bg-indigo-500"
const iconLeft =
  "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
const iconRight =
  "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500"

export default function AddJobsPage() {
  const [jobType, setJobType] = useState<JobType>("Full-time")
  const [isRemote, setIsRemote] = useState(false)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries()) as unknown as Job
    console.log(data)

    const result = createJob(data)
  }
  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-3xl text-zinc-100">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="mb-2 text-[11px] text-zinc-500">
            Manage Jobs /{" "}
            <span className="text-indigo-400">Create New Listing</span>
          </p>
          <h1 className="text-2xl font-bold">Post a New Job</h1>
          <p className="mt-1 text-xs text-zinc-500">
            Fill in the position specifications to attract qualified talent
            across our network.
          </p>
        </div>
        <button
          type="submit"
          className="flex shrink-0 items-center gap-1.5 rounded-lg bg-indigo-500 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-400"
        >
          Publish Job
          <ArrowRight size={14} />
        </button>
      </div>

      <div className="space-y-10 rounded-2xl bg-[#111113] p-8">
        {/* 1. Basic Information */}
        <section>
          <h2 className={sectionTitle}>
            <span className={dot} />
            1. Basic Information
          </h2>
          <div className="space-y-5">
            <div>
              <label htmlFor="title" className={label}>
                Job Title <span className="text-indigo-400">*</span>
              </label>
              <input
                id="title"
                name="title"
                className={field}
                placeholder="Frontend Developer"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="companyName" className={label}>
                  Company Name <span className="text-indigo-400">*</span>
                </label>
                <div className="relative">
                  <Building2 size={15} className={iconLeft} />
                  <input
                    id="companyName"
                    name="companyName"
                    className={`${field} pl-9`}
                    placeholder="HirePulse Network"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="category" className={label}>
                  Job Category <span className="text-indigo-400">*</span>
                </label>
                <div className="relative">
                  <select
                    id="category"
                    name="category"
                    className={`${field} appearance-none pr-9`}
                  >
                    <option>Engineering &amp; Tech</option>
                    <option>Design</option>
                    <option>Marketing</option>
                    <option>Sales</option>
                    <option>Operations</option>
                    <option>Finance</option>
                    <option>Other</option>
                  </select>
                  <ChevronDown size={15} className={iconRight} />
                </div>
              </div>
            </div>

            <div>
              <span className={label}>
                Job Type <span className="text-indigo-400">*</span>
              </span>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {JOB_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setJobType(type)}
                    aria-pressed={jobType === type}
                    className={`rounded-lg border px-3 py-2.5 text-xs ${
                      jobType === type
                        ? "border-indigo-500 bg-indigo-500/10 text-white"
                        : "border-transparent bg-[#1a1a1d] text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              {/* type="button" fields aren't included in FormData, so this carries the value */}
              <input type="hidden" name="jobType" value={jobType} />
            </div>
          </div>
        </section>

        {/* 2. Location, Compensation & Timeline */}
        <section>
          <h2 className={sectionTitle}>
            <span className={dot} />
            2. Location, Compensation &amp; Timeline
          </h2>
          <div className="space-y-5">
            {/* Remote toggle (off state) */}
            <div className="flex items-center justify-between rounded-lg bg-[#1a1a1d] px-4 py-3">
              <div className="flex items-center gap-3">
                <Globe size={18} className="text-indigo-400" />
                <div>
                  <p className="text-xs font-medium">
                    Remote Work Allowed (isRemote)
                  </p>
                  <p className="text-[11px] text-zinc-500">
                    Enable worldwide or distributed candidate applications
                  </p>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={isRemote}
                aria-label="Remote work allowed"
                onClick={() => setIsRemote((prev) => !prev)}
                className={`relative h-5 w-10 rounded-full transition-colors ${
                  isRemote ? "bg-indigo-500" : "bg-zinc-700"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${
                    isRemote ? "left-5" : "left-0.5"
                  }`}
                />
              </button>
              <input type="hidden" name="isRemote" value={String(isRemote)} />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="location"
                  className={`${label} flex justify-between`}
                >
                  <span>Job Location (location)</span>
                  <span className="text-[10px] text-zinc-500">Required</span>
                </label>
                <div className="relative">
                  <MapPin size={15} className={iconLeft} />
                  <input
                    id="location"
                    name="location"
                    className={`${field} pl-9`}
                    placeholder="New York, USA"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="deadline" className={label}>
                  Application Deadline (deadline)
                </label>
                <div className="relative">
                  <Calendar size={15} className={iconLeft} />
                  <input
                    id="deadline"
                    name="deadline"
                    type="date"
                    className={`${field} pl-9 [color-scheme:dark]`}
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              <div>
                <label htmlFor="minSalary" className={label}>
                  Min Salary / Rate
                </label>
                <div className="relative">
                  <Euro size={14} className={iconLeft} />
                  <input
                    id="minSalary"
                    name="minSalary"
                    type="number"
                    min="0"
                    className={`${field} pl-9`}
                    placeholder="25"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="maxSalary" className={label}>
                  Max Salary / Rate
                </label>
                <div className="relative">
                  <Euro size={14} className={iconLeft} />
                  <input
                    id="maxSalary"
                    name="maxSalary"
                    type="number"
                    min="0"
                    className={`${field} pl-9`}
                    placeholder="40"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="frequency" className={label}>
                  Frequency
                </label>
                <div className="relative">
                  <select
                    id="frequency"
                    name="frequency"
                    className={`${field} appearance-none pr-9`}
                  >
                    <option>per hour</option>
                    <option>per month</option>
                    <option>per year</option>
                  </select>
                  <ChevronDown size={15} className={iconRight} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Responsibilities & Requirements */}
        <section>
          <h2 className={sectionTitle}>
            <span className={dot} />
            3. Responsibilities &amp; Requirements
          </h2>
          <div className="space-y-5">
            <div>
              <label htmlFor="responsibilities" className={label}>
                Key Responsibilities <span className="text-indigo-400">*</span>
              </label>
              <textarea
                id="responsibilities"
                name="responsibilities"
                rows={4}
                className={`${field} resize-y`}
                placeholder="What will this person do day to day?"
              />
            </div>
            <div>
              <label htmlFor="qualifications" className={label}>
                Qualifications &amp; Requirements{" "}
                <span className="text-indigo-400">*</span>
              </label>
              <textarea
                id="qualifications"
                name="qualifications"
                rows={4}
                className={`${field} resize-y`}
                placeholder="One requirement per line"
              />
            </div>
          </div>
        </section>
      </div>
    </form>
  )
}
