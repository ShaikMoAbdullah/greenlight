import { redirect } from "next/navigation";
import { RequesterView } from "./requester-view";
import { ApproverView } from "./approver-view";
import { getCurrentProfile } from "@/lib/get-profile";
import { createClient } from "@/lib/supabase/server";
import type { RequestWithPeople } from "@/lib/types";

const SELECT = `
  *,
  requester:profiles!time_off_requests_requester_id_fkey(full_name),
  reviewer:profiles!time_off_requests_reviewer_id_fkey(full_name)
`;

export default async function DashboardPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");

  const supabase = await createClient();

  if (profile.role === "approver") {
    const { data } = await supabase
      .from("time_off_requests")
      .select(SELECT)
      .order("created_at", { ascending: false });

    return (
      <ApproverView
        profile={profile}
        requests={(data ?? []) as unknown as RequestWithPeople[]}
      />
    );
  }

  const { data } = await supabase
    .from("time_off_requests")
    .select(SELECT)
    .eq("requester_id", profile.id)
    .order("created_at", { ascending: false });

  return (
    <RequesterView
      profile={profile}
      requests={(data ?? []) as unknown as RequestWithPeople[]}
    />
  );
}
