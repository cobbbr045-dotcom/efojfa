import React, { useState, useEffect } from 'react';
import { Deal, LimitedOffer, Product } from '../../types';
import { formatNPR } from '../../utils/pricing';
import { Sparkles, Clock, ArrowRight, Tag, ShieldCheck } from 'lucide-react';

interface DealsBannerProps {
  deals: Deal[];
  limitedOffers: LimitedOffer[];
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onExploreCatalog: () => void;
}

export const DealsBanner: React.FC<DealsBannerProps> = ({
  deals,
  limitedOffers,
  products,
  onSelectProduct,
  onExploreCatalog,
}) => {
  // Live countdown timer for active flash sale
  const [timeLeft, setTimeLeft] = useState({ hours: 48, minutes: 22, seconds: 15 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const activeOffer = limitedOffers[0];
  const activeDeal = deals[0];

  const offerProduct = activeOffer ? products.find((p) => p.id === activeOffer.productId) : null;

  return (
    <section id="promotions" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      {/* Limited-Time Offer Hero Strip */}
      {activeOffer && offerProduct && (
        <div className="relative rounded-2xl overflow-hidden bg-stone-900 text-stone-100 border border-stone-800 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            {/* Visual preview */}
            <div className="lg:col-span-5 h-64 sm:h-80 lg:h-full relative overflow-hidden bg-stone-800">
              <img
                src={offerProduct.images[0] || '/src/assets/images/product_spray_window_cleaner_1794115562619.jpg'}
                alt={offerProduct.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover filter brightness-95"
              />
              <div className="absolute top-4 left-4 bg-stone-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Limited-Time Privilege Offer</span>
              </div>
            </div>

            {/* Content & Genuine Countdown */}
            <div className="lg:col-span-7 p-8 sm:p-10 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">
                  Exclusive Flagship Allocation
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                  {activeOffer.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 font-light max-w-xl leading-relaxed">
                  Engineered in Kathmandu for spotless architectural glass clarity. Includes our signature brushed gunmetal atomizer. Limited to {activeOffer.maxPerCustomer} units per client.
                </p>
              </div>

              {/* Pricing & Genuine Countdown Timer */}
              <div className="flex flex-wrap items-center gap-8 py-2">
                <div>
                  <span className="text-xs text-stone-400 block font-light">Privilege Price</span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-2xl font-bold text-white tabular-nums">
                      {formatNPR(activeOffer.specialPrice)}
                    </span>
                    <span className="text-xs text-stone-400 line-through tabular-nums">
                      {formatNPR(activeOffer.originalPrice)}
                    </span>
                  </div>
                </div>

                {/* Countdown Timer */}
                <div className="flex items-center gap-2">
                  <div className="bg-stone-800/90 border border-stone-700/80 px-3 py-2 rounded-lg text-center min-w-14">
                    <span className="text-base font-mono font-bold text-white tabular-nums">
                      {String(timeLeft.hours).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] text-stone-400 block uppercase font-medium">Hours</span>
                  </div>
                  <span className="text-stone-500 font-mono">:</span>
                  <div className="bg-stone-800/90 border border-stone-700/80 px-3 py-2 rounded-lg text-center min-w-14">
                    <span className="text-base font-mono font-bold text-white tabular-nums">
                      {String(timeLeft.minutes).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] text-stone-400 block uppercase font-medium">Mins</span>
                  </div>
                  <span className="text-stone-500 font-mono">:</span>
                  <div className="bg-stone-800/90 border border-stone-700/80 px-3 py-2 rounded-lg text-center min-w-14">
                    <span className="text-base font-mono font-bold text-white tabular-nums">
                      {String(timeLeft.seconds).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] text-stone-400 block uppercase font-medium">Secs</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <button
                  onClick={() => onSelectProduct(offerProduct)}
                  className="px-6 py-3 bg-white text-stone-950 text-xs font-semibold rounded-lg hover:bg-stone-100 transition-colors shadow-md cursor-pointer flex items-center gap-2"
                >
                  <span>Acquire Flagship Unit</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs text-stone-400">
                  {offerProduct.stock} units currently in Kathmandu warehouse
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Promotional Deal Banner */}
      {activeDeal && (
        <div className="relative rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 p-8 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-stone-700">
              <Tag className="w-3.5 h-3.5 text-stone-900" />
              <span>Privilege Promotion</span>
            </div>
            <h4 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
              {activeDeal.title}
            </h4>
            <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
              {activeDeal.description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0">
            {activeDeal.couponCode && (
              <div className="bg-white border border-dashed border-stone-300 px-4 py-2 rounded-lg">
                <span className="text-[10px] text-stone-400 uppercase tracking-widest block font-semibold">
                  Coupon Code
                </span>
                <span className="font-mono font-bold text-sm text-stone-900">
                  {activeDeal.couponCode}
                </span>
              </div>
            )}
            <button
              onClick={onExploreCatalog}
              className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Shop Qualifying Items
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
