import { STATUS_LABELS, type RequestStatus } from "@/lib/types";

const STYLES: Record<RequestStatus, string> = {
  pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
  approved: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  denied: "bg-rose-50 text-rose-700 ring-rose-600/20",
  cancelled: "bg-slate-100 text-slate-500 ring-slate-500/20",
};

const DOTS: Record<RequestStatus, string> = {
  pending: "bg-amber-500",
  approved: "bg-emerald-500",
  denied: "bg-rose-500",
  cancelled: "bg-slate-400",
};

export function StatusBadge({ status }: { status: RequestStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${STYLES[status]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${DOTS[status]}`} />
      {STATUS_LABELS[status]}
    </span>
  );
}
