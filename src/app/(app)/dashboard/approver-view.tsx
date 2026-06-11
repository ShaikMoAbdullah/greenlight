import { DecisionForm } from "@/components/decision-form";
import { RequestCard } from "@/components/request-card";
import { Stat } from "@/components/stat";
import type { Profile, RequestWithPeople } from "@/lib/types";

export function ApproverView({
  profile,
  requests,
}: {
  profile: Profile;
  requests: RequestWithPeople[];
}) {
  const firstName = profile.full_name.split(" ")[0] || "there";
  const pending = requests.filter((r) => r.status === "pending");
  const decided = requests.filter(
    (r) => r.status === "approved" || r.status === "denied"
  );
  const approvedCount = requests.filter((r) => r.status === "approved").length;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Hi {firstName} 👋
        </h1>
        <p className="mt-1 text-slate-600">
          Review your team&apos;s time-off requests and make a call.
        </p>
      </div>

      <div className="mb-8 grid grid-cols-3 gap-3">
        <Stat label="Awaiting review" value={pending.length} tone="amber" />
        <Stat label="Approved" value={approvedCount} tone="emerald" />
        <Stat label="Total requests" value={requests.length} />
      </div>

      <section className="mb-10">
        <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-slate-900">
          Needs your review
          {pending.length > 0 ? (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
              {pending.length}
            </span>
          ) : null}
        </h2>

        {pending.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/50 p-10 text-center">
            <p className="text-slate-600">You&apos;re all caught up 🎉</p>
            <p className="mt-1 text-sm text-slate-400">
              New requests will show up here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pending.map((r) => (
              <RequestCard
                key={r.id}
                request={r}
                showRequester
                actions={<DecisionForm id={r.id} />}
              />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-base font-semibold text-slate-900">
          Decision history
        </h2>
        {decided.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-white/50 p-6 text-center text-sm text-slate-500">
            Decisions you make will be logged here.
          </p>
        ) : (
          <div className="space-y-4">
            {decided.map((r) => (
              <RequestCard key={r.id} request={r} showRequester />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
