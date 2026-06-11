"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { decideRequest, type ActionState } from "@/lib/actions/requests";
import { Alert } from "@/components/ui/alert";
import { buttonClassName } from "@/components/ui/button";

type Decision = "approved" | "denied";

/**
 * Lives inside the <form> so it can read `useFormStatus`. Tracks which button
 * was pressed so only that one shows the pending label (both share one form).
 */
function DecisionButtons() {
  const { pending } = useFormStatus();
  const [clicked, setClicked] = useState<Decision | null>(null);

  const label = (decision: Decision, idle: string) =>
    pending && clicked === decision ? "Saving…" : idle;

  return (
    <div className="flex gap-2">
      <button
        type="submit"
        name="decision"
        value="approved"
        disabled={pending}
        onClick={() => setClicked("approved")}
        className={buttonClassName("approve", "flex-1")}
      >
        {label("approved", "Approve")}
      </button>
      <button
        type="submit"
        name="decision"
        value="denied"
        disabled={pending}
        onClick={() => setClicked("denied")}
        className={buttonClassName("deny", "flex-1")}
      >
        {label("denied", "Deny")}
      </button>
    </div>
  );
}

export function DecisionForm({ id }: { id: string }) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    decideRequest,
    null,
  );
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={buttonClassName("primary")}
      >
        Review
      </button>
    );
  }

  return (
    <form action={formAction} className="w-full space-y-3">
      <input type="hidden" name="id" value={id} />
      <textarea
        name="review_note"
        rows={2}
        placeholder="Add a note (optional)…"
        className="w-full resize-none rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
      />

      {state && "error" in state ? (
        <Alert tone="error">{state.error}</Alert>
      ) : null}

      <DecisionButtons />
    </form>
  );
}
