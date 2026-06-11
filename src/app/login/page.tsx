import Link from "next/link";
import { Logo } from "@/components/logo";
import { Alert } from "@/components/ui/alert";
import { LoginForm } from "./login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; message?: string }>;
}) {
  const { redirect, message } = await searchParams;

  return (
    <div className="page-backdrop flex min-h-screen flex-col">
      <header className="mx-auto w-full max-w-5xl px-6 py-5">
        <Link href="/">
          <Logo />
        </Link>
      </header>

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 pb-20">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Sign in to manage your time-off requests.
          </p>

          {message === "confirm-email" ? (
            <div className="mt-4">
              <Alert tone="info">
                Almost there — check your inbox to confirm your email, then sign
                in.
              </Alert>
            </div>
          ) : null}

          <div className="mt-6">
            <LoginForm redirectTo={redirect} />
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-slate-600">
          New here?{" "}
          <Link href="/signup" className="font-medium text-brand-700 hover:underline">
            Create an account
          </Link>
        </p>
      </main>
    </div>
  );
}
