"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Cashbox = {
  id: string;
  opening_balance: number;
  current_balance: number;
};

export default function CashboxPage() {
  const [cashbox, setCashbox] = useState<Cashbox | null>(null);
  const [openingBalance, setOpeningBalance] = useState("");

  async function loadCashbox() {
    const { data } = await supabase
      .from("cashbox")
      .select("*")
      .limit(1)
      .single();

    if (data) {
      setCashbox(data);
    }
  }

  useEffect(() => {
    loadCashbox();
  }, []);

  const saveCashbox = async (e: React.FormEvent) => {
    e.preventDefault();

    const value = Number(openingBalance);

    const { error } = await supabase.from("cashbox").insert([
      {
        opening_balance: value,
        current_balance: value,
      },
    ]);

    if (error) {
      alert(error.message);
      return;
    }

    alert("تم حفظ رأس المال بنجاح");

    setOpeningBalance("");

    loadCashbox();
  };

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-4xl mx-auto">

        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <h1 className="text-3xl font-bold mb-6">
            الخزينة
          </h1>

          {!cashbox && (
            <form onSubmit={saveCashbox} className="space-y-4">

              <input
                type="number"
                className="w-full border p-3 rounded-lg"
                placeholder="رأس المال الابتدائي"
                value={openingBalance}
                onChange={(e) => setOpeningBalance(e.target.value)}
              />

              <button
                type="submit"
                className="w-full bg-green-600 text-white p-3 rounded-lg"
              >
                حفظ رأس المال
              </button>

            </form>
          )}
        </div>

        {cashbox && (
          <div className="grid md:grid-cols-2 gap-6">

            <div className="bg-green-600 text-white rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-2">
                رأس المال الابتدائي
              </h2>

              <p className="text-3xl font-bold">
                {cashbox.opening_balance}
              </p>
            </div>

            <div className="bg-blue-600 text-white rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-2">
                الرصيد الحالي
              </h2>

              <p className="text-3xl font-bold">
                {cashbox.current_balance}
              </p>
            </div>

          </div>
        )}
      </div>
    </main>
  );
}