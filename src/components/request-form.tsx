"use client";

import { useActionState, useEffect, useRef } from "react";
import { createRequest, type ActionState } from "@/lib/actions/requests";
import { Alert } from "@/components/ui/alert";
import { SubmitButton } from "@/components/ui/button";
import { SelectField, TextAreaField, TextField } from "@/components/ui/fields";
import { LEAVE_TYPE_LABELS, type LeaveType } from "@/lib/types";

const TODAY = () => new Date().toISOString().slice(0, 10);

export function RequestForm() {
  const [state, formAction] = useActionState<ActionState, FormData>(
    createRequest,
    null,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const succeeded = state !== null && "ok" in state;

  useEffect(() => {
    if (succeeded) formRef.current?.reset();
  }, [succeeded]);

  const today = TODAY();

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <SelectField
        id="leave_type"
        name="leave_type"
        label="Type"
        defaultValue="vacation"
      >
        {(Object.keys(LEAVE_TYPE_LABELS) as LeaveType[]).map((t) => (
          <option key={t} value={t}>
            {LEAVE_TYPE_LABELS[t]}
          </option>
        ))}
      </SelectField>

      <div className="grid grid-cols-2 gap-3">
        <TextField
          id="start_date"
          name="start_date"
          label="From"
          type="date"
          required
          min={today}
        />
        <TextField
          id="end_date"
          name="end_date"
          label="To"
          type="date"
          required
          min={today}
        />
      </div>

      <TextAreaField
        id="reason"
        name="reason"
        label={
          <>
            Reason{" "}
            <span className="font-normal text-slate-400">(optional)</span>
          </>
        }
        rows={3}
        placeholder="A short note for your manager…"
      />

      {state && "error" in state ? (
        <Alert tone="error">{state.error}</Alert>
      ) : null}
      {succeeded ? (
        <Alert tone="success">
          Request submitted — your manager will review it shortly.
        </Alert>
      ) : null}

      <SubmitButton className="w-full" pendingLabel="Submitting…">
        Submit request
      </SubmitButton>
    </form>
  );
}
