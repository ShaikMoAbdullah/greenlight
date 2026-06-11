import Link from "next/link";
import { Logo } from "@/components/logo";
import { signOut } from "@/lib/actions/auth";
import type { Profile } from "@/lib/types";

export function AppHeader({ profile }: { profile: Profile }) {
  const initials = profile.full_name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-3.5">
        <Link href="/dashboard">
          <Logo />
        </Link>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
              {initials || "?"}
            </span>
            <div className="hidden text-right leading-tight sm:block">
              <div className="text-sm font-medium text-slate-900">
                {profile.full_name || "Unnamed"}
              </div>
              <div className="text-xs capitalize text-slate-500">
                {profile.role === "approver" ? "Manager" : "Employee"}
              </div>
            </div>
          </div>

          <form action={signOut}>
            <button
              type="submit"
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
