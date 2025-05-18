import React, { useEffect, useState } from "react";

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://fakestoreapi.com/products");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    if (!cart.find((item) => item.id === product.id)) {
      setCart([...cart, product]);
    }
  };

  const handleRemoveFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
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
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">MyShop</h1>
          <nav className="hidden md:flex space-x-6">
            <a
              href="#"
              className="hover:underline hover:text-blue-200 transition"
            >
              Home
            </a>
            <a
              href="#"
              className="hover:underline hover:text-blue-200 transition"
            >
              Products
            </a>
            <a
              href="#"
              className="hover:underline hover:text-blue-200 transition"
            >
              About
            </a>
            <a
              href="#"
              className="hover:underline hover:text-blue-200 transition"
            >
              Contact
            </a>
          </nav>
          <div className="relative">
            <button className="flex items-center space-x-1 bg-blue-700 hover:bg-blue-800 px-3 py-2 rounded-full transition">
              <span>🛒</span>
              <span className="font-medium">{cart.length}</span>
            </button>
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Layout Container */}
      <div className="flex flex-1 container mx-auto">
        {/* Sidebar */}
        <aside className="hidden md:block w-64 bg-white p-6 shadow-md mr-6">
          <h2 className="font-bold text-lg mb-4 text-gray-800">Categories</h2>
          <ul className="space-y-3">
            {[
              "electronics",
              "jewelery",
              "men's clothing",
              "women's clothing",
            ].map((category) => (
              <li key={category}>
                <a
                  href="#"
                  className="block px-3 py-2 rounded hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition"
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <h2 className="font-bold text-lg mb-4 text-gray-800">Filters</h2>
            <div className="space-y-3">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Price Range</h3>
                <div className="flex items-center space-x-2">
                  <input type="range" min="0" max="1000" className="w-full" />
                </div>
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>$0</span>
                  <span>$1000</span>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Rating</h3>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`rating-${rating}`}
                        className="mr-2"
                      />
                      <label
                        htmlFor={`rating-${rating}`}
                        className="flex items-center"
                      >
                        {Array(rating)
                          .fill()
                          .map((_, i) => (
                            <span key={i} className="text-yellow-400">
                              ★
                            </span>
                          ))}
                        {Array(5 - rating)
                          .fill()
                          .map((_, i) => (
                            <span key={i} className="text-gray-300">
                              ★
                            </span>
                          ))}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Search and Cart Summary */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="w-full md:w-1/2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="w-full md:w-auto bg-white p-4 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700">
                  Items in cart:
                </span>
                <span className="font-bold text-blue-600">{cart.length}</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="font-medium text-gray-700">Total:</span>
                <span className="font-bold">{formatRupiah(totalIDR)}</span>
              </div>
            </div>
          </div>

          {/* Loading and Error States */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
              <p>Error: {error}</p>
            </div>
          ) : (
            /* Product Cards */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300"
                  >
                    <div className="relative aspect-square bg-gray-100 flex items-center justify-center p-4">
                      <img
                        src={product.image}
                        alt={product.title}
                        loading="lazy"
                        className="object-contain w-full h-full mix-blend-multiply"
                      />
                      {product.rating.rate > 4.5 && (
                        <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                          Best Seller
                        </span>
                      )}
                    </div>
                    <div className="p-4 flex flex-col gap-2 flex-grow">
                      <div className="flex-grow">
                        <h2 className="font-bold text-sm line-clamp-2 h-12 mb-2">
                          {product.title}
                        </h2>
                        <div className="flex items-center mb-2">
                          <div className="flex text-yellow-400">
                            {Array(Math.floor(product.rating.rate))
                              .fill()
                              .map((_, i) => (
                                <span key={i}>★</span>
                              ))}
                            {product.rating.rate % 1 >= 0.5 && <span>★</span>}
                            {Array(5 - Math.ceil(product.rating.rate))
                              .fill()
                              .map((_, i) => (
                                <span key={i} className="text-gray-300">
                                  ★
                                </span>
                              ))}
                          </div>
                          <span className="text-xs text-gray-500 ml-1">
                            ({product.rating.count})
                          </span>
                        </div>
                      </div>
                      <p className="text-green-600 font-semibold text-lg">
                        {formatRupiah(product.price * 15000)}
                        <span className="text-xs text-gray-500 ml-1">
                          (${product.price.toFixed(2)})
                        </span>
                      </p>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="mt-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition flex items-center justify-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 mx-auto text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-gray-700">
                    No products found
                  </h3>
                  <p className="mt-1 text-gray-500">
                    Try adjusting your search or filter to find what you're
                    looking for.
                  </p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Checkout Panel */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 p-4 transform translate-y-0 transition-transform duration-300">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <h2 className="text-lg font-bold text-gray-800">
                  Order Summary
                </h2>
                <div className="flex items-center space-x-4 mt-2">
                  <p className="text-gray-600">
                    <span className="font-medium">Items:</span> {cart.length}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Subtotal:</span>{" "}
                    {formatRupiah(totalIDR)}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Discount:</span>{" "}
                    {diskonPersen}%
                  </p>
                  <p className="text-green-600 font-bold">
                    <span className="text-gray-800">Total:</span>{" "}
                    {formatRupiah(totalIDRAkhir)}
                  </p>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setCart([])}
                  className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition"
                >
                  Clear Cart
                </button>
                <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">MyShop</h3>
              <p className="text-gray-400">
                The best online shopping experience with quality products and
                fast delivery.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Products
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Customer Service</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    FAQs
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Shipping Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Returns & Refunds
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Track Order
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact Us</h4>
              <address className="text-gray-400 not-italic">
                <p>123 Shopping Street</p>
                <p>Surabaya, Indonesia</p>
                <p className="mt-2">Email: info@myshop.com</p>
                <p>Phone: +62 123 4567 890</p>
              </address>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
            &copy; {new Date().getFullYear()} MyShop. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
