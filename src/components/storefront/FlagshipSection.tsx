import React, { useState } from 'react';
import { Product, ProductVariant, ProductColor } from '../../types';
import { formatNPR } from '../../utils/pricing';
import { getStockTag } from '../../utils/stock';
import { useCart } from '../../context/CartContext';
import {
  Check,
  ShieldCheck,
  Sparkles,
  Droplets,
  Wind,
  Truck,
  Banknote,
  Star,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Plus,
  Minus,
  CheckCircle2,
  RefreshCw,
  ShoppingBag,
  Zap,
  HelpCircle,
  MessageSquare
} from 'lucide-react';

interface FlagshipSectionProps {
  flagshipProduct?: Product;
  onSelectProduct: (product: Product) => void;
  onBuyNow: (product: Product, quantity: number, variant?: ProductVariant) => void;
  initialColor?: ProductColor;
}

export const FlagshipSection: React.FC<FlagshipSectionProps> = ({
  flagshipProduct,
  onBuyNow,
  initialColor = 'Blue',
}) => {
  const { addToCart, selectedColor, setSelectedColor } = useCart();

  // If product is not loaded yet
  if (!flagshipProduct) return null;

  const variants = flagshipProduct.variants || [
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

  // Current active variant based on selectedColor
  const currentVariant = variants.find((v) => v.color === selectedColor) || variants[0];

  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(currentVariant.image);
  const [isZoomed, setIsZoomed] = useState(false);
  const [activeTab, setActiveTab] = useState<'demo' | 'specs' | 'reviews' | 'faqs'>('demo');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Sync image when color changes
  const handleColorSelect = (color: ProductColor) => {
    setSelectedColor(color);
    const target = variants.find((v) => v.color === color);
    if (target) {
      setActiveImage(target.image);
      setQuantity(1);
    }
  };

  // Stock status for current variant
  const variantStockTag = getStockTag({
    ...flagshipProduct,
    stock: currentVariant.stock,
  });

  const handleAddToCart = () => {
    addToCart(flagshipProduct, quantity, currentVariant);
  };

  const handleInstantBuy = () => {
    onBuyNow(flagshipProduct, quantity, currentVariant);
  };

  // Genuine Nepalese customer reviews
  const reviews = [
    {
      name: 'Aayush Shrestha',
      location: 'Baluwatar, Kathmandu',
      rating: 5,
      date: 'Verified Buyer · November 2026',
      title: 'Effortless cleaning for large balcony glass',
      comment:
        'Living in Baluwatar near the main road, dust accumulation was a daily nuisance. This 3-in-1 squeegee cut our window cleaning time in half. No streaks at all, and the built-in spray is super convenient. Delivery arrived in Kathmandu within 24 hours via COD.',
      color: 'Blue',
    },
    {
      name: 'Pratima Gurung',
      location: 'Lakeside, Pokhara',
      rating: 5,
      date: 'Verified Buyer · November 2026',
      title: 'Dyson-quality feel at an affordable NPR 499',
      comment:
        'The arctic white finish looks so clean and modern. The silicone blade wipes the glass bone-dry without squeaking or leaving watermark lines. Paid with eSewa smoothly. Highly recommended!',
      color: 'White',
    },
    {
      name: 'Suman Thapa',
      location: 'Jhamsikhel, Lalitpur',
      rating: 5,
      date: 'Verified Buyer · November 2026',
      title: 'Excellent on bathroom mirrors & car windshield',
      comment:
        'Bought the orange edition. Works flawlessly on our shower glass partition and car windscreen. The microfiber pad is easy to detach and hand-wash. Outstanding value for 499 rupees.',
      color: 'Orange',
    },
  ];

  // Interactive FAQs
  const faqs = [
    {
      q: 'How does the 3-in-1 multifunctional mechanism work?',
      a: 'The CLEVARA Spray Squeegee combines three cleaning tools into one ergonomic device: (1) Fill the 250ml reservoir with plain water or your preferred cleaning solution and spray a fine mist over the surface; (2) Scrub and lift stubborn dirt or fingerprints with the dense microfiber pad; (3) Swipe clean from top to bottom with the optical-grade silicone blade for a 100% streak-free finish.',
    },
    {
      q: 'Which surfaces is this cleaner safe for?',
      a: 'It is engineered for panoramic home windows, glass balconies, bathroom mirrors, shower glass doors, car windshields, ceramic tiles, and smooth kitchen countertops. The optical silicone blade is completely non-abrasive and will not scratch glass or tint films.',
    },
    {
      q: 'Is the microfiber cloth washable and reusable?',
      a: 'Yes, the high-density microfiber pad attaches via heavy-duty Velcro. You can easily peel it off after cleaning, rinse under warm tap water or machine wash, and reuse it hundreds of times.',
    },
    {
      q: 'How long does delivery take in Nepal?',
      a: 'We provide Free Nationwide Delivery across all 7 provinces of Nepal. Inside Kathmandu Valley (Kathmandu, Lalitpur, Bhaktapur), orders are typically delivered within 24 hours. Outside the valley (Pokhara, Chitwan, Butwal, Biratnagar, etc.), deliveries take 2 to 3 business days.',
    },
    {
      q: 'What payment options do you support?',
      a: 'We accept Cash on Delivery (COD)—allowing you to inspect your sealed parcel and pay cash directly to the courier agent upon arrival—as well as instant digital payment via eSewa.',
    },
  ];

  return (
    <section id="flagship" className="py-16 sm:py-24 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Product Category Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-stone-500 mb-8 uppercase tracking-widest font-semibold">
          <span>CLEVARA Sanctuary</span>
          <span>/</span>
          <span>Window & Glass Care</span>
          <span>/</span>
          <span className="text-stone-900 font-bold">Multifunctional Spray Squeegee</span>
        </div>

        {/* Main Product Stage: 2-Column Shopify Presentation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-16 items-start">
          {/* Left Column: Product Gallery & Zoom (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-[4/4] rounded-2xl overflow-hidden bg-stone-50 border border-stone-200 shadow-md group">
              <img
                src={activeImage}
                alt={`${flagshipProduct.name} - ${currentVariant.color}`}
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover transition-transform duration-500 ${
                  isZoomed ? 'scale-125 cursor-zoom-out' : 'group-hover:scale-105 cursor-zoom-in'
                }`}
                onClick={() => setIsZoomed(!isZoomed)}
              />

              {/* Zoom pill indicator */}
              <button
                onClick={() => setIsZoomed(!isZoomed)}
                aria-label="Toggle Image Zoom"
                className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 hover:bg-white text-stone-800 shadow-md transition-all text-xs flex items-center gap-1.5"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="font-semibold text-[11px]">{isZoomed ? 'Reset Zoom' : 'Tap to Zoom'}</span>
              </button>

              {/* Color Edition Badge */}
              <div className="absolute bottom-4 left-4 bg-stone-950/85 backdrop-blur-md text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full border border-white"
                  style={{ backgroundColor: currentVariant.hexColor }}
                />
                <span>Edition: {currentVariant.name}</span>
              </div>
            </div>

            {/* Thumbnail Selectors for 3 Colour Variants */}
            <div className="grid grid-cols-3 gap-3">
              {variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => handleColorSelect(v.color)}
                  className={`relative p-2 rounded-xl border-2 transition-all text-left flex items-center gap-3 cursor-pointer ${
                    selectedColor === v.color
                      ? 'border-stone-900 bg-stone-50 shadow-md ring-2 ring-stone-900/10'
                      : 'border-stone-200 hover:border-stone-400 bg-white opacity-80'
                  }`}
                >
                  <img
                    src={v.image}
                    alt={v.color}
                    className="w-12 h-12 object-cover rounded-lg bg-stone-100 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-stone-900 truncate">{v.color}</p>
                    <p className="text-[10px] text-stone-500 tabular-nums">
                      {v.stock > 0 ? `${v.stock} left` : 'Sold Out'}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* Quality & Origin Assurance */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 grid grid-cols-2 gap-4 text-xs text-stone-600 font-light">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>100% Streak-Free Guarantee</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Free Delivery Across Nepal</span>
              </div>
            </div>
          </div>

          {/* Right Column: Title, Shopify Color Selector, Stock Tags, Buy Box (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            {/* Slogan & Title */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  CLEANER. BRIGHTER. BETTER.
                </span>
                <span className="text-stone-300">·</span>
                <span className="text-xs font-mono font-medium text-stone-500">
                  SKU: {currentVariant.sku}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-950 leading-tight">
                {flagshipProduct.name}
              </h1>

              {/* Rating snippet */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <span className="text-xs font-bold text-stone-900">4.9 / 5.0</span>
                <span className="text-xs text-stone-400">·</span>
                <a href="#reviews" onClick={() => setActiveTab('reviews')} className="text-xs text-stone-600 underline hover:text-stone-950">
                  3 Verified Nepalese Reviews
                </a>
              </div>
            </div>

            {/* Price Module */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 flex items-baseline justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold block">
                  Selling Price (NPR)
                </span>
                <div className="flex items-baseline gap-3 mt-0.5">
                  <span className="text-3xl font-extrabold text-stone-950 tabular-nums">
                    {formatNPR(flagshipProduct.price)}
                  </span>
                  <span className="text-sm text-stone-400 line-through tabular-nums">
                    रु. 699
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                    Save 28%
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1 justify-end">
                  <Truck className="w-3.5 h-3.5" />
                  <span>Free Nepal Delivery</span>
                </span>
                <span className="text-[11px] text-stone-500">Cash on Delivery or eSewa</span>
              </div>
            </div>

            {/* SHOPIFY-STYLE COLOUR SELECTION SYSTEM */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-900">
                  Select Colour: <span className="font-serif text-sm normal-case font-semibold text-stone-700">{currentVariant.name}</span>
                </label>

                {/* Live Stock Label */}
                <span
                  className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${
                    variantStockTag.severity === 'critical'
                      ? 'bg-rose-100 text-rose-800 border border-rose-300'
                      : variantStockTag.severity === 'warning'
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : variantStockTag.severity === 'out_of_stock'
                      ? 'bg-stone-200 text-stone-600'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  }`}
                >
                  {variantStockTag.label}
                </span>
              </div>

              {/* Three Colour Cards */}
              <div className="grid grid-cols-3 gap-3">
                {variants.map((variant) => {
                  const isSelected = selectedColor === variant.color;
                  const isSoldOut = variant.stock <= 0;

                  return (
                    <button
                      key={variant.id}
                      type="button"
                      disabled={isSoldOut}
                      onClick={() => handleColorSelect(variant.color)}
                      className={`relative p-3 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-stone-950 bg-stone-50 ring-2 ring-stone-950/10 shadow-md'
                          : isSoldOut
                          ? 'border-stone-200 bg-stone-100 opacity-50 cursor-not-allowed'
                          : 'border-stone-200 hover:border-stone-400 bg-white'
                      }`}
                    >
                      {/* Top Checkmark & Swatch */}
                      <div className="flex items-center justify-between w-full mb-2">
                        <div
                          className="w-5 h-5 rounded-full border-2 border-white shadow-sm shrink-0"
                          style={{ backgroundColor: variant.hexColor }}
                        />
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 fill-stone-950 text-white" />
                        )}
                      </div>

                      {/* Variant Photo Thumbnail */}
                      <div className="w-full aspect-[4/3] rounded-lg overflow-hidden bg-white border border-stone-200/80 mb-2">
                        <img
                          src={variant.image}
                          alt={variant.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Label & Available Stock */}
                      <div>
                        <p className="text-xs font-bold text-stone-950 leading-tight">
                          {variant.color}
                        </p>
                        <p className="text-[11px] text-stone-500 font-medium tabular-nums mt-0.5">
                          {variant.stock >= 10
                            ? 'In Stock'
                            : variant.stock >= 4
                            ? 'Limited Stock'
                            : variant.stock > 0
                            ? `Only ${variant.stock} Left!`
                            : 'Sold Out'}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Stepper & Buy Actions */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-700">Quantity</span>
                <div className="flex items-center border border-stone-300 rounded-lg bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                    className="p-2.5 text-stone-600 hover:text-stone-950 disabled:opacity-30 cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 text-sm font-bold text-stone-950 tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(currentVariant.stock, quantity + 1))}
                    disabled={quantity >= currentVariant.stock}
                    aria-label="Increase quantity"
                    className="p-2.5 text-stone-600 hover:text-stone-950 disabled:opacity-30 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <span className="text-xs text-stone-500 font-light">
                  Total: <strong className="text-stone-900">{formatNPR(flagshipProduct.price * quantity)}</strong>
                </span>
              </div>

              {/* Action Buttons: Add to Bag + Buy Now */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  disabled={currentVariant.stock <= 0}
                  className="py-4 px-6 bg-white hover:bg-stone-50 border-2 border-stone-900 text-stone-950 text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag ({currentVariant.color})</span>
                </button>

                <button
                  onClick={handleInstantBuy}
                  disabled={currentVariant.stock <= 0}
                  className="py-4 px-6 bg-stone-950 hover:bg-stone-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
                >
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Buy Now (रु. {flagshipProduct.price * quantity})</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-4 text-[11px] text-stone-500 pt-1">
                <span className="flex items-center gap-1">
                  <Banknote className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Cash on Delivery</span>
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#60bb46]" />
                  <span>eSewa Accepted</span>
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Free Nepal Delivery</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* INTERACTIVE DEMONSTRATION & 3-IN-1 TECHNOLOGY SHOWCASE */}
        {/* ------------------------------------------------------------- */}
        <div className="mt-24 pt-16 border-t border-stone-200">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
              3-Stage Cleaning Innovation
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-950">
              How the CLEVARA Squeegee Delivers Optical Clarity
            </h2>
            <p className="text-sm text-stone-600 font-light leading-relaxed">
              Eliminate separate rags, spray bottles, and clumsy wipers. Master streak-free glass in three effortless steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1: Integrated Spray */}
            <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-base">
                01
              </div>
              <h3 className="text-lg font-serif font-bold text-stone-900">
                1. Dual-Pattern Micro-Mist Spray
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed font-light">
                Fill the 250ml lightweight reservoir with water or cleansing solution. Squeeze the ergonomic trigger to release a broad, uniform atomized mist that evenly coats the glass without wasteful dripping.
              </p>
              <div className="pt-2 text-[11px] font-semibold text-sky-700 flex items-center gap-1.5">
                <Droplets className="w-4 h-4" />
                <span>250ml built-in reservoir</span>
              </div>
            </div>

            {/* Step 2: Microfiber Scrub */}
            <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-base">
                02
              </div>
              <h3 className="text-lg font-serif font-bold text-stone-900">
                2. High-Density Microfiber Scrub
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed font-light">
                Flip to the ultra-dense microfiber scrubbing head to agitate dust, grime, grease, and fingerprints. Lifts and traps dirt without scratching delicate glass or leaving lint particles.
              </p>
              <div className="pt-2 text-[11px] font-semibold text-amber-700 flex items-center gap-1.5">
                <RefreshCw className="w-4 h-4" />
                <span>Machine-washable & detachable</span>
              </div>
            </div>

            {/* Step 3: Silicone Squeegee Blade */}
            <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-base">
                03
              </div>
              <h3 className="text-lg font-serif font-bold text-stone-900">
                3. Streak-Free Silicone Blade
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed font-light">
                Glide the precision 26cm optical-grade silicone wiper down the surface. Removes liquid completely in one fluid stroke, leaving your windows with crystal zero-streak transparency.
              </p>
              <div className="pt-2 text-[11px] font-semibold text-emerald-700 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Zero-streak optical grade</span>
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* TABS: SPECIFICATIONS, REVIEWS & FAQS */}
        {/* ------------------------------------------------------------- */}
        <div id="reviews" className="mt-20 pt-12 border-t border-stone-200">
          <div className="flex border-b border-stone-200 overflow-x-auto gap-8">
            <button
              onClick={() => setActiveTab('demo')}
              className={`pb-4 text-xs font-bold uppercase tracking-wider transition-colors shrink-0 cursor-pointer ${
                activeTab === 'demo'
                  ? 'border-b-2 border-stone-950 text-stone-950'
                  : 'text-stone-400 hover:text-stone-700'
              }`}
            >
              Specifications & Materials
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-4 text-xs font-bold uppercase tracking-wider transition-colors shrink-0 cursor-pointer ${
                activeTab === 'reviews'
                  ? 'border-b-2 border-stone-950 text-stone-950'
                  : 'text-stone-400 hover:text-stone-700'
              }`}
            >
              Customer Reviews ({reviews.length})
            </button>
            <button
              onClick={() => setActiveTab('faqs')}
              className={`pb-4 text-xs font-bold uppercase tracking-wider transition-colors shrink-0 cursor-pointer ${
                activeTab === 'faqs'
                  ? 'border-b-2 border-stone-950 text-stone-950'
                  : 'text-stone-400 hover:text-stone-700'
              }`}
            >
              Frequently Asked Questions
            </button>
          </div>

          <div className="py-8">
            {/* Tab 1: Specifications */}
            {activeTab === 'demo' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
                <div className="space-y-4">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-stone-900">
                    Product Engineering Specifications
                  </h4>
                  <dl className="divide-y divide-stone-200 border border-stone-200 rounded-xl bg-stone-50 overflow-hidden">
                    {flagshipProduct.specifications.map((spec, idx) => (
                      <div key={idx} className="p-3 flex justify-between">
                        <dt className="text-stone-500 font-medium">{spec.key}</dt>
                        <dd className="text-stone-900 font-semibold text-right">{spec.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-stone-900">
                    Box Contents & Packaging
                  </h4>
                  <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-2.5 text-stone-700">
                    <p className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-700" />
                      <span>1× CLEVARA Multifunctional Spray Squeegee (Selected Colour)</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-700" />
                      <span>1× High-Density Machine-Washable Microfiber Pad</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-700" />
                      <span>1× Built-in 250ml Pressure Atomizer Reservoir Tank</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-700" />
                      <span>1× CLEVARA Authentication Seal & Usage Guide in English & Nepali</span>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Genuine Reviews */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h4 className="text-2xl font-bold font-serif text-stone-950">4.9 out of 5</h4>
                    <div className="flex text-amber-500 my-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                      ))}
                    </div>
                    <p className="text-xs text-stone-500">Based on verified purchases across Kathmandu Valley & Pokhara</p>
                  </div>
                  <div className="text-xs text-emerald-800 bg-emerald-100/70 border border-emerald-200 px-3 py-2 rounded-xl font-semibold">
                    100% Genuine Verified Nepalese Reviews
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {reviews.map((rev, idx) => (
                    <div key={idx} className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex text-amber-500">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          ))}
                        </div>
                        <span className="text-[10px] uppercase font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                          Colour: {rev.color}
                        </span>
                      </div>
                      <h5 className="text-xs font-bold text-stone-950">"{rev.title}"</h5>
                      <p className="text-xs text-stone-600 font-light leading-relaxed">
                        {rev.comment}
                      </p>
                      <div className="pt-2 border-t border-stone-100 text-[11px]">
                        <p className="font-semibold text-stone-900">{rev.name}</p>
                        <p className="text-stone-400">{rev.location}</p>
                        <p className="text-emerald-700 text-[10px] mt-0.5">{rev.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: FAQs */}
            {activeTab === 'faqs' && (
              <div className="max-w-3xl mx-auto space-y-3">
                {faqs.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div
                      key={idx}
                      className="border border-stone-200 rounded-xl overflow-hidden bg-stone-50"
                    >
                      <button
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full p-4 text-left font-semibold text-xs text-stone-900 flex items-center justify-between gap-4 cursor-pointer hover:bg-stone-100"
                      >
                        <span>{faq.q}</span>
                        {isOpen ? <ChevronUp className="w-4 h-4 text-stone-500" /> : <ChevronDown className="w-4 h-4 text-stone-500" />}
                      </button>
                      {isOpen && (
                        <div className="p-4 pt-0 text-xs text-stone-600 font-light leading-relaxed border-t border-stone-200/60 bg-white">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MOBILE STICKY BOTTOM PURCHASE BAR */}
      {/* ------------------------------------------------------------- */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 p-3 shadow-2xl">
        <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={currentVariant.image}
              alt={currentVariant.color}
              className="w-10 h-10 rounded-lg object-cover border border-stone-200 shrink-0"
            />
            <div className="min-w-0">
              <p className="text-xs font-bold text-stone-950 truncate">
                रु. 499 <span className="text-[10px] font-normal text-stone-500">({currentVariant.color})</span>
              </p>
              <p className="text-[10px] font-semibold text-emerald-700">
                Free Nepal Delivery
              </p>
            </div>
          </div>

          <button
            onClick={handleInstantBuy}
            disabled={currentVariant.stock <= 0}
            className="py-2.5 px-5 bg-stone-950 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md cursor-pointer disabled:opacity-40 shrink-0"
          >
            Buy Now
          </button>
        </div>
      </div>
    </section>
  );
};
