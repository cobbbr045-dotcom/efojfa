/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import { api } from './services/api';
import { Product, Deal, LimitedOffer } from './types';
import { Navbar } from './components/storefront/Navbar';
import { HeroSection } from './components/storefront/HeroSection';
import { FlagshipSection } from './components/storefront/FlagshipSection';
import { DealsBanner } from './components/storefront/DealsBanner';
import { ProductGrid } from './components/storefront/ProductGrid';
import { ProductDetailModal } from './components/storefront/ProductDetailModal';
import { CartDrawer } from './components/storefront/CartDrawer';
import { CheckoutModal } from './components/storefront/CheckoutModal';
import { OrderSuccessModal } from './components/storefront/OrderSuccessModal';
import { EventCelebrationModal } from './components/storefront/EventCelebrationModal';
import { Footer } from './components/storefront/Footer';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminLayout } from './components/admin/AdminLayout';

function MainApp() {
  const { isAuthenticated, isLoading: authLoading } = useAdminAuth();
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    selectedProductForModal,
    setSelectedProductForModal,
    placedOrderSuccess,
    setPlacedOrderSuccess,
    addToCart,
    setSelectedColor,
  } = useCart();

  // Navigation route: 'store' or 'admin'
  const [currentRoute, setCurrentRoute] = useState<'store' | 'admin'>(() => {
    return window.location.pathname === '/admin' || window.location.hash === '#admin'
      ? 'admin'
      : 'store';
  });

  // Storefront catalog data
  const [products, setProducts] = useState<Product[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [limitedOffers, setLimitedOffers] = useState<LimitedOffer[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  const [isLoadingStore, setIsLoadingStore] = useState(true);
  const [isEventsModalOpen, setIsEventsModalOpen] = useState(false);

  // Sync route with browser history
  useEffect(() => {
    const handlePopState = () => {
      const isAdm = window.location.pathname === '/admin' || window.location.hash === '#admin';
      setCurrentRoute(isAdm ? 'admin' : 'store');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (route: 'store' | 'admin') => {
    setCurrentRoute(route);
    if (route === 'admin') {
      window.history.pushState({}, '', '/admin');
    } else {
      window.history.pushState({}, '', '/');
    }
  };

  const fetchStoreData = async () => {
    try {
      const [prods, dls, lOffers] = await Promise.all([
        api.getProducts({
          category: selectedCategory !== 'All' ? selectedCategory : undefined,
          search: searchQuery || undefined,
          sort: sortOption,
        }),
        api.getDeals(),
        api.getLimitedOffers(),
      ]);
      setProducts(prods);
      setDeals(dls);
      setLimitedOffers(lOffers);
    } catch (e) {
      console.warn('Failed to load storefront data', e);
    } finally {
      setIsLoadingStore(false);
    }
  };

  useEffect(() => {
    if (currentRoute === 'store') {
      fetchStoreData();
    }
  }, [selectedCategory, searchQuery, sortOption, currentRoute]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Find flagship product (CLEVARA Multifunctional Spray Squeegee Window Cleaner)
  const flagshipProduct = products.find(
    (p) => p.sku === 'CLV-SQG-499' || p.name.toLowerCase().includes('spray squeegee') || p.name.toLowerCase().includes('window cleaner')
  ) || products[0];

  const handleBuyNow = (product: Product, quantity: number, variant?: any) => {
    addToCart(product, quantity, variant);
    setIsCheckoutOpen(true);
  };

  // If viewing owner portal (/admin)
  if (currentRoute === 'admin') {
    if (authLoading) {
      return (
        <div className="min-h-screen bg-stone-900 flex items-center justify-center text-white text-xs">
          Verifying Owner Authentication...
        </div>
      );
    }

    if (!isAuthenticated) {
      return <AdminLogin onBackToStorefront={() => navigateTo('store')} />;
    }

    return <AdminLayout onBackToStorefront={() => navigateTo('store')} />;
  }

  // Customer-facing Storefront View
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans text-stone-900">
      {/* Navbar with Top Bar Contract */}
      <Navbar
        onOpenOwnerPortal={() => navigateTo('admin')}
        onOpenEventsModal={() => setIsEventsModalOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onScrollToSection={scrollToSection}
      />

      <main className="flex-grow">
        {/* Hero Section */}
        <HeroSection
          onExploreCollection={() => scrollToSection('catalog')}
          onExploreFlagship={() => scrollToSection('flagship')}
          onSelectColor={(col) => {
            setSelectedColor(col);
            scrollToSection('flagship');
          }}
        />

        {/* Flagship Product Showcase (CLEVARA Spray Squeegee Window Cleaner) */}
        {flagshipProduct && (
          <FlagshipSection
            flagshipProduct={flagshipProduct}
            onSelectProduct={(p) => setSelectedProductForModal(p)}
            onBuyNow={handleBuyNow}
          />
        )}

        {/* Privilege Offers & Flash Sales with genuine countdown */}
        {(deals.length > 0 || limitedOffers.length > 0) && (
          <DealsBanner
            deals={deals}
            limitedOffers={limitedOffers}
            products={products}
            onSelectProduct={(p) => setSelectedProductForModal(p)}
            onExploreCatalog={() => scrollToSection('catalog')}
          />
        )}

        {/* Living Catalog Grid with Category Tabs & Automatic Stock Tags */}
        <ProductGrid
          products={products}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          sortOption={sortOption}
          setSortOption={setSortOption}
          onSelectProduct={(p) => setSelectedProductForModal(p)}
          onOpenOwnerPortal={() => navigateTo('admin')}
        />
      </main>

      {/* Footer with Nepal concierge & delivery details */}
      <Footer onOpenOwnerPortal={() => navigateTo('admin')} />

      {/* Modals & Overlays */}
      <CartDrawer />

      <ProductDetailModal
        product={selectedProductForModal}
        onClose={() => setSelectedProductForModal(null)}
        onBuyNow={handleBuyNow}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={(order) => setPlacedOrderSuccess(order)}
      />

      <EventCelebrationModal
        isOpen={isEventsModalOpen}
        onClose={() => setIsEventsModalOpen(false)}
        onApplyVoucherToCheckout={(code) => {
          setIsCheckoutOpen(true);
        }}
      />

      <OrderSuccessModal
        order={placedOrderSuccess}
        onClose={() => {
          setPlacedOrderSuccess(null);
          fetchStoreData();
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AdminAuthProvider>
      <CartProvider>
        <MainApp />
      </CartProvider>
    </AdminAuthProvider>
  );
}
