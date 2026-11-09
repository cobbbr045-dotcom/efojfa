import React from 'react';
import { useCart } from '../../context/CartContext';
import { formatNPR } from '../../utils/pricing';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Truck } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    items,
    removeFromCart,
    updateQuantity,
    subtotal,
    isCartOpen,
    setIsCartOpen,
    setIsCheckoutOpen,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-stone-200 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-stone-900" />
              <h2 className="text-lg font-serif font-bold text-stone-900">
                Your Selection
              </h2>
              <span className="text-xs text-stone-500 tabular-nums">
                ({items.reduce((s, i) => s + i.quantity, 0)} items)
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-stone-400 hover:text-stone-900 rounded-full hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Complimentary Nepal Delivery Banner */}
          <div className="px-6 py-3 bg-emerald-50 border-b border-emerald-100 text-xs flex items-center gap-2 text-emerald-900">
            <Truck className="w-4 h-4 text-emerald-700 shrink-0" />
            <p className="font-medium">
              Free Delivery Included across all 7 Provinces of Nepal.
            </p>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <ShoppingBag className="w-10 h-10 text-stone-300 mx-auto" />
                <p className="text-sm font-medium text-stone-700">Your shopping bag is empty</p>
                <p className="text-xs text-stone-400">
                  Select your preferred color for the CLEVARA Spray Squeegee Window Cleaner.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-4 px-4 py-2 bg-stone-900 text-white text-xs font-semibold rounded-lg hover:bg-stone-800"
                >
                  Explore Colours
                </button>
              </div>
            ) : (
              items.map(({ product, variant, quantity }) => {
                const unitPrice = product.discountedPrice || product.price;
                const itemTotal = unitPrice * quantity;
                const image = variant?.image || product.images[0] || '/src/assets/images/clevara_cleaner_blue_1794193742888.jpg';
                const maxStock = variant ? variant.stock : product.stock;

                return (
                  <div
                    key={`${product.id}-${variant?.id || 'def'}`}
                    className="flex gap-4 p-3 bg-stone-50 border border-stone-200/80 rounded-xl"
                  >
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-white shrink-0 border border-stone-200">
                      <img
                        src={image}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      {variant && (
                        <div
                          className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs"
                          style={{ backgroundColor: variant.hexColor }}
                        />
                      )}
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          {variant && (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-stone-200/80 text-stone-800 mb-1">
                              <span
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: variant.hexColor }}
                              />
                              Colour: {variant.color}
                            </span>
                          )}
                          <h4 className="text-xs font-semibold text-stone-900 line-clamp-1">
                            {product.name}
                          </h4>
                          <p className="text-xs font-bold text-stone-950 tabular-nums mt-0.5">
                            {formatNPR(unitPrice)}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(product.id, variant?.id)}
                          className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-200/60">
                        <div className="flex items-center border border-stone-200 rounded-md bg-white">
                          <button
                            onClick={() => updateQuantity(product.id, quantity - 1, variant?.id)}
                            className="p-1 text-stone-500 hover:text-stone-900"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-semibold text-stone-800 tabular-nums">
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(product.id, quantity + 1, variant?.id)}
                            disabled={quantity >= maxStock}
                            className="p-1 text-stone-500 hover:text-stone-900 disabled:opacity-30"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="text-xs font-semibold text-stone-900 tabular-nums">
                          {formatNPR(itemTotal)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout Action */}
          {items.length > 0 && (
            <div className="p-6 border-t border-stone-200 bg-stone-50 space-y-4">
              <div className="flex justify-between items-center text-sm font-semibold">
                <span className="text-stone-600">Subtotal</span>
                <span className="text-stone-950 tabular-nums text-base">{formatNPR(subtotal)}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-emerald-700">
                <span>Nepal Delivery</span>
                <span className="font-semibold uppercase tracking-wider">Free (रु. 0)</span>
              </div>
              <p className="text-[11px] text-stone-500 leading-tight">
                Cash on Delivery (COD) and eSewa supported. 100% genuine CLEVARA satisfaction guarantee.
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckoutOpen(true);
                }}
                className="w-full py-3.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
