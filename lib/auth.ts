import { redirect } from "next/navigation";

import type { Profile, UserRole } from "@/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const STAFF_ROLES: UserRole[] = ["admin", "editor"];

export async function getCurrentProfile() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return data as Profile | null;
}

export async function requireStaff() {
  const profile = await getCurrentProfile();

  if (!profile || !STAFF_ROLES.includes(profile.role)) {
    redirect("/admin/login");
  }

  return profile;
}

export async function requireAdminRole() {
  const profile = await requireStaff();

  if (profile.role !== "admin") {
    redirect("/admin");
  }

  return profile;
}

