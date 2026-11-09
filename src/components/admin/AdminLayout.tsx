import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { api } from '../../services/api';
import { Product, Order, Deal, LimitedOffer } from '../../types';
import { DashboardTab } from './DashboardTab';
import { ProductsTab } from './ProductsTab';
import { InventoryTab } from './InventoryTab';
import { OrdersTab } from './OrdersTab';
import { DealsTab } from './DealsTab';
import { LimitedOffersTab } from './LimitedOffersTab';
import { CustomersTab } from './CustomersTab';
import { RestockingTab } from './RestockingTab';
import { AnalyticsTab } from './AnalyticsTab';
import { SettingsTab } from './SettingsTab';
import { EventsTab } from './EventsTab';
import { ProductFormModal } from './ProductFormModal';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingCart,
  Tag,
  Percent,
  Zap,
  Users,
  RefreshCw,
  BarChart3,
  Settings,
  Sparkles,
  LogOut,
  ExternalLink,
  Shield,
  Menu,
  X,
} from 'lucide-react';

interface AdminLayoutProps {
  onBackToStorefront: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ onBackToStorefront }) => {
  const { logout, storeName } = useAdminAuth();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Loaded data
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [limitedOffers, setLimitedOffers] = useState<LimitedOffer[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Add Product modal trigger
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const refreshAll = async () => {
    try {
      const [prods, ords, dls, lOffers, anl] = await Promise.all([
        api.adminGetProducts(),
        api.adminGetOrders(),
        api.adminGetDeals(),
        api.adminGetLimitedOffers(),
        api.adminGetAnalytics(),
      ]);
      setProducts(prods);
      setOrders(ords);
      setDeals(dls);
      setLimitedOffers(lOffers);
      setAnalytics(anl);
    } catch (e) {
      console.warn('Failed to refresh admin data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAll();
  }, []);

  const handleCreateProduct = async (productData: any) => {
    await api.adminCreateProduct(productData);
    await refreshAll();
  };

  const navItems = [
    { id: 'dashboard', label: '1. Dashboard', icon: LayoutDashboard },
    { id: 'products', label: '2. Products', icon: Package, badge: products.length },
    { id: 'inventory', label: '3. Inventory', icon: Layers },
    { id: 'orders', label: '4. Orders', icon: ShoppingCart, badge: orders.filter((o) => o.status === 'Pending').length },
    { id: 'deals', label: '5. Deals', icon: Tag },
    { id: 'discounts', label: '6. Discounts', icon: Percent },
    { id: 'limited-offers', label: '7. Limited Offers', icon: Zap },
    { id: 'customers', label: '8. Customers', icon: Users },
    { id: 'restocking', label: '9. Restocking', icon: RefreshCw },
    { id: 'analytics', label: '10. Analytics', icon: BarChart3 },
    { id: 'settings', label: '11. Settings', icon: Settings },
    { id: 'events', label: '12. Events', icon: Sparkles },
  ];

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-sans">
      {/* Top Bar Header */}
      <header className="bg-stone-900 text-stone-100 border-b border-stone-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-serif font-bold tracking-widest text-white uppercase">
                {storeName}
              </span>
              <span className="text-[11px] uppercase tracking-wider text-amber-400 font-semibold hidden sm:inline">
                Owner Portal (/admin)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <button
              onClick={onBackToStorefront}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
              <span className="hidden sm:inline">View Public Store</span>
            </button>
            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900 border border-rose-800/60 text-rose-200 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main App Layout with Sidebar & Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar Nav (Desktop) */}
        <aside className="w-full md:w-60 shrink-0 hidden md:block">
          <div className="bg-white rounded-2xl border border-stone-200 p-3 shadow-xs space-y-1 sticky top-24">
            <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-stone-400">
              Navigation Menu
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id || (item.id === 'discounts' && activeTab === 'deals');
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id === 'discounts' ? 'deals' : item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'text-stone-600 hover:bg-stone-100 hover:text-stone-950'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full tabular-nums ${
                        isActive ? 'bg-white text-stone-900' : 'bg-stone-200 text-stone-800'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white p-3 rounded-xl border border-stone-200 shadow-lg space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id === 'discounts' ? 'deals' : item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg ${
                    isActive ? 'bg-stone-900 text-white' : 'text-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="text-[10px] bg-stone-100 text-stone-800 px-1.5 py-0.5 rounded-full font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Content Body */}
        <main className="flex-1 min-w-0">
          {activeTab === 'dashboard' && (
            <DashboardTab
              analytics={analytics}
              products={products}
              orders={orders}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onOpenAddProduct={() => setIsAddModalOpen(true)}
            />
          )}

          {activeTab === 'products' && (
            <ProductsTab products={products} onRefresh={refreshAll} />
          )}

          {activeTab === 'inventory' && (
            <InventoryTab products={products} onRefresh={refreshAll} />
          )}

          {activeTab === 'orders' && (
            <OrdersTab orders={orders} onRefresh={refreshAll} />
          )}

          {(activeTab === 'deals' || activeTab === 'discounts') && (
            <DealsTab deals={deals} products={products} onRefresh={refreshAll} />
          )}

          {activeTab === 'limited-offers' && (
            <LimitedOffersTab offers={limitedOffers} products={products} onRefresh={refreshAll} />
          )}

          {activeTab === 'customers' && <CustomersTab />}

          {activeTab === 'restocking' && (
            <RestockingTab products={products} onRefresh={refreshAll} />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsTab analytics={analytics} products={products} orders={orders} />
          )}

          {activeTab === 'settings' && <SettingsTab onRefresh={refreshAll} />}

          {activeTab === 'events' && <EventsTab onRefresh={refreshAll} />}
        </main>
      </div>

      {/* Global Add Product Modal */}
      <ProductFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleCreateProduct}
      />
    </div>
  );
};
