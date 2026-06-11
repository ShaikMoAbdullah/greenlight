"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { LeaveType } from "@/lib/types";

export type ActionState = { error: string } | { ok: true } | null;

const LEAVE_TYPES: LeaveType[] = ["vacation", "sick", "personal", "other"];

async function getProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase, user: null, profile: null };

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, role")
    .eq("id", user.id)
    .single();

  return { supabase, user, profile };
}

export async function createRequest(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { supabase, user } = await getProfile();
  if (!user) return { error: "You must be signed in." };

  const leaveType = String(formData.get("leave_type") ?? "vacation") as LeaveType;
  const startDate = String(formData.get("start_date") ?? "");
  const endDate = String(formData.get("end_date") ?? "");
  const reason = String(formData.get("reason") ?? "").trim();

  if (!LEAVE_TYPES.includes(leaveType)) {
    return { error: "Please choose a valid leave type." };
  }
  if (!startDate || !endDate) {
    return { error: "Start and end dates are required." };
  }
  if (endDate < startDate) {
    return { error: "The end date can't be before the start date." };
  }

  const { error } = await supabase.from("time_off_requests").insert({
    requester_id: user.id,
    leave_type: leaveType,
    start_date: startDate,
    end_date: endDate,
    reason,
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  return { ok: true };
}

export async function cancelRequest(formData: FormData): Promise<void> {
  const { supabase, user } = await getProfile();
  if (!user) return;

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await supabase
    .from("time_off_requests")
    .update({ status: "cancelled" })
    .eq("id", id)
    .eq("requester_id", user.id)
    .eq("status", "pending");

  revalidatePath("/dashboard");
}

export async function decideRequest(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { supabase, user, profile } = await getProfile();
  if (!user || !profile) return { error: "You must be signed in." };
  if (profile.role !== "approver") {
    return { error: "Only approvers can review requests." };
  }

  const id = String(formData.get("id") ?? "");
  const decision = String(formData.get("decision") ?? "");
  const note = String(formData.get("review_note") ?? "").trim();

  if (decision !== "approved" && decision !== "denied") {
    return { error: "Invalid decision." };
  }
  if (!id) return { error: "Missing request id." };

  const { error } = await supabase
    .from("time_off_requests")
    .update({
      status: decision,
      review_note: note || null,
      reviewer_id: user.id,
      decided_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("status", "pending");

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  return { ok: true };
}
