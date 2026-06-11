import { CancelButton } from "@/components/cancel-button";
import { RequestCard } from "@/components/request-card";
import { RequestForm } from "@/components/request-form";
import { Stat } from "@/components/stat";
import type { Profile, RequestWithPeople } from "@/lib/types";

export function RequesterView({
  profile,
  requests,
}: {
  profile: Profile;
  requests: RequestWithPeople[];
}) {
  const firstName = profile.full_name.split(" ")[0] || "there";
  const pending = requests.filter((r) => r.status === "pending").length;
  const approved = requests.filter((r) => r.status === "approved").length;
  const denied = requests.filter((r) => r.status === "denied").length;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Hi {firstName} 👋
        </h1>
        <p className="mt-1 text-slate-600">
          Submit a new time-off request and track where each one stands.
        </p>
      </div>

      <div className="mb-8 grid grid-cols-3 gap-3">
        <Stat label="Pending" value={pending} tone="amber" />
        <Stat label="Approved" value={approved} tone="emerald" />
        <Stat label="Denied" value={denied} tone="rose" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">
              New request
            </h2>
            <p className="mb-4 mt-0.5 text-sm text-slate-500">
              Takes about 20 seconds.
            </p>
            <RequestForm />
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-base font-semibold text-slate-900">
            Your requests
          </h2>
          {requests.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white/50 p-10 text-center">
              <p className="text-slate-600">No requests yet.</p>
              <p className="mt-1 text-sm text-slate-400">
                Submit your first one using the form.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((r) => (
                <RequestCard
                  key={r.id}
                  request={r}
                  actions={
                    r.status === "pending" ? <CancelButton id={r.id} /> : null
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
