"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Bank = {
  id: string;
  bank_name: string;
  account_number: string;
  balance: number;
};

export default function BanksPage() {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [balance, setBalance] = useState("");

  useEffect(() => {
    loadBanks();
  }, []);

  async function loadBanks() {
    const { data } = await supabase
      .from("banks")
      .select("*")
      .order("created_at");

    if (data) setBanks(data);
  }

  async function saveBank() {
    await supabase.from("banks").insert([
      {
        bank_name: bankName,
        account_number: accountNumber,
        balance: Number(balance),
      },
    ]);

    setBankName("");
    setAccountNumber("");
    setBalance("");

    loadBanks();

    alert("تم حفظ الحساب البنكي");
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-5xl mx-auto">

        <div className="bg-white p-6 rounded-3xl shadow mb-6">
          <h1 className="text-3xl font-bold mb-4">
            الحسابات البنكية
          </h1>

          <div className="grid gap-3">

            <input
              className="border p-3 rounded-xl"
              placeholder="اسم البنك"
              value={bankName}
              onChange={(e) =>
                setBankName(e.target.value)
              }
            />

            <input
              className="border p-3 rounded-xl"
              placeholder="رقم الحساب"
              value={accountNumber}
              onChange={(e) =>
                setAccountNumber(e.target.value)
              }
            />

            <input
              className="border p-3 rounded-xl"
              placeholder="الرصيد"
              value={balance}
              onChange={(e) =>
                setBalance(e.target.value)
              }
            />

            <button
              onClick={saveBank}
              className="bg-green-600 text-white p-3 rounded-xl"
            >
              حفظ
            </button>

          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow">

          {banks.map((bank) => (
            <div
              key={bank.id}
              className="border rounded-xl p-4 mb-3"
            >
              <div className="font-bold">
                {bank.bank_name}
              </div>

              <div>
                الحساب: {bank.account_number}
              </div>

              <div>
                الرصيد: {bank.balance} MRU
              </div>
            </div>
          ))}

        </div>

      </div>
    </main>
  );
}