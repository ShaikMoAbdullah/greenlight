import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";

/**
 * Returns the signed-in user's profile, creating it from auth metadata as a
 * fallback if the signup trigger somehow didn't run. Returns null if signed out.
 */
export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (profile) return profile as Profile;

  // Fallback: materialize a profile from the user's signup metadata.
  const meta = user.user_metadata ?? {};
  const { data: created } = await supabase
    .from("profiles")
    .upsert(
      {
        id: user.id,
        full_name: (meta.full_name as string) ?? user.email ?? "",
        role: (meta.role as Profile["role"]) ?? "requester",
      },
      { onConflict: "id" }
    )
    .select("*")
    .single();

  return (created as Profile) ?? null;
}
