export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">
        ERP Mauritania
      </h1>

      <p className="mt-4 text-gray-600">
        منصة المحاسبة والإدارة للمحلات التجارية
      </p>

      <div className="mt-8 flex gap-4">
        <button className="px-6 py-3 rounded-lg bg-blue-600 text-white">
          تسجيل الدخول
        </button>

        <button className="px-6 py-3 rounded-lg border">
          إنشاء حساب
        </button>
      </div>
    </main>
  );
}