import { supabase } from "./supabase";

export async function checkAccess() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    window.location.href = "/login";
    return false;
  }

  const license =
    localStorage.getItem("license_code");

  if (!license) {
    window.location.href =
      "/license";

    return false;
  }

  return true;
}