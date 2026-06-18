"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function BusinessPage() {
  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [taxNumber, setTaxNumber] = useState("");
  const [businessType, setBusinessType] = useState("مواد غذائية");

  const saveBusiness = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase
      .from("business_profiles")
      .insert([
        {
          business_name: businessName,
          phone: phone,
          address: address,
          tax_number: taxNumber,
          business_type: businessType,
        },
      ]);

    if (error) {
      alert("حدث خطأ: " + error.message);
      return;
    }

    alert("تم حفظ بيانات المحل بنجاح");

    setBusinessName("");
    setPhone("");
    setAddress("");
    setTaxNumber("");
  };

  return (
    <main className="min-h-screen p-6 bg-slate-100">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow p-6">
        <h1 className="text-3xl font-bold mb-6">
          بيانات المحل
        </h1>

        <form onSubmit={saveBusiness} className="space-y-4">
          <input
            className="w-full border rounded-lg p-3"
            placeholder="اسم المحل"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
          />

          <input
            className="w-full border rounded-lg p-3"
            placeholder="رقم الهاتف"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <input
            className="w-full border rounded-lg p-3"
            placeholder="العنوان"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <input
            className="w-full border rounded-lg p-3"
            placeholder="الرقم الضريبي"
            value={taxNumber}
            onChange={(e) => setTaxNumber(e.target.value)}
          />

          <select
            className="w-full border rounded-lg p-3"
            value={businessType}
            onChange={(e) => setBusinessType(e.target.value)}
          >
            <option>مواد غذائية</option>
            <option>ملابس</option>
            <option>مخبزة</option>
            <option>تجميل</option>
            <option>مغسلة</option>
            <option>مطعم أو مقهى</option>
          </select>

          <button
            type="submit"
            className="w-full bg-green-600 text-white rounded-lg p-3"
          >
            حفظ البيانات
          </button>
        </form>
      </div>
    </main>
  );
}