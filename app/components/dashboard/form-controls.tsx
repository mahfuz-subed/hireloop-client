import * as React from "react"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Shared dashboard form primitives. They intentionally use native inputs so
 * `FormData` keeps working exactly as before while the markup stops repeating
 * the same Tailwind strings in every screen.
 */

const controlClass =
  "w-full rounded-lg border border-transparent bg-surface-muted px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition-colors focus:border-brand focus:ring-1 focus:ring-brand disabled:cursor-not-allowed disabled:opacity-50"

const labelClass =
  "mb-1.5 flex items-center justify-between gap-2 text-xs font-medium text-zinc-400"

const iconLeftClass =
  "pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-zinc-500"
const iconRightClass =
  "pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-zinc-500"

type FieldLabelProps = {
  htmlFor?: string
  children: React.ReactNode
  required?: boolean
  hint?: React.ReactNode
  className?: string
}

export function FieldLabel({
  htmlFor,
  children,
  required,
  hint,
  className,
}: FieldLabelProps) {
  return (
    <label htmlFor={htmlFor} className={cn(labelClass, className)}>
      <span>
        {children}
        {required ? <span className="ml-1 text-brand">*</span> : null}
      </span>
      {hint ? (
        <span className="text-[10px] font-normal text-zinc-500">{hint}</span>
      ) : null}
    </label>
  )
}

type BaseFieldProps = {
  label: React.ReactNode
  required?: boolean
  hint?: React.ReactNode
  containerClassName?: string
}

type TextFieldProps = React.ComponentProps<"input"> &
  BaseFieldProps & {
    icon?: React.ComponentType<{ size?: number; className?: string }>
  }

export function TextField({
  label,
  required,
  hint,
  containerClassName,
  icon: Icon,
  className,
  id,
  ...props
}: TextFieldProps) {
  const inputId = id ?? props.name

  return (
    <div className={containerClassName}>
      <FieldLabel htmlFor={inputId} required={required} hint={hint}>
        {label}
      </FieldLabel>
      <div className="relative">
        {Icon ? <Icon size={15} className={iconLeftClass} /> : null}
        <input
          id={inputId}
          required={required}
          className={cn(controlClass, Icon && "pl-9", className)}
          {...props}
        />
      </div>
    </div>
  )
}

type SelectFieldProps = React.ComponentProps<"select"> &
  BaseFieldProps & {
    icon?: React.ComponentType<{ size?: number; className?: string }>
  }

export function SelectField({
  label,
  required,
  hint,
  containerClassName,
  icon: Icon,
  className,
  id,
  children,
  ...props
}: SelectFieldProps) {
  const selectId = id ?? props.name

  return (
    <div className={containerClassName}>
      <FieldLabel htmlFor={selectId} required={required} hint={hint}>
        {label}
      </FieldLabel>
      <div className="relative">
        {Icon ? <Icon size={15} className={iconLeftClass} /> : null}
        <select
          id={selectId}
          required={required}
          className={cn(
            controlClass,
            "appearance-none pr-9",
            Icon && "pl-9",
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown size={15} className={iconRightClass} />
      </div>
    </div>
  )
}

type TextareaFieldProps = React.ComponentProps<"textarea"> & BaseFieldProps

export function TextareaField({
  label,
  required,
  hint,
  containerClassName,
  className,
  id,
  ...props
}: TextareaFieldProps) {
  const textareaId = id ?? props.name

  return (
    <div className={containerClassName}>
      <FieldLabel htmlFor={textareaId} required={required} hint={hint}>
        {label}
      </FieldLabel>
      <textarea
        id={textareaId}
        required={required}
        className={cn(controlClass, "resize-y", className)}
        {...props}
      />
    </div>
  )
}

type OptionPillsProps<T extends string> = {
  label: React.ReactNode
  name: string
  options: readonly T[]
  value: T
  onChange: (value: T) => void
  required?: boolean
}

/** Segmented button group backed by a hidden input so FormData still works. */
export function OptionPills<T extends string>({
  label,
  name,
  options,
  value,
  onChange,
  required,
}: OptionPillsProps<T>) {
  return (
    <div>
      <FieldLabel required={required}>{label}</FieldLabel>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            aria-pressed={value === option}
            className={cn(
              "rounded-lg border px-3 py-2.5 text-xs whitespace-nowrap transition-colors",
              value === option
                ? "border-brand bg-brand/10 text-white"
                : "border-transparent bg-surface-muted text-zinc-500 hover:text-zinc-300"
            )}
          >
            {option}
          </button>
        ))}
      </div>
      <input type="hidden" name={name} value={value} />
    </div>
  )
}

type ToggleRowProps = {
  name: string
  label: React.ReactNode
  description?: React.ReactNode
  checked: boolean
  onChange: (checked: boolean) => void
  icon?: React.ComponentType<{ size?: number; className?: string }>
}

/** Remote-work style switch that always submits `"true"` / `"false"`. */
export function ToggleRow({
  name,
  label,
  description,
  checked,
  onChange,
  icon: Icon,
}: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg bg-surface-muted px-4 py-3">
      <div className="flex min-w-0 items-center gap-3">
        {Icon ? <Icon size={18} className="shrink-0 text-brand" /> : null}
        <div className="min-w-0">
          <p className="text-xs font-medium">{label}</p>
          {description ? (
            <p className="text-[11px] text-zinc-500">{description}</p>
          ) : null}
        </div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={typeof label === "string" ? label : undefined}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-5 w-10 shrink-0 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none",
          checked ? "bg-brand" : "bg-zinc-700"
        )}
      >
        <span
          aria-hidden
          className={cn(
            "absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all",
            checked ? "left-5" : "left-0.5"
          )}
        />
      </button>
      <input type="hidden" name={name} value={String(checked)} />
    </div>
  )
}

type FormSectionProps = {
  title: React.ReactNode
  children: React.ReactNode
  className?: string
}

/** Card + numbered heading wrapper used by the job form sections. */
export function FormSection({ title, children, className }: FormSectionProps) {
  return (
    <section className={cn("rounded-xl bg-surface-raised p-4 sm:p-6", className)}>
      <h2 className="mb-5 flex items-center gap-2 text-sm font-semibold text-zinc-100">
        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-brand" />
        {title}
      </h2>
      <div className="space-y-5">{children}</div>
    </section>
  )
}
