import Link from "next/link";
import { Logo } from "@/components/logo";
import { SignupForm } from "./signup-form";

export default function SignupPage() {
  return (
    <div className="page-backdrop flex min-h-screen flex-col">
      <header className="mx-auto w-full max-w-5xl px-6 py-5">
        <Link href="/">
          <Logo />
        </Link>
      </header>

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 pb-16">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Pick how you&apos;ll use Greenlight — you can use one email per role.
          </p>

          <div className="mt-6">
            <SignupForm />
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-brand-700 hover:underline">
            Sign in
          </Link>
        </p>
      </main>
    </div>
  );
}
