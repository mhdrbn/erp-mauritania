"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Customer = {
  id: string;
  customer_name: string;
  phone: string;
  address: string;
  notes: string;
  balance: number;
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  async function loadCustomers() {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setCustomers(data);
    }
  }

  useEffect(() => {
    loadCustomers();
  }, []);

  const saveCustomer = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase
      .from("customers")
      .insert([
        {
          customer_name: customerName,
          phone,
          address,
          notes,
        },
      ]);

    if (error) {
      alert(error.message);
      return;
    }

    alert("تم حفظ العميل بنجاح");

    setCustomerName("");
    setPhone("");
    setAddress("");
    setNotes("");

    loadCustomers();
  };

  const deleteCustomer = async (id: string) => {
    const ok = confirm("هل تريد حذف العميل؟");

    if (!ok) return;

    const { error } = await supabase
      .from("customers")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    loadCustomers();
  };

  const filteredCustomers = customers.filter((customer) =>
    customer.customer_name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen p-6 bg-slate-100">
      <div className="max-w-5xl mx-auto">

        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <h1 className="text-3xl font-bold mb-6">
            إدارة العملاء
          </h1>

          <form onSubmit={saveCustomer} className="space-y-4">

            <input
              className="w-full border p-3 rounded-lg"
              placeholder="اسم العميل"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />

            <input
              className="w-full border p-3 rounded-lg"
              placeholder="رقم الهاتف"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <input
              className="w-full border p-3 rounded-lg"
              placeholder="العنوان"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <textarea
              className="w-full border p-3 rounded-lg"
              placeholder="ملاحظات"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />

            <button
              type="submit"
              className="w-full bg-green-600 text-white p-3 rounded-lg"
            >
              حفظ العميل
            </button>

          </form>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">

          <input
            className="w-full border p-3 rounded-lg mb-6"
            placeholder="بحث عن عميل..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="space-y-4">

            {filteredCustomers.map((customer) => (
              <div
                key={customer.id}
                className="border rounded-xl p-4 flex justify-between items-center"
              >
                <div>
                  <h2 className="font-bold text-lg">
                    {customer.customer_name}
                  </h2>

                  <p>الهاتف: {customer.phone}</p>
                  <p>العنوان: {customer.address}</p>
                  <p>الرصيد: {customer.balance}</p>
                </div>

                <button
                  onClick={() => deleteCustomer(customer.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                  حذف
                </button>
              </div>
            ))}

            {filteredCustomers.length === 0 && (
              <p className="text-center text-gray-500">
                لا يوجد عملاء
              </p>
            )}

          </div>
        </div>

      </div>
    </main>
  );
}
