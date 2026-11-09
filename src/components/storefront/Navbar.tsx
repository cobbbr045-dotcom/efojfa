import React from 'react';
import { ShoppingBag, Lock, Search, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';

interface NavbarProps {
  onOpenOwnerPortal: () => void;
  onOpenEventsModal?: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onScrollToSection: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenOwnerPortal,
  onOpenEventsModal,
  searchQuery,
  setSearchQuery,
  onScrollToSection,
}) => {
  const { totalItemCount, setIsCartOpen } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-stone-50/95 backdrop-blur-md border-b border-stone-200">
      {/* Promotional Top Ticker */}
      <div className="bg-stone-900 text-stone-200 px-4 py-2 text-center text-xs tracking-wider flex items-center justify-center gap-3">
        <span>Complimentary delivery across Nepal on orders above रु. 3,000</span>
        <span className="text-stone-500 hidden sm:inline">·</span>
        <span className="hidden sm:inline text-stone-300">Cash on Delivery (COD) Available</span>
      </div>

      {/* Top Bar Contract: Zone 1 (Brand) — Zone 2 (Nav Links) — Zone 3 (Primary Action) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="text-2xl font-serif font-bold tracking-widest text-stone-950 uppercase shrink-0"
        >
          CLEVARA
        </a>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-700">
          <button
            onClick={() => onScrollToSection('catalog')}
            className="hover:text-stone-950 transition-colors whitespace-nowrap shrink-0"
          >
            Collection
          </button>
          <button
            onClick={() => onScrollToSection('flagship')}
            className="hover:text-stone-950 transition-colors whitespace-nowrap shrink-0"
          >
            Flagship Cleaner
          </button>
          <button
            onClick={() => onScrollToSection('promotions')}
            className="hover:text-stone-950 transition-colors whitespace-nowrap shrink-0"
          >
            Privilege Offers
          </button>
          <button
            onClick={() => onScrollToSection('craft')}
            className="hover:text-stone-950 transition-colors whitespace-nowrap shrink-0"
          >
            Nepalese Craft
          </button>
          {onOpenEventsModal && (
            <button
              onClick={onOpenEventsModal}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-100/70 hover:bg-amber-200/80 text-amber-900 font-semibold rounded-full text-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>Events</span>
            </button>
          )}
          <button
            onClick={onOpenOwnerPortal}
            className="inline-flex items-center gap-1.5 text-stone-500 hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 text-xs"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Owner Portal</span>
          </button>
        </nav>

        {/* Zone 3: Search & Shopping Bag Action */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative hidden lg:block w-48">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search formula..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-100 border border-stone-200 text-xs rounded-lg pl-8 pr-3 py-2 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-400"
            />
          </div>

          <button
            onClick={() => setIsCartOpen(true)}
            aria-label={`Shopping bag with ${totalItemCount} items`}
            className="relative p-2.5 text-stone-800 hover:text-stone-950 bg-stone-100 hover:bg-stone-200/80 rounded-lg transition-colors flex items-center gap-2 text-xs font-semibold"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Bag</span>
            {totalItemCount > 0 && (
              <span className="bg-stone-900 text-white text-[11px] font-bold px-1.5 py-0.2 rounded-full tabular-nums">
                {totalItemCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenOwnerPortal}
            title="Owner Administration"
            className="md:hidden p-2.5 text-stone-600 hover:text-stone-900 bg-stone-100 rounded-lg"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
