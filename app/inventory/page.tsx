"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Product = {
  id: string;
  product_name: string;
  quantity: number;
  sale_price: number;
};

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("product_name");

    if (data) setProducts(data);
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-3xl shadow">

        <h1 className="text-3xl font-bold mb-6">
          إدارة المخزون
        </h1>

        <table className="w-full">
          <thead>
            <tr>
              <th>المنتج</th>
              <th>الكمية</th>
              <th>السعر</th>
              <th>الحالة</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.product_name}</td>
                <td>{product.quantity}</td>
                <td>{product.sale_price}</td>

                <td>
                  {product.quantity <= 5
                    ? "⚠ مخزون منخفض"
                    : "✅ جيد"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </main>
  );
}