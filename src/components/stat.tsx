export function Stat({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: number | string;
  tone?: "default" | "amber" | "emerald" | "rose";
}) {
  const toneClass = {
    default: "text-slate-900",
    amber: "text-amber-600",
    emerald: "text-emerald-600",
    rose: "text-rose-600",
  }[tone];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className={`text-2xl font-semibold ${toneClass}`}>{value}</div>
      <div className="mt-0.5 text-sm text-slate-500">{label}</div>
    </div>
  );
}
