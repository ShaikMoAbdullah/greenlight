"use client";

import { useActionState, useState } from "react";
import { signUp, type AuthState } from "@/lib/actions/auth";
import { Alert } from "@/components/ui/alert";
import { SubmitButton } from "@/components/ui/button";
import { TextField } from "@/components/ui/fields";
import type { Role } from "@/lib/types";

const ROLE_OPTIONS: { value: Role; title: string; desc: string }[] = [
  { value: "requester", title: "Employee", desc: "I want to request time off." },
  { value: "approver", title: "Manager", desc: "I review and decide on requests." },
];

function RolePicker({
  value,
  onChange,
}: {
  value: Role;
  onChange: (role: Role) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-1.5 block text-sm font-medium text-slate-700">
        I&apos;m signing up as a…
      </legend>
      <input type="hidden" name="role" value={value} />
      <div className="grid grid-cols-2 gap-3">
        {ROLE_OPTIONS.map((opt) => {
          const active = value === opt.value;
          return (
            <button
              type="button"
              key={opt.value}
              onClick={() => onChange(opt.value)}
              aria-pressed={active}
              className={`rounded-xl border p-3 text-left transition ${
                active
                  ? "border-brand-500 bg-brand-50 ring-2 ring-brand-100"
                  : "border-slate-300 bg-white hover:border-slate-400"
              }`}
            >
              <span className="block text-sm font-semibold text-slate-900">
                {opt.title}
              </span>
              <span className="mt-0.5 block text-xs text-slate-500">
                {opt.desc}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function SignupForm() {
  const [state, formAction] = useActionState<AuthState, FormData>(signUp, null);
  const [role, setRole] = useState<Role>("requester");

  return (
    <form action={formAction} className="space-y-4">
      <TextField
        id="full_name"
        name="full_name"
        label="Full name"
        type="text"
        autoComplete="name"
        required
        placeholder="Jordan Rivera"
      />

      <TextField
        id="email"
        name="email"
        label="Work email"
        type="email"
        autoComplete="email"
        required
        placeholder="you@company.com"
      />

      <TextField
        id="password"
        name="password"
        label="Password"
        type="password"
        autoComplete="new-password"
        required
        minLength={6}
        placeholder="At least 6 characters"
      />

      <RolePicker value={role} onChange={setRole} />

      {state?.error ? <Alert tone="error">{state.error}</Alert> : null}

      <SubmitButton className="w-full" pendingLabel="Creating account…">
        Create account
      </SubmitButton>
    </form>
  );
}
