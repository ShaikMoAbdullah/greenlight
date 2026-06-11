"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { useFormStatus } from "react-dom";

export type ButtonVariant = "primary" | "approve" | "deny" | "secondary";

const VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-brand-600 text-white hover:bg-brand-700",
  approve: "bg-emerald-600 text-white hover:bg-emerald-700",
  deny: "bg-rose-600 text-white hover:bg-rose-700",
  secondary:
    "border border-slate-300 bg-white text-slate-600 hover:bg-slate-50",
};

const BASE =
  "rounded-xl px-4 py-2.5 text-sm font-medium shadow-sm transition disabled:opacity-60";

export function buttonClassName(variant: ButtonVariant, extra = "") {
  return `${BASE} ${VARIANTS[variant]} ${extra}`.trim();
}

interface SubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Label shown while the enclosing form action is pending. */
  pendingLabel?: ReactNode;
  variant?: ButtonVariant;
}

/**
 * A submit button that disables itself and swaps its label while the
 * surrounding form's action is in flight (via `useFormStatus`).
 */
export function SubmitButton({
  children,
  pendingLabel,
  variant = "primary",
  className = "",
  ...props
}: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || props.disabled}
      className={buttonClassName(variant, className)}
      {...props}
    >
      {pending && pendingLabel ? pendingLabel : children}
    </button>
  );
}
