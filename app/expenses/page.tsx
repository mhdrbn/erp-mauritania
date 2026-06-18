"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Expense = {
  id: string;
  title: string;
  amount: number;
  expense_date: string;
  notes: string;
};

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [search, setSearch] = useState("");

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");

  async function loadExpenses() {
    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setExpenses(data);
    }
  }

  useEffect(() => {
    loadExpenses();
  }, []);

  const saveExpense = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase
      .from("expenses")
      .insert([
        {
          title,
          amount: Number(amount),
          notes,
        },
      ]);

    if (error) {
      alert(error.message);
      return;
    }

    alert("تم حفظ المصروف بنجاح");

    setTitle("");
    setAmount("");
    setNotes("");

    loadExpenses();
  };

  const deleteExpense = async (id: string) => {
    const ok = confirm("هل تريد حذف المصروف؟");

    if (!ok) return;

    const { error } = await supabase
      .from("expenses")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    loadExpenses();
  };

  const filteredExpenses = expenses.filter((expense) =>
    expense.title.toLowerCase().includes(search.toLowerCase())
  );

  const totalExpenses = filteredExpenses.reduce(
    (sum, expense) => sum + Number(expense.amount),
    0
  );

  return (
    <main className="min-h-screen p-6 bg-slate-100">
      <div className="max-w-5xl mx-auto">

        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <h1 className="text-3xl font-bold mb-6">
            إدارة المصاريف
          </h1>

          <form onSubmit={saveExpense} className="space-y-4">

            <input
              className="w-full border p-3 rounded-lg"
              placeholder="اسم المصروف"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <input
              className="w-full border p-3 rounded-lg"
              placeholder="المبلغ"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <textarea
              className="w-full border p-3 rounded-lg"
              placeholder="ملاحظات"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />

            <button
              type="submit"
              className="w-full bg-orange-600 text-white p-3 rounded-lg"
            >
              حفظ المصروف
            </button>

          </form>
        </div>

        <div className="bg-green-600 text-white rounded-2xl p-4 mb-6">
          <h2 className="text-xl font-bold">
            إجمالي المصاريف: {totalExpenses}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">

          <input
            className="w-full border p-3 rounded-lg mb-6"
            placeholder="بحث عن مصروف..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="space-y-4">

            {filteredExpenses.map((expense) => (
              <div
                key={expense.id}
                className="border rounded-xl p-4 flex justify-between items-center"
              >
                <div>
                  <h2 className="font-bold text-lg">
                    {expense.title}
                  </h2>

                  <p>المبلغ: {expense.amount}</p>
                  <p>التاريخ: {expense.expense_date}</p>
                  <p>{expense.notes}</p>
                </div>

                <button
                  onClick={() => deleteExpense(expense.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                  حذف
                </button>
              </div>
            ))}

            {filteredExpenses.length === 0 && (
              <p className="text-center text-gray-500">
                لا توجد مصاريف
              </p>
            )}

          </div>
        </div>

      </div>
    </main>
  );
}
