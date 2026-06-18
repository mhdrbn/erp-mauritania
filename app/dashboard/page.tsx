"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function DashboardPage() {
  const [products, setProducts] = useState(0);
  const [customers, setCustomers] = useState(0);
  const [employees, setEmployees] = useState(0);
  const [sales, setSales] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [cashBalance, setCashBalance] = useState(0);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    const { count: productsCount } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true });

    const { count: customersCount } = await supabase
      .from("customers")
      .select("*", { count: "exact", head: true });

    const { count: employeesCount } = await supabase
      .from("employees")
      .select("*", { count: "exact", head: true });

    const { data: salesData } = await supabase
      .from("sales")
      .select("total_amount");

    const { data: expensesData } = await supabase
      .from("expenses")
      .select("amount");

    const { data: cashbox } = await supabase
      .from("cashbox")
      .select("*")
      .limit(1)
      .single();

    const totalSales =
      salesData?.reduce(
        (sum, item) =>
          sum + Number(item.total_amount),
        0
      ) || 0;

    const totalExpenses =
      expensesData?.reduce(
        (sum, item) =>
          sum + Number(item.amount),
        0
      ) || 0;

    setProducts(productsCount || 0);
    setCustomers(customersCount || 0);
    setEmployees(employeesCount || 0);
    setSales(totalSales);
    setExpenses(totalExpenses);
    setCashBalance(
      Number(cashbox?.current_balance || 0)
    );
  }

  const cards = [
    {
      title: "عدد المنتجات",
      value: products,
    },
    {
      title: "عدد العملاء",
      value: customers,
    },
    {
      title: "عدد العمال",
      value: employees,
    },
    {
      title: "إجمالي المبيعات",
      value: `${sales} MRU`,
    },
    {
      title: "إجمالي المصاريف",
      value: `${expenses} MRU`,
    },
    {
      title: "رصيد الخزينة",
      value: `${cashBalance} MRU`,
    },
  ];

  return (
    <main
      className="min-h-screen p-6 bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee')",
      }}
    >
      <div className="max-w-7xl mx-auto">

        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl">

          <h1 className="text-4xl font-bold text-white text-center">
            ERP Mauritania
          </h1>

          <p className="text-center text-white/80 mt-2">
            لوحة التحكم الرئيسية
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">

            {cards.map((card) => (
              <div
                key={card.title}
                className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl p-6 text-white"
              >
                <h2 className="text-xl font-bold">
                  {card.title}
                </h2>

                <p className="text-3xl font-bold mt-4">
                  {card.value}
                </p>
              </div>
            ))}

          </div>

        </div>

      </div>
    </main>
  );
}