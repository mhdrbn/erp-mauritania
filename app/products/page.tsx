"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Product = {
  id: string;
  product_name: string;
  barcode: string;
  purchase_price: number;
  sale_price: number;
  quantity: number;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");

  const [productName, setProductName] = useState("");
  const [barcode, setBarcode] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [quantity, setQuantity] = useState("");

  async function loadProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setProducts(data);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  const saveProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.from("products").insert([
      {
        product_name: productName,
        barcode: barcode,
        purchase_price: Number(purchasePrice),
        sale_price: Number(salePrice),
        quantity: Number(quantity),
      },
    ]);

    if (error) {
      alert(error.message);
      return;
    }

    alert("تم حفظ المنتج بنجاح");

    setProductName("");
    setBarcode("");
    setPurchasePrice("");
    setSalePrice("");
    setQuantity("");

    loadProducts();
  };

  const deleteProduct = async (id: string) => {
    const ok = confirm("هل تريد حذف المنتج؟");

    if (!ok) return;

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    loadProducts();
  };

  const filteredProducts = products.filter((product) =>
    product.product_name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen p-6 bg-slate-100">
      <div className="max-w-5xl mx-auto">

        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <h1 className="text-3xl font-bold mb-6">
            إدارة المنتجات
          </h1>

          <form onSubmit={saveProduct} className="space-y-4">

            <input
              className="w-full border p-3 rounded-lg"
              placeholder="اسم المنتج"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />

            <input
              className="w-full border p-3 rounded-lg"
              placeholder="الباركود"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
            />

            <input
              className="w-full border p-3 rounded-lg"
              placeholder="سعر الشراء"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
            />

            <input
              className="w-full border p-3 rounded-lg"
              placeholder="سعر البيع"
              value={salePrice}
              onChange={(e) => setSalePrice(e.target.value)}
            />

            <input
              className="w-full border p-3 rounded-lg"
              placeholder="الكمية"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />

            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded-lg"
            >
              حفظ المنتج
            </button>

          </form>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">

          <input
            className="w-full border p-3 rounded-lg mb-6"
            placeholder="بحث عن منتج..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="space-y-4">

            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="border rounded-xl p-4 flex justify-between items-center"
              >
                <div>
                  <h2 className="font-bold text-lg">
                    {product.product_name}
                  </h2>

                  <p>
                    سعر البيع: {product.sale_price}
                  </p>

                  <p>
                    الكمية: {product.quantity}
                  </p>

                  <p>
                    الباركود: {product.barcode}
                  </p>
                </div>

                <button
                  onClick={() => deleteProduct(product.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                  حذف
                </button>
              </div>
            ))}

            {filteredProducts.length === 0 && (
              <p className="text-center text-gray-500">
                لا توجد منتجات
              </p>
            )}

          </div>
        </div>
      </div>
    </main>
  );
}