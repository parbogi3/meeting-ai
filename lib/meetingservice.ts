import { supabase } from "@/lib/supabase";

export async function loadMeetings() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } =
    await supabase
      .from("meetings")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", {
        ascending: false,
      });

  if (error) {
    console.error(error);
    return [];
  }

  return data ?? [];
}