import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { formatNPR } from '../../utils/pricing';
import { Users, Phone, MapPin, Search, ShoppingBag } from 'lucide-react';

export const CustomersTab: React.FC = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await api.adminGetCustomers();
        setCustomers(data);
      } catch (e) {
        console.warn('Failed to load customers', e);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.cityMunicipality.toLowerCase().includes(q) ||
      c.district.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <h1 className="text-2xl font-serif font-bold text-stone-900">
            Customer Directory & Order History
          </h1>
          <p className="text-xs text-stone-500 font-light mt-0.5">
            Aggregated client profiles compiled securely from authenticated database orders across Nepal.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 flex items-center gap-2 max-w-md">
        <Search className="w-3.5 h-3.5 text-stone-400" />
        <input
          type="text"
          placeholder="Search by client name, mobile (+977), or city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent text-xs text-stone-900 focus:outline-none"
        />
      </div>

      {/* Customers List */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="text-center py-16 text-stone-400 text-xs">
            Loading client records...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-stone-400 text-xs">
            No customer profiles recorded yet. Customers will automatically appear here when orders are placed.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-5 py-3.5">Client Name</th>
                  <th className="px-5 py-3.5">Mobile Contact</th>
                  <th className="px-5 py-3.5">Primary Delivery Address</th>
                  <th className="px-5 py-3.5">Total Orders</th>
                  <th className="px-5 py-3.5">Lifetime Value (NPR)</th>
                  <th className="px-5 py-3.5">Latest Order</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-800">
                {filtered.map((c, idx) => (
                  <tr key={idx} className="hover:bg-stone-50/80 transition-colors">
                    <td className="px-5 py-3.5 font-semibold text-stone-900">{c.name}</td>
                    <td className="px-5 py-3.5 font-mono text-stone-700">{c.phone}</td>
                    <td className="px-5 py-3.5 text-stone-600 max-w-xs">
                      <p className="font-medium text-stone-800">
                        {c.houseNumber}, {c.areaTole}
                      </p>
                      <p className="text-[11px] text-stone-400">
                        {c.cityMunicipality}, {c.district} ({c.province})
                      </p>
                    </td>
                    <td className="px-5 py-3.5 font-bold text-stone-900 tabular-nums">
                      {c.totalOrders} orders
                    </td>
                    <td className="px-5 py-3.5 font-bold text-stone-950 tabular-nums">
                      {formatNPR(c.totalSpent)}
                    </td>
                    <td className="px-5 py-3.5 text-stone-400 font-mono text-[11px]">
                      {new Date(c.lastOrderDate).toLocaleDateString()}
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
