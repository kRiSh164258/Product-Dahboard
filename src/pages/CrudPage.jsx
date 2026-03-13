import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addProduct,
  updateProduct,
  deleteProduct,
} from "../feature/Product/productslice";

const empty = { title: "", price: "", category: "", stock: "" };

export default function CrudPage() {
  const dispatch = useDispatch();
  const { items } = useSelector((s) => s.products);

  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [dark, setDark] = useState(false);
  const [category, setCategory] = useState("all");
  const [deleteId, setDeleteId] = useState(null);

  // Get unique categories from items
  const categories = [
    "all",
    ...new Set(items.map((p) => p.category).filter(Boolean)),
  ];

  // Filter by category
  const filtered =
    category === "all" ? items : items.filter((p) => p.category === category);

  // Low stock items
  const lowStock = items.filter((p) => Number(p.stock) < 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    if (editId) {
      dispatch(updateProduct({ ...form, id: editId }));
      setEditId(null);
    } else {
      dispatch(addProduct(form));
    }
    setForm(empty);
    setShowForm(false);
  };

  const handleEdit = (p) => {
    setForm({
      title: p.title,
      price: p.price,
      category: p.category,
      stock: p.stock,
    });
    setEditId(p.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => {
    setForm(empty);
    setEditId(null);
    setShowForm(false);
  };

  const confirmDelete = (id) => setDeleteId(id);

  const handleDeleteConfirm = () => {
    dispatch(deleteProduct(deleteId));
    setDeleteId(null);
  };

  // theme classes
  const bg = dark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900";
  const card = dark
    ? "bg-gray-800 border-gray-700"
    : "bg-white border-gray-100";
  const input = dark
    ? "bg-gray-700 border-gray-600 text-white focus:ring-indigo-400"
    : "bg-white border-gray-200 text-gray-800 focus:ring-indigo-400";
  const theadBg = dark
    ? "bg-gray-700 text-gray-300"
    : "bg-gray-50 text-gray-600";
  const rowHover = dark ? "hover:bg-gray-700/60" : "hover:bg-indigo-50/50";
  const rowBorder = dark ? "border-gray-700" : "border-gray-50";
  const label = dark ? "text-gray-300" : "text-gray-600";
  const subtext = dark ? "text-gray-400" : "text-gray-500";

  return (
    <div className={`min-h-screen transition-colors duration-300 ${bg}`}>
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Manage Products</h1>
            <p className={`text-sm ${subtext}`}>
              Total records:{" "}
              <span className="font-semibold text-indigo-500">
                {items.length}
              </span>
              {filtered.length !== items.length && (
                <span className={`ml-2 ${subtext}`}>
                  · Showing {filtered.length}
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Dark mode toggle */}
            <button
              onClick={() => setDark(!dark)}
              className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none ${dark ? "bg-indigo-600" : "bg-gray-300"}`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full flex items-center justify-center text-xs transition-transform duration-300 shadow ${dark ? "translate-x-6 bg-white" : "translate-x-0 bg-white"}`}
              >
                {dark ? "🌙" : "☀️"}
              </span>
            </button>

            <button
              onClick={() => {
                setShowForm(!showForm);
                setEditId(null);
                setForm(empty);
              }}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-[1.02]"
            >
              + Add Product
            </button>
          </div>
        </div>

        {/* Low stock warning */}
        {lowStock.length > 0 && (
          <div className="bg-red-500/10 border border-red-400/40 text-red-400 px-4 py-3 rounded-xl mb-5 animate-fade-in flex items-start gap-3">
            <span className="text-lg mt-0.5">⚠️</span>
            <div className="text-sm">
              <p className="font-semibold mb-0.5">
                {lowStock.length} product{lowStock.length > 1 ? "s" : ""} out of
                stock!
              </p>
              <p className={subtext}>
                {lowStock.map((p) => p.title).join(", ")}
              </p>
            </div>
          </div>
        )}

        {/* Add / Edit form */}
        {showForm && (
          <div
            className={`border rounded-2xl shadow-sm p-6 mb-6 animate-slide-up ${card}`}
          >
            <h2 className="font-semibold mb-4">
              {editId ? "Edit Product" : "New Product"}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className={`text-xs block mb-1 ${label}`}>Title</label>
                <input
                  className={`w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 transition ${input}`}
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              {[
                { key: "category", label: "Category" },
                { key: "price", label: "Price" },
                { key: "stock", label: "Stock" },
              ].map(({ key, label: lbl }) => (
                <div key={key}>
                  <label className={`text-xs block mb-1 ${label}`}>{lbl}</label>
                  <input
                    className={`w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 transition ${input}`}
                    value={form[key]}
                    onChange={(e) =>
                      setForm({ ...form, [key]: e.target.value })
                    }
                  />
                </div>
              ))}
              <div className="col-span-2 flex gap-3 pt-1">
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl text-sm font-medium transition-all hover:scale-[1.02]"
                >
                  {editId ? "Save changes" : "Add product"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className={`px-5 py-2 rounded-xl text-sm font-medium transition ${dark ? "bg-gray-700 hover:bg-gray-600 text-gray-200" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Category filter tabs */}
        <div className="flex gap-2 flex-wrap mb-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all duration-200
                ${
                  category === cat
                    ? "bg-indigo-600 text-white scale-105"
                    : dark
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
            >
              {cat === "all"
                ? `All (${items.length})`
                : `${cat} (${items.filter((p) => p.category === cat).length})`}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className={`rounded-2xl shadow-sm border overflow-hidden ${card}`}>
          <table className="w-full text-sm">
            <thead className={`border-b ${rowBorder}`}>
              <tr className={theadBg}>
                {["Title", "Category", "Price", "Stock", "Actions"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className={`text-center py-12 ${subtext}`}>
                    No products found in this category.
                  </td>
                </tr>
              ) : (
                filtered.map((p, i) => (
                  <tr
                    key={p.id}
                    className={`border-b transition-colors animate-slide-in ${rowBorder} ${rowHover} ${Number(p.stock) < 1 ? "bg-red-500/5" : ""}`}
                    style={{ animationDelay: `${i * 0.02}s` }}
                  >
                    <td className="px-4 py-3 font-medium">{p.title}</td>
                    <td className="px-4 py-3">
                      <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full capitalize">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-green-500 font-medium">
                      ${p.price}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          Number(p.stock) < 1
                            ? "bg-red-100 text-red-600"
                            : Number(p.stock) < 10
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                        }`}
                      >
                        {Number(p.stock) < 1
                          ? "Out of stock"
                          : `${p.stock} in stock`}
                      </span>
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      <button
                        onClick={() => handleEdit(p)}
                        className="bg-amber-50 text-amber-700 hover:bg-amber-100 px-3 py-1 rounded-lg text-xs font-medium transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => confirmDelete(p.id)}
                        className="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1 rounded-lg text-xs font-medium transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div
            className={`rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4 animate-slide-up ${card}`}
          >
            <div className="text-3xl mb-3 text-center">🗑️</div>
            <h3 className="text-lg font-semibold text-center mb-1">
              Delete product?
            </h3>
            <p className={`text-sm text-center mb-6 ${subtext}`}>
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className={`flex-1 py-2 rounded-xl text-sm font-medium transition ${dark ? "bg-gray-700 hover:bg-gray-600 text-gray-200" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl text-sm font-medium transition"
              >
                Yes, delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
