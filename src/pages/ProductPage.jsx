import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../feature/Product/productslice";

export default function ProductsPage() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((s) => s.products);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [dark, setDark] = useState(false);
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    if (items.length === 0) dispatch(fetchProducts());
  }, []);

  const categories = [
    "all",
    ...new Set(items.map((p) => p.category).filter(Boolean)),
  ];

  const filtered = items
    .filter((p) => category === "all" || p.category === category)
    .filter(
      (p) =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating-desc") return b.rating - a.rating;
      if (sortBy === "stock-asc") return a.stock - b.stock;
      return 0;
    });

  // theme
  const bg = dark
    ? "bg-gray-900 text-white min-h-screen"
    : "bg-gray-50 text-gray-900 min-h-screen";
  const card = dark
    ? "bg-gray-800 border-gray-700"
    : "bg-white border-gray-100";
  const inputCls = dark
    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
    : "bg-white border-gray-200 text-gray-700 placeholder-gray-400";
  const theadCls = dark
    ? "bg-gray-700 text-gray-300"
    : "bg-gray-50 text-gray-500";
  const rowBorder = dark ? "border-gray-700" : "border-gray-50";
  const rowHover = dark ? "hover:bg-gray-700/50" : "hover:bg-indigo-50/40";
  const subtext = dark ? "text-gray-400" : "text-gray-500";
  const tabActive = "bg-indigo-600 text-white";
  const tabIdle = dark
    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
    : "bg-gray-100 text-gray-600 hover:bg-gray-200";

  return (
    <div className={`transition-colors duration-300 ${bg}`}>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Products</h1>
            <p className={`text-sm ${subtext}`}>
              {items.length} total items
              {filtered.length !== items.length &&
                ` · ${filtered.length} shown`}
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition ${inputCls}`}
            >
              <option value="default">Sort: Default</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="rating-desc">Rating: Best first</option>
              <option value="stock-asc">Stock: Low first</option>
            </select>

            {/* Search */}
            <input
              className={`border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 w-52 transition ${inputCls}`}
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {/* Dark toggle */}
            <button
              onClick={() => setDark(!dark)}
              className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none ${dark ? "bg-indigo-600" : "bg-gray-300"}`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full flex items-center justify-center text-xs transition-transform duration-300 shadow bg-white ${dark ? "translate-x-6" : "translate-x-0"}`}
              >
                {dark ? "🌙" : "☀️"}
              </span>
            </button>
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 flex-wrap mb-5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all duration-200
                ${category === cat ? `${tabActive} scale-105` : tabIdle}`}
            >
              {cat === "all"
                ? `All (${items.length})`
                : `${cat} (${items.filter((p) => p.category === cat).length})`}
            </button>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div
            className={`rounded-2xl shadow-sm border overflow-hidden ${card}`}
          >
            <table className="w-full text-sm">
              <thead className={`border-b ${rowBorder}`}>
                <tr className={theadCls}>
                  {["#", "Title", "Category", "Price", "Rating", "Stock"].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-3 font-medium uppercase text-xs tracking-wide"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className={`text-center py-16 ${subtext}`}>
                      No products match your search.
                    </td>
                  </tr>
                ) : (
                  filtered.map((p, i) => (
                    <tr
                      key={p.id}
                      className={`border-b transition-colors animate-slide-in ${rowBorder} ${rowHover}`}
                      style={{ animationDelay: `${i * 0.015}s` }}
                    >
                      <td className={`px-4 py-3 ${subtext}`}>{p.id}</td>
                      <td className="px-4 py-3 font-medium">{p.title}</td>
                      <td className="px-4 py-3">
                        <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full capitalize">
                          {p.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-green-500 font-semibold">
                        ${p.price}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs font-medium ${
                            p.rating >= 4.5
                              ? "text-green-500"
                              : p.rating >= 3.5
                                ? "text-yellow-500"
                                : "text-red-400"
                          }`}
                        >
                          ★ {p.rating}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            p.stock < 5
                              ? "bg-red-100 text-red-600"
                              : p.stock < 20
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-green-100 text-green-700"
                          }`}
                        >
                          {p.stock < 5 ? `⚠ ${p.stock}` : p.stock}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
