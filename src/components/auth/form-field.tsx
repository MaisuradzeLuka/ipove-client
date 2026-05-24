import type { InputHTMLAttributes } from "react";

type FormFieldProps = {
  id: string;
  label: string;
  error?: string;
  hint?: string;
} & InputHTMLAttributes<HTMLInputElement>;

const inputClass =
  "w-full rounded-lg border border-border bg-background-surface px-4 py-2.5 text-foreground placeholder:text-foreground-subtle outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ring-offset disabled:cursor-not-allowed disabled:opacity-60";

export function FormField({
  id,
  label,
  error,
  hint,
  className = "",
  ...props
}: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          error ? `${id}-error` : hint ? `${id}-hint` : undefined
        }
        className={`${inputClass} ${error ? "border-error" : ""} ${className}`}
        {...props}
      />
      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-foreground-subtle">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-xs text-error">
          {error}
        </p>
      )}
    </div>
  );
}
