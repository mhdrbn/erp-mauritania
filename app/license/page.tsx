"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function LicensePage() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const activateLicense = async () => {
    if (!code) {
      alert("أدخل رمز التفعيل");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from("licenses")
      .select("*")
      .eq("license_code", code)
      .eq("is_active", true)
      .single();

    setLoading(false);

    if (error || !data) {
      alert("رمز التفعيل غير صحيح");
      return;
    }

    const today = new Date();
    const endDate = new Date(data.end_date);

    if (today > endDate) {
      alert("انتهت صلاحية الاشتراك");
      return;
    }

    localStorage.setItem(
      "license_code",
      data.license_code
    );

    localStorage.setItem(
      "license_business",
      data.business_name
    );

    alert("تم تفعيل البرنامج بنجاح");

    window.location.href = "/dashboard";
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100">

      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md">

        <h1 className="text-3xl font-bold text-center mb-6">
          تفعيل البرنامج
        </h1>

        <input
          value={code}
          onChange={(e) =>
            setCode(e.target.value)
          }
          placeholder="أدخل رمز التفعيل"
          className="w-full border p-4 rounded-xl mb-4"
        />

        <button
          onClick={activateLicense}
          disabled={loading}
          className="w-full bg-green-600 text-white p-4 rounded-xl"
        >
          {loading
            ? "جاري التحقق..."
            : "تفعيل"}
        </button>

      </div>

    </main>
  );
}