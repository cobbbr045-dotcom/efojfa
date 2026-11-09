import React, { useState, useEffect } from 'react';
import { Product, ProductVariant, InventoryLog, ProductColor } from '../../types';
import { api } from '../../services/api';
import { getStockTag } from '../../utils/stock';
import {
  Package,
  AlertCircle,
  TrendingDown,
  History,
  Plus,
  Minus,
  Check,
  Search,
  Filter,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Sliders
} from 'lucide-react';

interface InventoryTabProps {
  products: Product[];
  onRefresh: () => Promise<void>;
}

export const InventoryTab: React.FC<InventoryTabProps> = ({ products, onRefresh }) => {
  const [logs, setLogs] = useState<InventoryLog[]>([]);
  const [search, setSearch] = useState('');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out'>('all');

  // Adjustment Modal
  const [adjustingProduct, setAdjustingProduct] = useState<Product | null>(null);
  const [selectedVariantColor, setSelectedVariantColor] = useState<ProductColor>('Blue');
  const [adjustmentType, setAdjustmentType] = useState<'set' | 'add' | 'remove'>('set');
  const [adjustmentAmount, setAdjustmentAmount] = useState<number | string>(10);
  const [adjustmentReason, setAdjustmentReason] = useState<string>('manual_adjustment');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchLogs = async () => {
    try {
      const data = await api.adminGetInventoryLogs();
      setLogs(data);
    } catch (e) {
      console.warn('Failed to fetch inventory logs', e);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const flagship = products.find(p => p.variants && p.variants.length > 0) || products[0];
  const variants = flagship?.variants || [
    {
      id: 'var-blue',
      color: 'Blue' as ProductColor,
      name: 'Ocean Sky Blue',
      sku: 'CLV-SQG-BLU',
      image: '/src/assets/images/clevara_cleaner_blue_1794193742888.jpg',
      stock: 10,
      hexColor: '#0284c7',
      isAvailable: true,
    },
    {
      id: 'var-white',
      color: 'White' as ProductColor,
      name: 'Pure Arctic White',
      sku: 'CLV-SQG-WHT',
      image: '/src/assets/images/clevara_cleaner_white_1794193756650.jpg',
      stock: 10,
      hexColor: '#f8fafc',
      isAvailable: true,
    },
    {
      id: 'var-orange',
      color: 'Orange' as ProductColor,
      name: 'Vibrant Sunset Orange',
      sku: 'CLV-SQG-ORG',
      image: '/src/assets/images/clevara_cleaner_orange_1794193770204.jpg',
      stock: 10,
      hexColor: '#ea580c',
      isAvailable: true,
    },
  ];

  const totalStock = variants.reduce((sum, v) => sum + v.stock, 0);

  // Quick single-click adjust for variant
  const handleQuickAdjust = async (color: ProductColor, delta: number) => {
    if (!flagship) return;
    const targetVariant = variants.find(v => v.color === color);
    if (!targetVariant) return;

    const newTarget = Math.max(0, targetVariant.stock + delta);
    setIsSubmitting(true);
    try {
      await api.adminAdjustInventory({
        productId: flagship.id,
        variantId: targetVariant.id,
        color,
        type: 'set',
        amount: newTarget,
        reason: delta > 0 ? `Restock (+${delta})` : `Reduction (${delta})`,
      });
      await onRefresh();
      await fetchLogs();
    } catch (err: any) {
      alert(err.message || 'Failed to adjust stock');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!flagship) return;
    setIsSubmitting(true);
    try {
      const targetVariant = variants.find(v => v.color === selectedVariantColor);
      await api.adminAdjustInventory({
        productId: flagship.id,
        variantId: targetVariant?.id,
        color: selectedVariantColor,
        type: adjustmentType,
        amount: Number(adjustmentAmount),
        reason: adjustmentReason,
      });
      await onRefresh();
      await fetchLogs();
      setAdjustingProduct(null);
    } catch (err: any) {
      alert(err.message || 'Failed to adjust stock');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Real-Time Stock Engine
            </span>
            <span className="text-stone-300">·</span>
            <span className="text-xs text-stone-500 font-medium">CLEVARA Inventory System</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-stone-900 mt-1">
            Colour Variant Inventory & Stock Control
          </h1>
          <p className="text-xs text-stone-500 font-light mt-0.5">
            Independently manage Blue, White, and Orange stock with automated customer threshold tags and atomic transaction logging.
          </p>
        </div>

        <button
          onClick={() => {
            setAdjustingProduct(flagship);
            setSelectedVariantColor('Blue');
            const target = variants.find(v => v.color === 'Blue');
            setAdjustmentAmount(target?.stock ?? 10);
            setAdjustmentType('set');
          }}
          className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
        >
          Custom Stock Adjustment
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* THREE COLOUR VARIANT INDEPENDENT MANAGEMENT CARDS */}
      {/* ------------------------------------------------------------- */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-stone-900">
            CLEVARA Multifunctional Spray Squeegee — Variant Stock
          </h2>
          <span className="text-xs text-stone-500 tabular-nums">
            Total Inventory: <strong className="text-stone-900">{totalStock} Pieces</strong> (10 Blue · 10 White · 10 Orange initial)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {variants.map((variant) => {
            const stockTag = getStockTag({ stock: variant.stock, lowStockThreshold: 5 } as any);

            return (
              <div
                key={variant.id}
                className="bg-white rounded-2xl border-2 border-stone-200/90 shadow-sm p-6 flex flex-col justify-between space-y-5 hover:border-stone-400 transition-all"
              >
                {/* Variant Header */}
                <div className="flex items-start gap-4">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                    <img
                      src={variant.image}
                      alt={variant.color}
                      className="w-full h-full object-cover"
                    />
                    <div
                      className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs"
                      style={{ backgroundColor: variant.hexColor }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-serif font-bold text-stone-950">
                        {variant.color} Edition
                      </h3>
                      <span className="text-[10px] font-mono text-stone-400">{variant.sku}</span>
                    </div>

                    {/* Customer-Facing Tag with exact prompt specifications */}
                    <div className="mt-1">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                          stockTag.severity === 'critical'
                            ? 'bg-rose-100 text-rose-800 border border-rose-300'
                            : stockTag.severity === 'warning'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : stockTag.severity === 'out_of_stock'
                            ? 'bg-stone-200 text-stone-700'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        }`}
                      >
                        {stockTag.label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Big Stock Metric Display */}
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-stone-500 uppercase tracking-wider block font-medium">
                      Available Stock
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-stone-950 tabular-nums">
                        {variant.stock}
                      </span>
                      <span className="text-xs text-stone-400">pieces in Kathmandu</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-stone-400 uppercase font-semibold block">Threshold Rule</span>
                    <span className="text-xs font-medium text-stone-600">
                      {variant.stock >= 10
                        ? '≥10: In Stock'
                        : variant.stock >= 4
                        ? '4–9: Limited Stock'
                        : variant.stock >= 1
                        ? '1–3: Only X Left!'
                        : '0: Sold Out'}
                    </span>
                  </div>
                </div>

                {/* Fast One-Click Stepper Controls */}
                <div className="space-y-2">
                  <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
                    Quick Stock Adjustments
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    <button
                      onClick={() => handleQuickAdjust(variant.color, 1)}
                      disabled={isSubmitting}
                      className="py-2 bg-stone-100 hover:bg-stone-200 text-stone-900 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      +1
                    </button>
                    <button
                      onClick={() => handleQuickAdjust(variant.color, 5)}
                      disabled={isSubmitting}
                      className="py-2 bg-stone-100 hover:bg-stone-200 text-stone-900 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      +5
                    </button>
                    <button
                      onClick={() => handleQuickAdjust(variant.color, -1)}
                      disabled={isSubmitting || variant.stock <= 0}
                      className="py-2 bg-stone-100 hover:bg-stone-200 text-stone-900 text-xs font-bold rounded-lg transition-colors cursor-pointer disabled:opacity-30"
                    >
                      -1
                    </button>
                    <button
                      onClick={() => {
                        setAdjustingProduct(flagship);
                        setSelectedVariantColor(variant.color);
                        setAdjustmentAmount(variant.stock);
                        setAdjustmentType('set');
                      }}
                      className="py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      Set
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* AUDIT LOG MOVEMENTS */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/50">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-stone-700" />
            <h3 className="text-sm font-serif font-bold text-stone-900">
              Inventory Movement Audit Log
            </h3>
          </div>
          <span className="text-xs text-stone-500 font-light">
            Server transaction ledger tracking restocks, customer deductions, and cancellations
          </span>
        </div>

        {logs.length === 0 ? (
          <div className="text-center py-10 text-stone-400 text-xs">
            No stock movements recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto max-h-72">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider font-semibold sticky top-0">
                <tr>
                  <th className="px-5 py-3">Timestamp</th>
                  <th className="px-5 py-3">Variant / Item</th>
                  <th className="px-5 py-3">Previous</th>
                  <th className="px-5 py-3">Change</th>
                  <th className="px-5 py-3">New Stock</th>
                  <th className="px-5 py-3">Reason</th>
                  <th className="px-5 py-3">Operator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-800">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-stone-50/60">
                    <td className="px-5 py-2.5 text-stone-400 font-mono text-[11px]">
                      {new Date(log.createdAt).toLocaleDateString()} {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-5 py-2.5 font-semibold text-stone-900">{log.productName}</td>
                    <td className="px-5 py-2.5 tabular-nums text-stone-500">{log.previousStock}</td>
                    <td className="px-5 py-2.5 font-bold tabular-nums">
                      <span className={log.change > 0 ? 'text-emerald-700' : 'text-rose-700'}>
                        {log.change > 0 ? `+${log.change}` : log.change}
                      </span>
                    </td>
                    <td className="px-5 py-2.5 font-bold text-stone-950 tabular-nums">{log.newStock}</td>
                    <td className="px-5 py-2.5 capitalize text-stone-600">
                      {log.reason.replace(/_/g, ' ')}
                    </td>
                    <td className="px-5 py-2.5 text-stone-500">{log.operator || 'System'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* ADJUSTMENT MODAL */}
      {/* ------------------------------------------------------------- */}
      {adjustingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl border border-stone-200 p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <div>
                <h3 className="text-base font-serif font-bold text-stone-900">
                  Adjust Colour Stock Quantity
                </h3>
                <p className="text-xs text-stone-500 font-light mt-0.5">
                  {flagship?.name}
                </p>
              </div>
              <button
                onClick={() => setAdjustingProduct(null)}
                className="p-1 text-stone-400 hover:text-stone-900 rounded-lg hover:bg-stone-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAdjustSubmit} className="space-y-4 text-xs">
              {/* Select Variant Colour */}
              <div>
                <label className="block text-stone-700 font-semibold mb-1.5">
                  Select Colour Variant <span className="text-rose-600">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Blue', 'White', 'Orange'] as const).map((color) => {
                    const isSelected = selectedVariantColor === color;
                    const v = variants.find(item => item.color === color);
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => {
                          setSelectedVariantColor(color);
                          setAdjustmentAmount(v?.stock ?? 10);
                        }}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'border-stone-900 bg-stone-50 font-bold text-stone-950 shadow-sm'
                            : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        <p>{color}</p>
                        <p className="text-[10px] text-stone-400 tabular-nums">({v?.stock ?? 0} pcs)</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Adjustment Mode */}
              <div>
                <label className="block text-stone-700 font-semibold mb-1.5">
                  Adjustment Mode
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'set', label: 'Set Exactly' },
                    { id: 'add', label: 'Add Stock (+)' },
                    { id: 'remove', label: 'Deduct (-)' },
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setAdjustmentType(mode.id as any)}
                      className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                        adjustmentType === mode.id
                          ? 'border-stone-900 bg-stone-900 text-white font-semibold'
                          : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Amount */}
              <div>
                <label className="block text-stone-700 font-semibold mb-1.5">
                  Quantity Amount (Pieces)
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={adjustmentAmount}
                  onChange={(e) => setAdjustmentAmount(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 text-sm font-bold focus:outline-none focus:border-stone-500"
                />
              </div>

              {/* Reason */}
              <div>
                <label className="block text-stone-700 font-semibold mb-1.5">
                  Reason for Movement
                </label>
                <select
                  value={adjustmentReason}
                  onChange={(e) => setAdjustmentReason(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 focus:outline-none focus:border-stone-500"
                >
                  <option value="restock">Warehouse Shipment Received (Restock)</option>
                  <option value="manual_adjustment">Physical Inventory Count Correction</option>
                  <option value="return">Customer Return Verified</option>
                  <option value="damage_removal">Defective / Damaged Piece Removal</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setAdjustingProduct(null)}
                  className="flex-1 py-2.5 border border-stone-200 text-stone-700 font-semibold rounded-lg hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-lg transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Updating...' : 'Commit Stock'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
