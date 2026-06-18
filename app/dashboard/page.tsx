"use client";

import Link from "next/link";
import { useEffect } from "react";
import { supabase } from "../../lib/supabase";

export default function DashboardPage() {
  useEffect(() => {
    async function checkAccess() {
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
        alert("يجب تفعيل الترخيص أولاً");

        window.location.href =
          "/license";

        return;
      }
    }

    checkAccess();
  }, []);

  const links = [
    ["POS", "/pos"],
    ["المنتجات", "/products"],
    ["العملاء", "/customers"],
    ["العمال", "/employees"],
    ["المصاريف", "/expenses"],
    ["الخزينة", "/cashbox"],
    ["الفواتير", "/factures"],
    ["التقارير", "/reports"],
    ["البنوك", "/banks"],
    ["الإعدادات", "/settings"],
    ["المخزون", "/inventory"],
    ["الديون", "/debts"],
    ["حول البرنامج", "/about"],
    ["النسخ الاحتياطي", "/backup"],
  ];

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="grid md:grid-cols-[280px_1fr]">

        <aside className="bg-slate-900 text-white min-h-screen p-6">

          <h1 className="text-2xl font-bold mb-8">
            ERP Mauritania
          </h1>

          <div className="space-y-3">
            {links.map((link) => (
              <Link
                key={link[1]}
                href={link[1]}
                className="block bg-slate-800 p-3 rounded-xl"
              >
                {link[0]}
              </Link>
            ))}
          </div>

        </aside>

        <section className="flex items-center justify-center">

          <div className="text-center">
            <h2 className="text-5xl font-bold">
              لوحة التحكم
            </h2>

            <p className="mt-4">
              ERP Mauritania
            </p>
          </div>

        </section>

      </div>
    </main>
  );
}