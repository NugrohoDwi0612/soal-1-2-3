import React, { useEffect, useState } from "react";

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  const handleAddToCart = (product) => {
    if (!cart.find((item) => item.id === product.id)) {
      setCart([...cart, product]);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(search.toLowerCase())
  );

  const hitungDiskon = (total, isMember, promoCode) => {
    let diskon = 0;

    if (total > 1000000) diskon += 0.1;
    if (isMember) diskon += 0.05;
    if (promoCode === "DISKON20") diskon += 0.2;

    // Maksimal diskon 50%
    if (diskon > 0.5) diskon = 0.5;

    const totalSetelahDiskon = total - total * diskon;
    return { diskonPersen: diskon * 100, totalSetelahDiskon };
  };

  const isMember = true; // bisa ganti dengan state jika ingin toggle
  const promoCode = "DISKON20"; // bisa diubah manual atau dari input

  const totalUSD = cart.reduce((sum, item) => sum + item.price, 0);
  const totalIDR = totalUSD * 15000;

  const { diskonPersen, totalSetelahDiskon: totalIDRAkhir } = hitungDiskon(
    totalIDR,
    isMember,
    promoCode
  );

  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-blue-700 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">MyShop</h1>
        <nav className="space-x-4 hidden md:flex">
          <a href="#" className="hover:underline">
            Home
          </a>
          <a href="#" className="hover:underline">
            About
          </a>
          <a href="#" className="hover:underline">
            Contact
          </a>
        </nav>
        <div className="text-sm md:text-base">🛒 {cart.length}</div>
      </header>

      {/* Layout Container */}
      <div className="flex flex-1 flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="bg-gray-100 p-4 md:w-1/5">
          <h2 className="font-bold mb-2">Kategori</h2>
          <ul className="space-y-1">
            <li>
              <a href="#" className="hover:text-blue-600">
                Elektronik
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-600">
                Fashion
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-600">
                Peralatan Rumah
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-600">
                Lainnya
              </a>
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4">
          {/* Search */}
          <input
            type="text"
            placeholder="Cari produk..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-6 w-full px-4 py-2 border border-gray-300 rounded shadow"
          />

          {/* Product Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="flex flex-col bg-white rounded shadow overflow-hidden"
              >
                <div className="aspect-square overflow-hidden bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.title}
                    loading="lazy"
                    className="object-contain w-full h-full p-4"
                  />
                </div>
                <div className="p-4 flex flex-col gap-2 flex-grow">
                  <h2 className="font-bold text-sm line-clamp-2 h-10">
                    {product.title}
                  </h2>
                  <p className="text-green-600 font-semibold">
                    {formatRupiah(product.price * 15000)}{" "}
                    <span className="text-xs text-gray-500">
                      (${product.price})
                    </span>
                  </p>
                  <p className="text-yellow-500 text-sm">
                    ⭐ {product.rating.rate} / 5
                  </p>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="mt-auto bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
      {/* Productct Chackout */}
      <div className="mb-6 bg-gray-100 p-4 rounded shadow">
        <h2 className="font-bold mb-2">Ringkasan Belanja</h2>
        <p>
          Total:{" "}
          <strong>
            ${totalUSD.toFixed(2)} / {formatRupiah(totalIDR)}
          </strong>
        </p>
        <p>
          Diskon: <strong>{diskonPersen}%</strong>
        </p>
        <p>
          Total Setelah Diskon:{" "}
          <strong className="text-black">{formatRupiah(totalIDRAkhir)}</strong>
        </p>
      </div>

      {/* Footer */}
      <footer className="bg-gray-200 text-center py-4 text-sm">
        &copy; 2025 MyShop. All rights reserved.
      </footer>
    </div>
  );
}
