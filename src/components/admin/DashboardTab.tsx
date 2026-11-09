import React from 'react';
import { formatNPR } from '../../utils/pricing';
import { Product, Order } from '../../types';
import { getStockTag } from '../../utils/stock';
import {
  Banknote,
  ShoppingCart,
  Package,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
  Trophy,
  CheckCircle2,
  Clock,
  Truck
} from 'lucide-react';

interface DashboardTabProps {
  analytics: any;
  products: Product[];
  orders: Order[];
  onNavigateTab: (tab: string) => void;
  onOpenAddProduct: () => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  analytics,
  products,
  orders,
  onNavigateTab,
  onOpenAddProduct,
}) => {
  const recentOrders = orders.slice(0, 6);

  const variantStats = analytics?.variantStats || {
    Blue: { color: 'Blue', stock: 10, sold: 0, revenue: 0, hexColor: '#0284c7', image: '/src/assets/images/clevara_cleaner_blue_1794193742888.jpg' },
    White: { color: 'White', stock: 10, sold: 0, revenue: 0, hexColor: '#f8fafc', image: '/src/assets/images/clevara_cleaner_white_1794193756650.jpg' },
    Orange: { color: 'Orange', stock: 10, sold: 0, revenue: 0, hexColor: '#ea580c', image: '/src/assets/images/clevara_cleaner_orange_1794193770204.jpg' },
  };

  const bestSellingColor = analytics?.bestSellingColor || 'Blue';
  const totalStock = Object.values(variantStats).reduce((acc: number, v: any) => acc + (v.stock || 0), 0);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Welcome Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              CLEVARA Executive Dashboard
            </span>
            <span className="text-stone-300">·</span>
            <span className="text-xs text-stone-500 font-medium">CLEANER. BRIGHTER. BETTER.</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-stone-900 mt-1">
            Store Performance & Inventory Overview
          </h1>
          <p className="text-xs text-stone-500 font-light mt-0.5">
            Real-time fulfillment metrics, variant inventory breakdown (Blue, White, Orange), and Nepalese revenue.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab('inventory')}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            Manage Colour Stock
          </button>
          <button
            onClick={() => onNavigateTab('orders')}
            className="px-4 py-2 bg-white hover:bg-stone-50 border border-stone-200 text-stone-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Review Orders ({orders.length})
          </button>
        </div>
      </div>

      {/* KPI Stat Cards (4 cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs space-y-2">
          <div className="flex justify-between items-start">
            <span className="text-xs uppercase font-semibold tracking-wider text-stone-500">
              Total Revenue
            </span>
            <div className="p-2 bg-emerald-50 text-emerald-800 rounded-lg">
              <Banknote className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-stone-950 tabular-nums">
            {formatNPR(analytics?.totalRevenue || 0)}
          </div>
          <p className="text-[11px] text-stone-500 font-light">
            {analytics?.paidOrders || 0} paid via eSewa · {analytics?.codOrders || 0} COD orders
          </p>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs space-y-2">
          <div className="flex justify-between items-start">
            <span className="text-xs uppercase font-semibold tracking-wider text-stone-500">
              Total Orders Placed
            </span>
            <div className="p-2 bg-stone-100 rounded-lg text-stone-900">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-stone-950 tabular-nums">
            {orders.length} Orders
          </div>
          <p className="text-[11px] text-stone-500 font-light">
            {analytics?.pendingOrders || 0} pending dispatch · {analytics?.deliveredOrders || 0} delivered
          </p>
        </div>

        {/* Total Available Inventory */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs space-y-2">
          <div className="flex justify-between items-start">
            <span className="text-xs uppercase font-semibold tracking-wider text-stone-500">
              Total Remaining Stock
            </span>
            <div className="p-2 bg-sky-50 text-sky-800 rounded-lg">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-stone-950 tabular-nums">
            {totalStock} Pieces
          </div>
          <p className="text-[11px] text-stone-500 font-light">
            Initial catalog: 30 pieces (10 per colour)
          </p>
        </div>

        {/* Best Selling Colour */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs space-y-2">
          <div className="flex justify-between items-start">
            <span className="text-xs uppercase font-semibold tracking-wider text-stone-500">
              Best-Selling Edition
            </span>
            <div className="p-2 bg-amber-50 text-amber-800 rounded-lg">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-stone-950 flex items-center gap-2">
            <span>{bestSellingColor}</span>
            <span
              className="w-3.5 h-3.5 rounded-full border border-stone-300"
              style={{ backgroundColor: variantStats[bestSellingColor]?.hexColor }}
            />
          </div>
          <p className="text-[11px] text-stone-500 font-light">
            {variantStats[bestSellingColor]?.sold || 0} units sold
          </p>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* THREE COLOUR VARIANTS LIVE INVENTORY & SALES BREAKDOWN */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-4">
          <div>
            <h3 className="text-base font-serif font-bold text-stone-950">
              Colour Variant Inventory Breakdown (Blue · White · Orange)
            </h3>
            <p className="text-xs text-stone-500 font-light">
              Each variant is managed independently with atomic stock deduction and automatic threshold tags.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('inventory')}
            className="text-xs font-semibold text-stone-800 hover:text-stone-950 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>Adjust Quantities</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(['Blue', 'White', 'Orange'] as const).map((colorKey) => {
            const variant = variantStats[colorKey];
            const stock = variant?.stock ?? 10;
            const sold = variant?.sold ?? 0;
            const stockTag = getStockTag({ stock, lowStockThreshold: 5 } as any);

            return (
              <div
                key={colorKey}
                className="bg-stone-50 rounded-2xl p-5 border border-stone-200/80 flex flex-col justify-between space-y-4 hover:border-stone-400 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white border border-stone-200 shrink-0">
                    <img
                      src={variant?.image || `/src/assets/images/clevara_cleaner_${colorKey.toLowerCase()}_1794193742888.jpg`}
                      alt={colorKey}
                      className="w-full h-full object-cover"
                    />
                    <div
                      className="absolute bottom-1 right-1 w-3 h-3 rounded-full border border-white"
                      style={{ backgroundColor: variant?.hexColor }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-stone-900">{colorKey} Edition</h4>
                      {bestSellingColor === colorKey && sold > 0 && (
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-bold">
                          Top Seller
                        </span>
                      )}
                    </div>
                    <span
                      className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        stockTag.severity === 'critical'
                          ? 'bg-rose-100 text-rose-800'
                          : stockTag.severity === 'warning'
                          ? 'bg-amber-100 text-amber-800'
                          : stockTag.severity === 'out_of_stock'
                          ? 'bg-stone-200 text-stone-700'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {stockTag.label}
                    </span>
                  </div>
                </div>

                {/* Stock & Sales Metrics Grid */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-stone-200 text-xs">
                  <div>
                    <span className="text-stone-500 text-[11px] block">Stock Remaining</span>
                    <span className="text-lg font-bold text-stone-950 tabular-nums">
                      {stock} / 10
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-500 text-[11px] block">Units Sold</span>
                    <span className="text-lg font-bold text-stone-950 tabular-nums">
                      {sold} pcs
                    </span>
                  </div>
                </div>

                {/* Quick Edit Stock Button */}
                <button
                  onClick={() => onNavigateTab('inventory')}
                  className="w-full py-2 bg-white hover:bg-stone-100 border border-stone-200 text-stone-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center"
                >
                  Adjust {colorKey} Stock
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* RECENT ORDERS TABLE */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-stone-200 flex justify-between items-center bg-stone-50/50">
          <div>
            <h3 className="text-sm font-serif font-bold text-stone-900">
              Recent Customer Orders
            </h3>
            <p className="text-xs text-stone-500 font-light">
              Color variants selected and Nepal delivery addresses.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('orders')}
            className="text-xs font-semibold text-stone-800 hover:text-stone-950 flex items-center gap-1 cursor-pointer"
          >
            <span>View All ({orders.length})</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-12 text-stone-400 text-xs space-y-2">
            <p className="font-semibold text-stone-600">No customer orders placed yet.</p>
            <p>Go to the public storefront, choose a colour variant, and test the checkout flow!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-5 py-3.5">Order Ref</th>
                  <th className="px-5 py-3.5">Customer</th>
                  <th className="px-5 py-3.5">Selected Colour</th>
                  <th className="px-5 py-3.5">Payment</th>
                  <th className="px-5 py-3.5">Total Amount</th>
                  <th className="px-5 py-3.5">Fulfillment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-800">
                {recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-medium text-stone-900">
                      {ord.id}
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-stone-900">{ord.customer.fullName}</p>
                      <p className="text-[11px] text-stone-500">{ord.customer.phone} · {ord.customer.cityMunicipality}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-stone-100 text-stone-900">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{
                            backgroundColor:
                              ord.selectedColor === 'Blue'
                                ? '#0284c7'
                                : ord.selectedColor === 'White'
                                ? '#e2e8f0'
                                : ord.selectedColor === 'Orange'
                                ? '#ea580c'
                                : '#a8a29e',
                          }}
                        />
                        <span>{ord.selectedColor || ord.items[0]?.color || 'Blue'}</span>
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="space-y-0.5">
                        <p className="font-semibold text-stone-900">{ord.paymentMethod}</p>
                        <span
                          className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            ord.paymentStatus === 'PAID'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-stone-200 text-stone-700'
                          }`}
                        >
                          {ord.paymentStatus || (ord.paymentMethod === 'eSewa' ? 'PAID' : 'UNPAID')}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-bold text-stone-950 tabular-nums">
                      {formatNPR(ord.totalAmount)}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-md text-[11px] font-semibold ${
                          ord.status === 'Delivered'
                            ? 'bg-emerald-50 text-emerald-800'
                            : ord.status === 'Pending'
                            ? 'bg-amber-50 text-amber-800'
                            : ord.status === 'Cancelled'
                            ? 'bg-rose-50 text-rose-800'
                            : 'bg-stone-100 text-stone-800'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
