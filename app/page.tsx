"use client";

import { useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  useEffect(() => {
    async function checkAuth() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        window.location.href = "/login";
        return;
      }

      const license =
        localStorage.getItem("license_code");

      if (!license) {
        window.location.href = "/license";
        return;
      }

      window.location.href = "/dashboard";
    }

    checkAuth();
  }, []);

  return null;
}