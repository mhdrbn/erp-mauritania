"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function ReportsPage() {
  const [salesToday, setSalesToday] = useState(0);
  const [salesMonth, setSalesMonth] = useState(0);
  const [invoiceCount, setInvoiceCount] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [cashBalance, setCashBalance] = useState(0);

  useEffect(() => {
    loadReports();
  }, []);

  async function loadReports() {
    const today = new Date().toISOString().split("T")[0];

    const { data: sales } = await supabase
      .from("sales")
      .select("*");

    const { data: expensesData } = await supabase
      .from("expenses")
      .select("*");

    const { data: cashbox } = await supabase
      .from("cashbox")
      .select("*")
      .limit(1)
      .single();

    const todaySales =
      sales?.filter((s) =>
        s.created_at.startsWith(today)
      ) || [];

    const currentMonth =
      new Date().getMonth();

    const monthSales =
      sales?.filter(
        (s) =>
          new Date(
            s.created_at
          ).getMonth() === currentMonth
      ) || [];

    setSalesToday(
      todaySales.reduce(
        (sum, s) =>
          sum + Number(s.total_amount),
        0
      )
    );

    setSalesMonth(
      monthSales.reduce(
        (sum, s) =>
          sum + Number(s.total_amount),
        0
      )
    );

    setInvoiceCount(
      sales?.length || 0
    );

    setExpenses(
      expensesData?.reduce(
        (sum, e) =>
          sum + Number(e.amount),
        0
      ) || 0
    );

    setCashBalance(
      Number(
        cashbox?.current_balance || 0
      )
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold mb-8">
          التقارير
        </h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="font-bold">
              مبيعات اليوم
            </h2>
            <p className="text-3xl mt-3">
              {salesToday} MRU
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="font-bold">
              مبيعات الشهر
            </h2>
            <p className="text-3xl mt-3">
              {salesMonth} MRU
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="font-bold">
              عدد الفواتير
            </h2>
            <p className="text-3xl mt-3">
              {invoiceCount}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="font-bold">
              المصاريف
            </h2>
            <p className="text-3xl mt-3">
              {expenses} MRU
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="font-bold">
              رصيد الخزينة
            </h2>
            <p className="text-3xl mt-3">
              {cashBalance} MRU
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="font-bold">
              الربح التقريبي
            </h2>
            <p className="text-3xl mt-3">
              {salesMonth - expenses} MRU
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}