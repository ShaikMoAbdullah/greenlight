import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/logo";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/dashboard");

  return (
    <div className="page-backdrop flex min-h-screen flex-col">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5">
        <Logo />
        <nav className="flex items-center gap-2 text-sm">
          <Link
            href="/login"
            className="rounded-lg px-3 py-2 font-medium text-slate-600 hover:text-slate-900"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-brand-600 px-3.5 py-2 font-medium text-white shadow-sm transition hover:bg-brand-700"
          >
            Get started
          </Link>
        </nav>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
          Request → Review → Decision
        </span>
        <h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
          Time-off requests that don&apos;t get lost in email and chat
        </h1>
        <p className="mt-5 max-w-xl text-pretty text-lg text-slate-600">
          Greenlight gives your team one clean place to ask for time off — and
          gives managers one clear queue to approve or deny it, with a paper
          trail for every decision.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="/signup"
            className="rounded-xl bg-brand-600 px-5 py-3 font-medium text-white shadow-sm transition hover:bg-brand-700"
          >
            Create an account
          </Link>
          <Link
            href="/login"
            className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            I already have one
          </Link>
        </div>

        <div className="mt-16 grid w-full max-w-3xl gap-4 sm:grid-cols-3">
          {[
            {
              title: "1. Request",
              body: "Employees submit dates, type and a reason in seconds.",
            },
            {
              title: "2. Review",
              body: "Managers see one prioritized queue of pending requests.",
            },
            {
              title: "3. Decide",
              body: "Approve or deny with a note — captured and timestamped.",
            },
          ].map((step) => (
            <div
              key={step.title}
              className="rounded-2xl border border-slate-200 bg-white/70 p-5 text-left shadow-sm backdrop-blur"
            >
              <h3 className="font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-1.5 text-sm text-slate-600">{step.body}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="mx-auto w-full max-w-5xl px-6 py-8 text-center text-sm text-slate-400">
        Built with Next.js + Supabase, deployed on Vercel.
      </footer>
    </div>
  );
}
