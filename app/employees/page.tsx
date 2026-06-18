"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Employee = {
  id: string;
  employee_name: string;
  phone: string;
  position: string;
  salary: number;
  notes: string;
};

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState("");

  const [employeeName, setEmployeeName] = useState("");
  const [phone, setPhone] = useState("");
  const [position, setPosition] = useState("");
  const [salary, setSalary] = useState("");
  const [notes, setNotes] = useState("");

  async function loadEmployees() {
    const { data, error } = await supabase
      .from("employees")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setEmployees(data);
    }
  }

  useEffect(() => {
    loadEmployees();
  }, []);

  const saveEmployee = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase
      .from("employees")
      .insert([
        {
          employee_name: employeeName,
          phone,
          position,
          salary: Number(salary),
          notes,
        },
      ]);

    if (error) {
      alert(error.message);
      return;
    }

    alert("تم حفظ العامل بنجاح");

    setEmployeeName("");
    setPhone("");
    setPosition("");
    setSalary("");
    setNotes("");

    loadEmployees();
  };

  const deleteEmployee = async (id: string) => {
    const ok = confirm("هل تريد حذف العامل؟");

    if (!ok) return;

    const { error } = await supabase
      .from("employees")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    loadEmployees();
  };

  const filteredEmployees = employees.filter((employee) =>
    employee.employee_name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen p-6 bg-slate-100">
      <div className="max-w-5xl mx-auto">

        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <h1 className="text-3xl font-bold mb-6">
            إدارة العمال
          </h1>

          <form onSubmit={saveEmployee} className="space-y-4">

            <input
              className="w-full border p-3 rounded-lg"
              placeholder="اسم العامل"
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
            />

            <input
              className="w-full border p-3 rounded-lg"
              placeholder="رقم الهاتف"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <input
              className="w-full border p-3 rounded-lg"
              placeholder="الوظيفة"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            />

            <input
              className="w-full border p-3 rounded-lg"
              placeholder="الراتب"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
            />

            <textarea
              className="w-full border p-3 rounded-lg"
              placeholder="ملاحظات"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white p-3 rounded-lg"
            >
              حفظ العامل
            </button>

          </form>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">

          <input
            className="w-full border p-3 rounded-lg mb-6"
            placeholder="بحث عن عامل..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="space-y-4">

            {filteredEmployees.map((employee) => (
              <div
                key={employee.id}
                className="border rounded-xl p-4 flex justify-between items-center"
              >
                <div>
                  <h2 className="font-bold text-lg">
                    {employee.employee_name}
                  </h2>

                  <p>الهاتف: {employee.phone}</p>
                  <p>الوظيفة: {employee.position}</p>
                  <p>الراتب: {employee.salary}</p>
                </div>

                <button
                  onClick={() => deleteEmployee(employee.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                  حذف
                </button>
              </div>
            ))}

            {filteredEmployees.length === 0 && (
              <p className="text-center text-gray-500">
                لا يوجد عمال
              </p>
            )}

          </div>
        </div>

      </div>
    </main>
  );
}
