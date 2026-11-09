import React, { useState } from 'react';
import { Product, ProductVariant, ProductColor } from '../../types';
import { formatNPR } from '../../utils/pricing';
import { getStockTag } from '../../utils/stock';
import { useCart } from '../../context/CartContext';
import { api } from '../../services/api';
import { X, Check, Bell, Shield, Truck, Sparkles, Plus, Minus, CheckCircle2 } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onBuyNow: (product: Product, quantity: number, variant?: ProductVariant) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onBuyNow,
}) => {
  const { addToCart, selectedColor, setSelectedColor } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [subscribeContact, setSubscribeContact] = useState('');
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);

  if (!product) return null;

  const variants = product.variants || [];
  const currentVariant = variants.find((v) => v.color === selectedColor) || variants[0];
  const activeImage = currentVariant ? currentVariant.image : (product.images[0] || '/src/assets/images/clevara_cleaner_blue_1794193742888.jpg');

  const currentStock = currentVariant ? currentVariant.stock : product.stock;
  const stockInfo = getStockTag({
    ...product,
    stock: currentStock,
  });

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscribeContact) return;
    setIsSubscribing(true);
    try {
      await api.subscribeRestock(product.id, subscribeContact);
      setSubscribeSuccess(true);
    } catch (err: any) {
      alert(err.message || 'Subscription failed');
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-fade-in">
      <div
        className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close product details"
          className="absolute top-4 right-4 z-10 p-2 text-stone-400 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Gallery & Image Display */}
          <div className="p-6 sm:p-8 bg-stone-50 border-b md:border-b-0 md:border-r border-stone-200 flex flex-col justify-between">
            <div className="aspect-[4/3] rounded-xl overflow-hidden bg-stone-100 border border-stone-200/80 shadow-inner">
              <img
                src={activeImage}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Variant selector thumbnails */}
            {variants.length > 1 && (
              <div className="grid grid-cols-3 gap-2 mt-4">
                {variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => {
                      setSelectedColor(v.color);
                      setQuantity(1);
                    }}
                    className={`p-1.5 rounded-lg border-2 transition-all text-left flex items-center gap-2 cursor-pointer ${
                      selectedColor === v.color
                        ? 'border-stone-950 bg-white shadow-sm'
                        : 'border-stone-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={v.image} alt={v.color} className="w-8 h-8 rounded object-cover" />
                    <span className="text-[11px] font-bold text-stone-900">{v.color}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Trust badges */}
            <div className="mt-6 pt-6 border-t border-stone-200 grid grid-cols-2 gap-4 text-xs text-stone-500 font-light">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-stone-700" />
                <span>100% Genuine CLEVARA</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-stone-700" />
                <span>Free Nepal Delivery</span>
              </div>
            </div>
          </div>

          {/* Right: Contiguous Purchase Module */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold tracking-wider text-stone-400 uppercase">
                  {product.category} · SKU: {currentVariant?.sku || product.sku}
                </span>

                <span
                  className={`px-2.5 py-0.5 text-xs rounded-md ${
                    stockInfo.severity === 'critical'
                      ? 'bg-rose-50 text-rose-700 font-semibold'
                      : stockInfo.severity === 'warning'
                      ? 'bg-amber-50 text-amber-800 font-medium'
                      : stockInfo.severity === 'out_of_stock'
                      ? 'bg-stone-100 text-stone-600'
                      : 'bg-emerald-50 text-emerald-800 font-medium'
                  }`}
                >
                  {stockInfo.label}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
                {product.name}
              </h2>

              {/* Price block */}
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-bold text-stone-950 tabular-nums">
                  {formatNPR(product.discountedPrice || product.price)}
                </span>
                {product.discountedPrice && product.discountedPrice < product.price && (
                  <span className="text-sm text-stone-400 line-through tabular-nums">
                    {formatNPR(product.price)}
                  </span>
                )}
                <span className="text-xs text-emerald-700 font-semibold">Free Nepal Delivery</span>
              </div>

              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
                {product.description}
              </p>

              {/* Colour variant pills */}
              {variants.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                    Edition / Colour
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {variants.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => {
                          setSelectedColor(v.color);
                          setQuantity(1);
                        }}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all ${
                          selectedColor === v.color
                            ? 'border-stone-900 bg-stone-900 text-white'
                            : 'border-stone-300 text-stone-700 hover:bg-stone-100'
                        }`}
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-white"
                          style={{ backgroundColor: v.hexColor }}
                        />
                        <span>{v.color}</span>
                        <span className="text-[10px] opacity-80">({v.stock} pcs)</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Specifications */}
              {product.specifications && product.specifications.length > 0 && (
                <div className="pt-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">
                    Key Specifications
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {product.specifications.slice(0, 4).map((spec, i) => (
                      <div key={i} className="p-2 bg-stone-50 rounded border border-stone-100">
                        <span className="text-stone-400 block text-[10px] uppercase font-semibold">{spec.key}</span>
                        <span className="text-stone-800 font-medium">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Purchase CTA Section */}
            <div className="pt-4 border-t border-stone-200 space-y-4">
              {currentStock > 0 ? (
                <>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-stone-500 font-medium">Quantity</span>
                    <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        disabled={quantity <= 1}
                        className="p-2 text-stone-600 hover:text-stone-900 disabled:opacity-40"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-4 text-xs font-semibold tabular-nums text-stone-900">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity((q) => Math.min(currentStock, q + 1))}
                        disabled={quantity >= currentStock}
                        className="p-2 text-stone-600 hover:text-stone-900 disabled:opacity-40"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-xs text-stone-400">
                      (Max {currentStock} available in {currentVariant?.color || 'stock'})
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        addToCart(product, quantity, currentVariant);
                        onClose();
                      }}
                      className="w-full py-3 bg-stone-100 hover:bg-stone-200 text-stone-900 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      Add to Bag
                    </button>
                    <button
                      onClick={() => {
                        onBuyNow(product, quantity, currentVariant);
                        onClose();
                      }}
                      className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg transition-colors shadow-md cursor-pointer"
                    >
                      Buy Now
                    </button>
                  </div>
                </>
              ) : (
                /* Notify Me When Available Form */
                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
                  <div className="flex items-center gap-2 text-xs font-semibold text-stone-800">
                    <Bell className="w-4 h-4 text-amber-600" />
                    <span>Notify Me When Restocked</span>
                  </div>
                  <p className="mt-1 text-xs text-stone-500">
                    Enter your mobile number or email to receive priority notification when stock arrives.
                  </p>

                  {subscribeSuccess ? (
                    <div className="mt-3 p-2 bg-emerald-50 text-emerald-800 text-xs rounded-md flex items-center gap-1.5 font-medium">
                      <Check className="w-4 h-4" />
                      <span>Thank you. You will be notified the moment stock is available.</span>
                    </div>
                  ) : (
                    <form onSubmit={handleSubscribe} className="mt-3 flex gap-2">
                      <input
                        type="text"
                        placeholder="Mobile (98...) or Email"
                        value={subscribeContact}
                        onChange={(e) => setSubscribeContact(e.target.value)}
                        required
                        className="flex-1 bg-white border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-400"
                      />
                      <button
                        type="submit"
                        disabled={isSubscribing}
                        className="px-4 py-2 bg-stone-900 text-white text-xs font-semibold rounded-lg hover:bg-stone-800 transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        {isSubscribing ? 'Submitting...' : 'Subscribe'}
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
