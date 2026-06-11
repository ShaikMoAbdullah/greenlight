import { StatusBadge } from "@/components/status-badge";
import { dayCount, formatDateRange, relativeTime } from "@/lib/format";
import { LEAVE_TYPE_LABELS, type RequestWithPeople } from "@/lib/types";

const TYPE_STYLES: Record<string, string> = {
  vacation: "bg-sky-50 text-sky-700",
  sick: "bg-rose-50 text-rose-700",
  personal: "bg-violet-50 text-violet-700",
  other: "bg-slate-100 text-slate-600",
};

export function RequestCard({
  request,
  showRequester = false,
  actions,
}: {
  request: RequestWithPeople;
  showRequester?: boolean;
  actions?: React.ReactNode;
}) {
  const days = dayCount(request.start_date, request.end_date);

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-md px-2 py-0.5 text-xs font-medium ${
                TYPE_STYLES[request.leave_type] ?? TYPE_STYLES.other
              }`}
            >
              {LEAVE_TYPE_LABELS[request.leave_type]}
            </span>
            <StatusBadge status={request.status} />
          </div>

          <h3 className="mt-2 text-base font-semibold text-slate-900">
            {formatDateRange(request.start_date, request.end_date)}
            <span className="ml-2 text-sm font-normal text-slate-500">
              · {days} {days === 1 ? "day" : "days"}
            </span>
          </h3>

          {showRequester && request.requester ? (
            <p className="mt-0.5 text-sm text-slate-600">
              Requested by{" "}
              <span className="font-medium text-slate-800">
                {request.requester.full_name || "Unknown"}
              </span>{" "}
              · {relativeTime(request.created_at)}
            </p>
          ) : (
            <p className="mt-0.5 text-sm text-slate-500">
              Submitted {relativeTime(request.created_at)}
            </p>
          )}
        </div>

        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>

      {request.reason ? (
        <p className="mt-3 whitespace-pre-wrap rounded-xl bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700">
          {request.reason}
        </p>
      ) : null}

      {(request.status === "approved" || request.status === "denied") &&
      request.decided_at ? (
        <div className="mt-3 border-t border-slate-100 pt-3 text-sm text-slate-600">
          <span className="font-medium text-slate-800">
            {request.status === "approved" ? "Approved" : "Denied"}
          </span>{" "}
          by {request.reviewer?.full_name || "a manager"} ·{" "}
          {relativeTime(request.decided_at)}
          {request.review_note ? (
            <p className="mt-1.5 whitespace-pre-wrap rounded-lg bg-slate-50 px-3 py-2 text-slate-700">
              “{request.review_note}”
            </p>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
