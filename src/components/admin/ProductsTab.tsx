import React, { useState } from 'react';
import { Product } from '../../types';
import { formatNPR } from '../../utils/pricing';
import { getStockTag } from '../../utils/stock';
import { api } from '../../services/api';
import { ProductFormModal } from './ProductFormModal';
import { Plus, Edit2, Copy, Trash2, Search, Eye, EyeOff, Sparkles, Filter } from 'lucide-react';

interface ProductsTabProps {
  products: Product[];
  onRefresh: () => Promise<void>;
}

export const ProductsTab: React.FC<ProductsTabProps> = ({ products, onRefresh }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesCat && matchesStatus;
  });

  const handleCreateProduct = async (productData: any) => {
    await api.adminCreateProduct(productData);
    await onRefresh();
  };

  const handleUpdateProduct = async (productData: any) => {
    if (!editingProduct) return;
    await api.adminUpdateProduct(editingProduct.id, productData);
    await onRefresh();
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
      try {
        await api.adminDeleteProduct(id);
        await onRefresh();
      } catch (err: any) {
        alert(err.message || 'Failed to delete product');
      }
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      await api.adminDuplicateProduct(id);
      await onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to duplicate product');
    }
  };

  const handleToggleStatus = async (product: Product) => {
    const nextStatus = product.status === 'published' ? 'unpublished' : 'published';
    try {
      await api.adminUpdateProduct(product.id, { status: nextStatus });
      await onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to update product status');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <h1 className="text-2xl font-serif font-bold text-stone-900">
            Product Catalog Management
          </h1>
          <p className="text-xs text-stone-500 font-light mt-0.5">
            Add, update, duplicate, and configure pricing and visibility for all CLEVARA items.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingProduct(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-1 min-w-[240px] items-center gap-2 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs">
          <Search className="w-3.5 h-3.5 text-stone-400" />
          <input
            type="text"
            placeholder="Search by product name, SKU, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent focus:outline-none text-stone-900"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-700 focus:outline-none"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                Category: {c}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-700 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="published">Published Only</option>
            <option value="unpublished">Drafts Only</option>
            <option value="hidden">Hidden Only</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 text-stone-400 text-xs space-y-2">
            <p>No products match your current search or filter criteria.</p>
            <button
              onClick={() => {
                setEditingProduct(null);
                setIsModalOpen(true);
              }}
              className="text-stone-900 underline font-semibold"
            >
              Add a new product now
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-5 py-3.5">Product & SKU</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">Price (NPR)</th>
                  <th className="px-5 py-3.5">Live Stock & Tag</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-800">
                {filteredProducts.map((p) => {
                  const stockTag = getStockTag(p);
                  const img = p.images[0] || '/src/assets/images/product_spray_window_cleaner_1794115562619.jpg';

                  return (
                    <tr key={p.id} className="hover:bg-stone-50/80 transition-colors">
                      {/* Product & SKU */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={img}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover bg-stone-100 border border-stone-200 shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-stone-900">{p.name}</span>
                              {p.isFeatured && (
                                <span className="text-[10px] bg-amber-50 text-amber-800 px-1.5 py-0.2 rounded font-semibold">
                                  Featured
                                </span>
                              )}
                              {p.isBestseller && (
                                <span className="text-[10px] bg-stone-900 text-white px-1.5 py-0.2 rounded font-semibold">
                                  Bestseller
                                </span>
                              )}
                            </div>
                            <span className="font-mono text-[11px] text-stone-400 block mt-0.5">
                              {p.sku}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-5 py-3.5 text-stone-600 font-medium">{p.category}</td>

                      {/* Pricing in NPR */}
                      <td className="px-5 py-3.5 font-bold text-stone-950 tabular-nums">
                        {formatNPR(p.discountedPrice || p.price)}
                        {p.discountedPrice && (
                          <span className="block text-[11px] text-stone-400 font-normal line-through">
                            {formatNPR(p.price)}
                          </span>
                        )}
                      </td>

                      {/* Stock & Tag */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-stone-900 tabular-nums">{p.stock} units</span>
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                              stockTag.severity === 'critical'
                                ? 'bg-rose-50 text-rose-700'
                                : stockTag.severity === 'warning'
                                ? 'bg-amber-50 text-amber-800'
                                : stockTag.severity === 'out_of_stock'
                                ? 'bg-stone-100 text-stone-600'
                                : 'bg-stone-100 text-stone-700'
                            }`}
                          >
                            {stockTag.label}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => handleToggleStatus(p)}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 transition-colors ${
                            p.status === 'published'
                              ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                          }`}
                        >
                          {p.status === 'published' ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          <span className="capitalize">{p.status}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5 text-right space-x-1">
                        <button
                          onClick={() => {
                            setEditingProduct(p);
                            setIsModalOpen(true);
                          }}
                          title="Edit Product"
                          className="p-1.5 text-stone-600 hover:text-stone-950 hover:bg-stone-100 rounded-md transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDuplicate(p.id)}
                          title="Duplicate Product"
                          className="p-1.5 text-stone-600 hover:text-stone-950 hover:bg-stone-100 rounded-md transition-colors"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          title="Delete Product"
                          className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      <ProductFormModal
        isOpen={isModalOpen}
        product={editingProduct}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={editingProduct ? handleUpdateProduct : handleCreateProduct}
      />
    </div>
  );
};
