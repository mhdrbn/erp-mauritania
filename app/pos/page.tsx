"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Product = {
  id: string;
  product_name: string;
  sale_price: number;
  quantity: number;
};

type CartItem = {
  id: string;
  product_name: string;
  sale_price: number;
  quantity: number;
};

export default function POSPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("نقدي");

  async function loadProducts() {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("product_name");

    if (data) {
      setProducts(data);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  const addToCart = (product: Product) => {
    const existing = cart.find((c) => c.id === product.id);

    if (existing) {
      setCart(
        cart.map((c) =>
          c.id === product.id
            ? { ...c, quantity: c.quantity + 1 }
            : c
        )
      );
    } else {
      setCart([
        ...cart,
        {
          id: product.id,
          product_name: product.product_name,
          sale_price: product.sale_price,
          quantity: 1,
        },
      ]);
    }
  };

  const total = cart.reduce(
    (sum, item) => sum + item.sale_price * item.quantity,
    0
  );

  const saveSale = async () => {
    if (cart.length === 0) {
      alert("السلة فارغة");
      return;
    }

    const { data: sale, error } = await supabase
      .from("sales")
      .insert([
        {
          payment_method: paymentMethod,
          total_amount: total,
        },
      ])
      .select()
      .single();

    if (error) {
      alert(error.message);
      return;
    }

    for (const item of cart) {
      await supabase.from("sale_items").insert([
        {
          sale_id: sale.id,
          product_id: item.id,
          product_name: item.product_name,
          quantity: item.quantity,
          unit_price: item.sale_price,
          total_price: item.sale_price * item.quantity,
        },
      ]);

      const product = products.find(
        (p) => p.id === item.id
      );

      if (product) {
        await supabase
          .from("products")
          .update({
            quantity:
              product.quantity - item.quantity,
          })
          .eq("id", item.id);
      }
    }

    alert("تم حفظ الفاتورة بنجاح");

    setCart([]);

    loadProducts();
  };

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-6">

        <div className="bg-white rounded-2xl p-6 shadow">
          <h1 className="text-3xl font-bold mb-6">
            المنتجات
          </h1>

          <div className="space-y-3">
            {products.map((product) => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                className="w-full border rounded-xl p-4 text-right hover:bg-slate-100"
              >
                <div className="font-bold">
                  {product.product_name}
                </div>

                <div>
                  السعر: {product.sale_price}
                </div>

                <div>
                  المخزون: {product.quantity}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow">

          <h2 className="text-3xl font-bold mb-6">
            السلة
          </h2>

          <div className="space-y-3 mb-6">
            {cart.map((item) => (
              <div
                key={item.id}
                className="border rounded-xl p-3"
              >
                <div className="font-bold">
                  {item.product_name}
                </div>

                <div>
                  الكمية: {item.quantity}
                </div>

                <div>
                  الإجمالي:
                  {" "}
                  {item.sale_price *
                    item.quantity}
                </div>
              </div>
            ))}
          </div>

          <select
            className="w-full border p-3 rounded-lg mb-4"
            value={paymentMethod}
            onChange={(e) =>
              setPaymentMethod(e.target.value)
            }
          >
            <option>نقدي</option>
            <option>بنكي</option>
            <option>مختلط</option>
          </select>

          <div className="text-2xl font-bold mb-4">
            الإجمالي: {total}
          </div>

          <button
            onClick={saveSale}
            className="w-full bg-green-600 text-white p-4 rounded-xl"
          >
            حفظ الفاتورة
          </button>

        </div>

      </div>
    </main>
  );
}