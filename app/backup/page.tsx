"use client";

export default function BackupPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-10 rounded-3xl shadow">

        <h1 className="text-3xl font-bold mb-6">
          النسخ الاحتياطي
        </h1>

        <button
          onClick={() => {
            alert("سيتم تطوير النسخ الاحتياطي لاحقاً");
          }}
          className="bg-blue-600 text-white p-4 rounded-xl"
        >
          إنشاء نسخة احتياطية
        </button>

      </div>
    </main>
  );
}