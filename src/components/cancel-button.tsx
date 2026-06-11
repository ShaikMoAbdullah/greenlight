"use client";

import { cancelRequest } from "@/lib/actions/requests";
import { SubmitButton } from "@/components/ui/button";

export function CancelButton({ id }: { id: string }) {
  return (
    <form action={cancelRequest}>
      <input type="hidden" name="id" value={id} />
      <SubmitButton
        variant="secondary"
        className="px-3 py-1.5"
        pendingLabel="Cancelling…"
      >
        Cancel request
      </SubmitButton>
    </form>
  );
}
