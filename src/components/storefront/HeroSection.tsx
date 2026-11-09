import React from 'react';
import { ArrowRight, ShieldCheck, Sparkles, Check, Truck, Banknote, Droplets } from 'lucide-react';

interface HeroSectionProps {
  onExploreCollection: () => void;
  onExploreFlagship: () => void;
  onSelectColor?: (color: 'Blue' | 'White' | 'Orange') => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreCollection,
  onExploreFlagship,
  onSelectColor,
}) => {
  return (
    <section className="relative overflow-hidden bg-stone-950 text-stone-100">
      {/* Background imagery with subtle atmospheric lighting */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_clevara_lifestyle_1794115562217.jpg"
          alt="CLEVARA crystal clear panoramic windows"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-35 scale-105 filter saturate-80"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/95 via-stone-950/80 to-stone-950/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Brand Hero Identity */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-semibold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>CLEANER. BRIGHTER. BETTER.</span>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-stone-400 block">
                Official Nepal Flagship Release
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-tight">
                CLEVARA Multifunctional Spray Squeegee Window Cleaner
              </h1>
            </div>

            <p className="text-base sm:text-lg text-stone-300 leading-relaxed font-light max-w-xl">
              Engineered with Dyson-grade ergonomic balance and Apple-inspired minimalist precision. Combines pressure atomizing spray, high-density microfiber scrubbing, and optical-grade streak-free silicone in a single continuous stroke.
            </p>

            {/* Price & Free Delivery Pill */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2.5 rounded-xl">
                <span className="text-xs text-stone-400 uppercase tracking-wider block font-medium">Official Price</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-white tabular-nums">रु. 499</span>
                  <span className="text-xs text-stone-400 line-through">रु. 699</span>
                </div>
              </div>

              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-emerald-900/40 border border-emerald-700/50 text-xs text-emerald-200">
                <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <p className="font-semibold text-white">Free Delivery</p>
                  <p className="text-[11px] text-emerald-300">Across All 7 Provinces of Nepal</p>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={onExploreFlagship}
                className="px-7 py-4 bg-white text-stone-950 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-stone-100 transition-all shadow-xl flex items-center gap-2 group cursor-pointer"
              >
                <span>Select Colour & Order (NPR 499)</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onExploreCollection}
                className="px-6 py-4 border border-stone-600 hover:border-stone-400 text-stone-200 text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-stone-900/60 transition-colors cursor-pointer"
              >
                Explore Details
              </button>
            </div>

            {/* Three Colour Quick Badges */}
            <div className="pt-4 flex items-center gap-3">
              <span className="text-xs text-stone-400 font-medium">Available in 3 Editions:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSelectColor ? onSelectColor('Blue') : onExploreFlagship()}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-900/90 border border-sky-500/40 text-xs text-sky-200 hover:scale-105 transition-transform"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                  <span>Blue (10 pcs)</span>
                </button>
                <button
                  onClick={() => onSelectColor ? onSelectColor('White') : onExploreFlagship()}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-900/90 border border-stone-400/40 text-xs text-stone-200 hover:scale-105 transition-transform"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-stone-100" />
                  <span>White (10 pcs)</span>
                </button>
                <button
                  onClick={() => onSelectColor ? onSelectColor('Orange') : onExploreFlagship()}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-900/90 border border-amber-500/40 text-xs text-amber-200 hover:scale-105 transition-transform"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>Orange (10 pcs)</span>
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-stone-800/80 text-xs text-stone-400">
              <div className="flex items-center gap-2">
                <Banknote className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Cash on Delivery (COD)</span>
              </div>
              <div className="flex items-center gap-2">
                <img src="/src/assets/images/clevara_cleaner_blue_1794193742888.jpg" alt="" className="w-4 h-4 rounded-full object-cover shrink-0" />
                <span>eSewa Verified Pay</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% Genuine CLEVARA</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Studio Trio Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-stone-900 border border-stone-800 shadow-2xl group">
              <img
                src="/src/assets/images/clevara_cleaner_blue_1794193742888.jpg"
                alt="CLEVARA Multifunctional Spray Squeegee Window Cleaner"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent opacity-80" />

              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-stone-950/80 backdrop-blur-md border border-stone-800 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white uppercase tracking-wider">3-in-1 Glass Innovation</span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-900/60 text-emerald-300 font-semibold text-[10px]">
                    NPR 499 · Free Delivery
                  </span>
                </div>
                <p className="text-[11px] text-stone-400 font-light leading-normal">
                  Spray atomizing mist · High-density microfiber scrub · Streak-free silicone blade.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
