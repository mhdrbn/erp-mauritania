"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Sale = {
  id: string;
  customer_name: string;
  payment_method: string;
  total_amount: number;
  created_at: string;
};

export default function FacturesPage() {
  const [sales, setSales] = useState<Sale[]>([]);

  useEffect(() => {
    loadSales();
  }, []);

  async function loadSales() {
    const { data } = await supabase
      .from("sales")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) {
      setSales(data);
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl shadow p-6">
          <h1 className="text-3xl font-bold mb-6">
            الفواتير
          </h1>

          <div className="overflow-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-200">
                  <th className="p-3 border">العميل</th>
                  <th className="p-3 border">طريقة الدفع</th>
                  <th className="p-3 border">المبلغ</th>
                  <th className="p-3 border">التاريخ</th>
                </tr>
              </thead>

              <tbody>
                {sales.map((sale) => (
                  <tr key={sale.id}>
                    <td className="p-3 border">
                      {sale.customer_name}
                    </td>

                    <td className="p-3 border">
                      {sale.payment_method}
                    </td>

                    <td className="p-3 border">
                      {sale.total_amount} MRU
                    </td>

                    <td className="p-3 border">
                      {new Date(
                        sale.created_at
                      ).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>

        </div>
      </div>
    </main>
  );
}