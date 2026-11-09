import React, { useState } from 'react';
import { Deal, Product } from '../../types';
import { api } from '../../services/api';
import { formatNPR } from '../../utils/pricing';
import { Tag, Plus, Edit2, Trash2, Calendar, Check, X } from 'lucide-react';

interface DealsTabProps {
  deals: Deal[];
  products: Product[];
  onRefresh: () => Promise<void>;
}

export const DealsTab: React.FC<DealsTabProps> = ({ deals, products, onRefresh }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [bannerUrl, setBannerUrl] = useState('/src/assets/images/deal_banner_nepal_1794115563679.jpg');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<number | string>(10);
  const [couponCode, setCouponCode] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10));
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const PRESET_DEAL_IMAGES = [
    { label: 'Kathmandu Signature Cleanse', url: '/src/assets/images/deal_banner_nepal_1794115563679.jpg' },
    { label: 'Sanctuary Interior Living', url: '/src/assets/images/hero_clevara_lifestyle_1794115562217.jpg' },
    { label: 'Botanical Glass & Mist', url: '/src/assets/images/product_spray_window_cleaner_1794115562619.jpg' },
    { label: 'Pure Travertine & Marble Care', url: '/src/assets/images/product_surface_cleaner_1794115563573.jpg' }
  ];

  const openCreateModal = () => {
    setEditingDeal(null);
    setTitle('');
    setDescription('');
    setBannerUrl('/src/assets/images/deal_banner_nepal_1794115563679.jpg');
    setDiscountType('percentage');
    setDiscountValue(10);
    setCouponCode('CLEAN10');
    setStartDate(new Date().toISOString().slice(0, 10));
    setEndDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10));
    setSelectedProductIds([]);
    setIsModalOpen(true);
  };

  const openEditModal = (deal: Deal) => {
    setEditingDeal(deal);
    setTitle(deal.title);
    setDescription(deal.description);
    setBannerUrl(deal.bannerUrl || '/src/assets/images/deal_banner_nepal_1794115563679.jpg');
    setDiscountType(deal.discountType);
    setDiscountValue(deal.discountValue);
    setCouponCode(deal.couponCode || '');
    setStartDate(deal.startDate.slice(0, 10));
    setEndDate(deal.endDate.slice(0, 10));
    setSelectedProductIds(deal.productIds || []);
    setIsModalOpen(true);
  };

  const handleToggleProduct = (id: string) => {
    if (selectedProductIds.includes(id)) {
      setSelectedProductIds(selectedProductIds.filter((p) => p !== id));
    } else {
      setSelectedProductIds([...selectedProductIds, id]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        bannerUrl: bannerUrl.trim() || undefined,
        discountType,
        discountValue: Number(discountValue),
        couponCode: couponCode.trim().toUpperCase() || undefined,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        productIds: selectedProductIds,
      };

      if (editingDeal) {
        await api.adminUpdateDeal(editingDeal.id, payload);
      } else {
        await api.adminCreateDeal(payload);
      }
      await onRefresh();
      setIsModalOpen(false);
    } catch (err: any) {
      alert(err.message || 'Failed to save deal');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this promotional deal?')) {
      try {
        await api.adminDeleteDeal(id);
        await onRefresh();
      } catch (err: any) {
        alert(err.message || 'Failed to delete deal');
      }
    }
  };

  const handleToggleActive = async (deal: Deal) => {
    try {
      await api.adminUpdateDeal(deal.id, { isActive: !deal.isActive });
      await onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to update deal status');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <h1 className="text-2xl font-serif font-bold text-stone-900">
            Deals & Promotional Discounts
          </h1>
          <p className="text-xs text-stone-500 font-light mt-0.5">
            Configure campaign markdowns, custom promotional banners & pictures, and participating formulas.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create Promotional Deal</span>
        </button>
      </div>

      {/* Deals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {deals.map((deal) => {
          const isExpired = new Date(deal.endDate) < new Date();

          return (
            <div
              key={deal.id}
              className="bg-white rounded-xl border border-stone-200/90 overflow-hidden shadow-xs flex flex-col justify-between"
            >
              {deal.bannerUrl && (
                <div className="h-32 w-full overflow-hidden relative bg-stone-100 border-b border-stone-200">
                  <img
                    src={deal.bannerUrl}
                    alt={deal.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <span className="absolute bottom-2 left-3 text-white text-[11px] font-semibold tracking-wide">
                    {deal.productIds.length > 0 ? `${deal.productIds.length} Products Included` : 'Storewide Privilege'}
                  </span>
                </div>
              )}

              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                        deal.isActive && !isExpired
                          ? 'bg-emerald-50 text-emerald-800'
                          : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {isExpired ? 'Expired' : deal.isActive ? 'Active' : 'Paused'}
                    </span>

                    {deal.couponCode && (
                      <span className="font-mono text-xs font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded">
                        {deal.couponCode}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-serif font-bold text-stone-900">
                    {deal.title}
                  </h3>
                  <p className="text-xs text-stone-500 font-light line-clamp-2">
                    {deal.description}
                  </p>

                  <div className="pt-2 flex items-baseline gap-2">
                    <span className="text-xl font-bold text-stone-950 tabular-nums">
                      {deal.discountType === 'percentage'
                        ? `${deal.discountValue}% OFF`
                        : `${formatNPR(deal.discountValue)} OFF`}
                    </span>
                    <span className="text-xs text-stone-400">
                      ({deal.timesRedeemed} redemptions)
                    </span>
                  </div>
                </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="text-stone-400 font-light">
                  Until {new Date(deal.endDate).toLocaleDateString()}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleToggleActive(deal)}
                    className="p-1.5 text-stone-600 hover:text-stone-950 hover:bg-stone-100 rounded"
                    title={deal.isActive ? 'Pause Deal' : 'Activate Deal'}
                  >
                    {deal.isActive ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <X className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => openEditModal(deal)}
                    className="p-1.5 text-stone-600 hover:text-stone-950 hover:bg-stone-100 rounded"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(deal.id)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          );
        })}
      </div>

      {/* Modal for Create/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-stone-200 space-y-4 animate-fade-in text-xs">
            <h3 className="text-base font-serif font-bold text-stone-900">
              {editingDeal ? 'Edit Promotion Deal' : 'Create New Promotion Deal'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">Campaign Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kathmandu Valley Home Clarity Week"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Special markdown terms..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Deal Picture / Promotional Banner</label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {PRESET_DEAL_IMAGES.map((img) => (
                    <button
                      key={img.url}
                      type="button"
                      onClick={() => setBannerUrl(img.url)}
                      className={`relative rounded-lg overflow-hidden border-2 transition-all h-14 cursor-pointer ${
                        bannerUrl === img.url ? 'border-stone-900 ring-2 ring-stone-900/20' : 'border-stone-200 opacity-60 hover:opacity-100'
                      }`}
                      title={img.label}
                    >
                      <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Or enter custom image URL"
                  value={bannerUrl}
                  onChange={(e) => setBannerUrl(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 text-xs focus:outline-none"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed NPR (रु.)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Discount Value *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 text-xs focus:outline-none font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Coupon Code (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. CLEAN10"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 text-xs focus:outline-none font-mono uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs"
                  />
                </div>
              </div>

              {/* Participating products */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-stone-700 font-semibold">
                    Participating Products ({selectedProductIds.length} of {products.length})
                  </label>
                  {products.length > 0 && (
                    <div className="flex gap-2 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setSelectedProductIds(products.map(p => p.id))}
                        className="text-stone-900 underline hover:text-stone-700 cursor-pointer"
                      >
                        Select All
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedProductIds([])}
                        className="text-stone-500 underline hover:text-stone-700 cursor-pointer"
                      >
                        Clear
                      </button>
                    </div>
                  )}
                </div>
                <div className="max-h-36 overflow-y-auto border border-stone-200 rounded-lg p-2 space-y-1 bg-stone-50">
                  {products.length === 0 ? (
                    <p className="text-stone-400 italic text-center py-2">No products added yet. Deal will apply as storewide promotion.</p>
                  ) : (
                    products.map((p) => (
                      <label key={p.id} className="flex items-center gap-2 p-1 hover:bg-white rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedProductIds.includes(p.id)}
                          onChange={() => handleToggleProduct(p.id)}
                          className="rounded text-stone-900"
                        />
                        <span className="truncate">{p.name} ({formatNPR(p.price)})</span>
                      </label>
                    ))
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg shadow-md font-semibold"
                >
                  {isSubmitting ? 'Saving...' : 'Save Promotion'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
