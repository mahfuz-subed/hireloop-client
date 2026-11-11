"use client"

import { useState } from "react"
import { Building2, Calendar, Euro, Globe, MapPin } from "lucide-react"

import {
  JOB_CATEGORIES,
  JOB_TYPES,
  SALARY_FREQUENCIES,
  type JobInput,
  type JobType,
} from "@/types/job"
import {
  FormSection,
  OptionPills,
  SelectField,
  TextareaField,
  TextField,
  ToggleRow,
} from "@/app/components/dashboard/form-controls"

type JobFormFieldsProps = {
  /** Pre-fills the update form. Create mode omits it. */
  defaultValues?: Partial<JobInput>
}

function withCurrentValue<T extends string>(
  options: readonly T[],
  value?: string
): readonly T[] {
  return value && !options.includes(value as T)
    ? [value as T, ...options]
    : options
}

/**
 * The three job form sections shared by "Post a New Job" and the update dialog.
 * Keeping one implementation prevents the create/edit forms from drifting.
 */
export function JobFormFields({ defaultValues }: JobFormFieldsProps) {
  const [jobType, setJobType] = useState<JobType>(
    JOB_TYPES.find((type) => type === defaultValues?.jobType) ?? "Full-time"
  )
  const [isRemote, setIsRemote] = useState(defaultValues?.isRemote === "true")

  const categories = withCurrentValue(JOB_CATEGORIES, defaultValues?.category)
  const frequencies = withCurrentValue(
    SALARY_FREQUENCIES,
    defaultValues?.frequency
  )

  return (
    <div className="space-y-5">
      <FormSection title="1. Basic Information">
        <TextField
          name="title"
          label="Job Title"
          placeholder="Frontend Developer"
          required
          defaultValue={defaultValues?.title}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            name="companyName"
            label="Company Name"
            placeholder="HirePulse Network"
            icon={Building2}
            required
            defaultValue={defaultValues?.companyName}
          />

          <SelectField
            name="category"
            label="Job Category"
            required
            defaultValue={defaultValues?.category ?? JOB_CATEGORIES[0]}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </SelectField>
        </div>

        <OptionPills
          label="Job Type"
          name="jobType"
          options={JOB_TYPES}
          value={jobType}
          onChange={setJobType}
          required
        />
      </FormSection>

      <FormSection title="2. Location, Compensation & Timeline">
        <ToggleRow
          name="isRemote"
          label="Remote Work Allowed"
          description="Enable worldwide or distributed candidate applications"
          icon={Globe}
          checked={isRemote}
          onChange={setIsRemote}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            name="location"
            label="Job Location"
            placeholder="New York, USA"
            icon={MapPin}
            required
            defaultValue={defaultValues?.location}
          />

          <TextField
            name="deadline"
            label="Application Deadline"
            type="date"
            icon={Calendar}
            className="[color-scheme:dark]"
            defaultValue={defaultValues?.deadline}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <TextField
            name="minSalary"
            label="Min Salary / Rate"
            type="number"
            min="0"
            placeholder="25"
            icon={Euro}
            defaultValue={defaultValues?.minSalary}
          />

          <TextField
            name="maxSalary"
            label="Max Salary / Rate"
            type="number"
            min="0"
            placeholder="40"
            icon={Euro}
            defaultValue={defaultValues?.maxSalary}
          />

          <SelectField
            name="frequency"
            label="Frequency"
            defaultValue={defaultValues?.frequency ?? SALARY_FREQUENCIES[0]}
          >
            {frequencies.map((frequency) => (
              <option key={frequency} value={frequency}>
                {frequency}
              </option>
            ))}
          </SelectField>
        </div>
      </FormSection>

      <FormSection title="3. Responsibilities & Requirements">
        <TextareaField
          name="responsibilities"
          label="Key Responsibilities"
          rows={4}
          required
          placeholder="What will this person do day to day?"
          defaultValue={defaultValues?.responsibilities}
        />

        <TextareaField
          name="qualifications"
          label="Qualifications & Requirements"
          rows={4}
          required
          placeholder="One requirement per line"
          defaultValue={defaultValues?.qualifications}
        />
      </FormSection>
    </div>
  )
}
