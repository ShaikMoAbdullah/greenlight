import type { ReactNode } from "react";

export type AlertTone = "error" | "success" | "info";

const TONES: Record<AlertTone, string> = {
  error: "bg-rose-50 text-rose-700 ring-rose-600/20",
  success: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  info: "bg-brand-50 text-brand-700 ring-brand-100",
};

export function Alert({
  tone,
  children,
}: {
  tone: AlertTone;
  children: ReactNode;
}) {
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={`rounded-lg px-3 py-2 text-sm ring-1 ring-inset ${TONES[tone]}`}
    >
      {children}
    </p>
  );
}
