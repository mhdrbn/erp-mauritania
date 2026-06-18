"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Debt = {
  id: string;
  customer_name: string;
  total_amount: number;
  paid_amount: number;
  remaining_amount: number;
  status: string;
};

export default function DebtsPage() {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [paidAmount, setPaidAmount] = useState("");

  useEffect(() => {
    loadDebts();
  }, []);

  async function loadDebts() {
    const { data } = await supabase
      .from("debts")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setDebts(data);
  }

  async function saveDebt() {
    const total = Number(totalAmount);
    const paid = Number(paidAmount);
    const remaining = total - paid;

    await supabase.from("debts").insert([
      {
        customer_name: customerName,
        total_amount: total,
        paid_amount: paid,
        remaining_amount: remaining,
        status:
          remaining > 0
            ? "غير مسدد"
            : "مسدد",
      },
    ]);

    setCustomerName("");
    setTotalAmount("");
    setPaidAmount("");

    loadDebts();

    alert("تم حفظ الدين");
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-5xl mx-auto">

        <div className="bg-white p-6 rounded-3xl shadow mb-6">

          <h1 className="text-3xl font-bold mb-4">
            الديون
          </h1>

          <div className="grid gap-3">

            <input
              className="border p-3 rounded-xl"
              placeholder="اسم العميل"
              value={customerName}
              onChange={(e) =>
                setCustomerName(e.target.value)
              }
            />

            <input
              className="border p-3 rounded-xl"
              placeholder="إجمالي الدين"
              value={totalAmount}
              onChange={(e) =>
                setTotalAmount(e.target.value)
              }
            />

            <input
              className="border p-3 rounded-xl"
              placeholder="المبلغ المدفوع"
              value={paidAmount}
              onChange={(e) =>
                setPaidAmount(e.target.value)
              }
            />

            <button
              onClick={saveDebt}
              className="bg-red-600 text-white p-3 rounded-xl"
            >
              حفظ الدين
            </button>

          </div>

        </div>

        <div className="bg-white p-6 rounded-3xl shadow">

          {debts.map((debt) => (
            <div
              key={debt.id}
              className="border rounded-xl p-4 mb-3"
            >
              <div className="font-bold">
                {debt.customer_name}
              </div>

              <div>
                الإجمالي: {debt.total_amount}
              </div>

              <div>
                المدفوع: {debt.paid_amount}
              </div>

              <div>
                المتبقي: {debt.remaining_amount}
              </div>

              <div>
                الحالة: {debt.status}
              </div>
            </div>
          ))}

        </div>

      </div>
    </main>
  );
}