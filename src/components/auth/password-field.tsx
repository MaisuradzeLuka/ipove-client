"use client";

import { useState, type InputHTMLAttributes } from "react";
import { HiEye, HiEyeSlash } from "react-icons/hi2";
import { useMessages } from "@/contexts/locale-context";

type PasswordFieldProps = {
  id: string;
  label: string;
  error?: string;
  hint?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

const inputClass =
  "w-full rounded-lg border border-border bg-background-surface py-2.5 pl-4 pr-11 text-foreground placeholder:text-foreground-subtle outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ring-offset disabled:cursor-not-allowed disabled:opacity-60";

const iconClass = "size-4 shrink-0";

export function PasswordField({
  id,
  label,
  error,
  hint,
  className = "",
  ...props
}: PasswordFieldProps) {
  const messages = useMessages();
  const [visible, setVisible] = useState(false);

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium text-foreground mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            error ? `${id}-error` : hint ? `${id}-hint` : undefined
          }
          className={`${inputClass} ${error ? "border-error" : ""} ${className} mt-2`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-foreground-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ring-offset"
          aria-label={
            visible ? messages.auth.hidePassword : messages.auth.showPassword
          }
          aria-pressed={visible}
        >
          {visible ? (
            <HiEyeSlash className={iconClass} aria-hidden />
          ) : (
            <HiEye className={iconClass} aria-hidden />
          )}
        </button>
      </div>
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
