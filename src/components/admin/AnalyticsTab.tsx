import React from 'react';
import { formatNPR } from '../../utils/pricing';
import { Product, Order } from '../../types';
import { BarChart3, TrendingUp, DollarSign, Package, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

interface AnalyticsTabProps {
  analytics: any;
  products: Product[];
  orders: Order[];
}

export const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ analytics, products, orders }) => {
  const totalRevenue = analytics?.totalRevenue || 0;
  const totalOrders = orders.length;
  const averageOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  const deliveredCount = orders.filter((o) => o.status === 'Delivered').length;
  const pendingCount = orders.filter((o) => o.status === 'Pending').length;

  // Inventory valuation at retail price
  const inventoryValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="pb-6 border-b border-stone-200">
        <h1 className="text-2xl font-serif font-bold text-stone-900">
          Financial & Inventory Analytics
        </h1>
        <p className="text-xs text-stone-500 font-light mt-0.5">
          Real database computations exclusively in Nepalese Rupees (रु. NPR). No simulated metrics.
        </p>
      </div>

      {/* Core Revenue Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-1">
          <span className="text-xs uppercase tracking-wider text-stone-500 font-semibold">
            Gross Recorded Revenue
          </span>
          <p className="text-2xl font-bold text-stone-950 tabular-nums">
            {formatNPR(totalRevenue)}
          </p>
          <p className="text-[11px] text-stone-400 font-light">
            Excludes cancelled orders
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-1">
          <span className="text-xs uppercase tracking-wider text-stone-500 font-semibold">
            Average Order Value (AOV)
          </span>
          <p className="text-2xl font-bold text-stone-950 tabular-nums">
            {formatNPR(averageOrderValue)}
          </p>
          <p className="text-[11px] text-stone-400 font-light">
            Per customer checkout
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-1">
          <span className="text-xs uppercase tracking-wider text-stone-500 font-semibold">
            Total Units Dispatched
          </span>
          <p className="text-2xl font-bold text-stone-950 tabular-nums">
            {analytics?.totalUnitsSold || 0} units
          </p>
          <p className="text-[11px] text-stone-400 font-light">
            Fulfilled from Kathmandu warehouse
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-1">
          <span className="text-xs uppercase tracking-wider text-stone-500 font-semibold">
            Warehouse Asset Valuation
          </span>
          <p className="text-2xl font-bold text-stone-950 tabular-nums">
            {formatNPR(inventoryValue)}
          </p>
          <p className="text-[11px] text-stone-400 font-light">
            Retail value of physical stock
          </p>
        </div>
      </div>

      {/* Order Status Breakdown */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-serif font-bold text-stone-900">
          Order Fulfillment Progression
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/60">
            <span className="text-stone-500 block">Pending Dispatch</span>
            <span className="text-xl font-bold text-amber-800 tabular-nums">{pendingCount}</span>
          </div>
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/60">
            <span className="text-stone-500 block">Delivered & Collected</span>
            <span className="text-xl font-bold text-emerald-800 tabular-nums">{deliveredCount}</span>
          </div>
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/60">
            <span className="text-stone-500 block">Low Stock Warnings</span>
            <span className="text-xl font-bold text-amber-700 tabular-nums">{analytics?.lowStockCount || 0}</span>
          </div>
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/60">
            <span className="text-stone-500 block">Out of Stock Items</span>
            <span className="text-xl font-bold text-rose-700 tabular-nums">{analytics?.outOfStockCount || 0}</span>
          </div>
        </div>
      </div>

      {/* Top Performing Formulas Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-stone-200 bg-stone-50/50">
          <h3 className="text-sm font-serif font-bold text-stone-900">
            Leading Formulas by Customer Volume
          </h3>
        </div>

        {(!analytics?.topSelling || analytics.topSelling.length === 0) ? (
          <div className="text-center py-12 text-stone-400 text-xs">
            Product sales performance will populate as customer orders are fulfilled.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-5 py-3.5">Product Name</th>
                  <th className="px-5 py-3.5">Units Sold</th>
                  <th className="px-5 py-3.5">Gross Revenue (NPR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-800">
                {analytics.topSelling.map((it: any, idx: number) => (
                  <tr key={idx} className="hover:bg-stone-50/80">
                    <td className="px-5 py-3.5 font-semibold text-stone-900">{it.name}</td>
                    <td className="px-5 py-3.5 font-bold tabular-nums">{it.units} units</td>
                    <td className="px-5 py-3.5 font-bold tabular-nums text-stone-950">
                      {formatNPR(it.revenue)}
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
