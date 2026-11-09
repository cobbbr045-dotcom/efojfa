import React from 'react';
import { Product, ProductColor } from '../../types';
import { formatNPR } from '../../utils/pricing';
import { getStockTag } from '../../utils/stock';
import { useCart } from '../../context/CartContext';
import { Plus, Bell, Truck } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { addToCart, selectedColor, setSelectedColor } = useCart();
  const stockInfo = getStockTag(product);

  const variants = product.variants || [];
  const currentVariant = variants.find(v => v.color === selectedColor) || variants[0];
  const primaryImage = currentVariant?.image || product.images[0] || '/src/assets/images/clevara_cleaner_blue_1794193742888.jpg';

  const getTagStyle = () => {
    switch (stockInfo.severity) {
      case 'critical':
        return 'text-rose-700 bg-rose-50 border border-rose-200/60 font-semibold';
      case 'warning':
        return 'text-amber-800 bg-amber-50 border border-amber-200/60 font-medium';
      case 'info':
        return 'text-sky-800 bg-sky-50 border border-sky-200/60 font-medium';
      case 'out_of_stock':
        return 'text-stone-600 bg-stone-100 border border-stone-200 font-medium';
      default:
        return 'text-emerald-800 bg-emerald-50 border border-emerald-200/60 font-semibold';
    }
  };

  return (
    <div
      onClick={() => onSelect(product)}
      className="group relative flex flex-col bg-white border border-stone-200/80 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
    >
      {/* Product Image Frame */}
      <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
        <img
          src={primaryImage}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
        />

        {/* Real-Time Stock Tag Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
          <span className={`px-2.5 py-1 text-[11px] rounded-md ${getTagStyle()}`}>
            {stockInfo.label}
          </span>
          {product.isBestseller && (
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-stone-900 text-stone-100 rounded-md">
              Flagship Edition
            </span>
          )}
        </div>

        {/* Free Delivery Tag */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] font-semibold text-emerald-800 border border-emerald-200 flex items-center gap-1">
          <Truck className="w-3 h-3" />
          <span>Free Delivery</span>
        </div>

        {/* Quick Add overlay button */}
        {stockInfo.isOrderable && (
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product, 1, currentVariant);
              }}
              aria-label={`Add ${product.name} to bag`}
              className="p-2.5 bg-stone-900 text-white rounded-lg hover:bg-stone-800 shadow-md transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Product Info Section */}
      <div className="p-5 flex flex-col flex-grow justify-between gap-3">
        <div>
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
              {product.category}
            </p>
            {/* Color Swatches */}
            {variants.length > 0 && (
              <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                {variants.map((v) => (
                  <button
                    key={v.id}
                    title={v.color}
                    onClick={() => setSelectedColor(v.color)}
                    className={`w-3.5 h-3.5 rounded-full border-2 transition-transform ${
                      selectedColor === v.color ? 'scale-125 border-stone-900 shadow-xs' : 'border-white opacity-80'
                    }`}
                    style={{ backgroundColor: v.hexColor }}
                  />
                ))}
              </div>
            )}
          </div>

          <h3 className="mt-1.5 text-base font-serif font-bold text-stone-900 group-hover:text-stone-700 transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="mt-1 text-xs text-stone-500 line-clamp-2 leading-relaxed font-light">
            {product.description}
          </p>
        </div>

        {/* Pricing & Order CTA */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-stone-950 tabular-nums">
              {formatNPR(product.discountedPrice || product.price)}
            </span>
            {product.discountedPrice && product.discountedPrice < product.price && (
              <span className="text-xs text-stone-400 line-through tabular-nums">
                {formatNPR(product.price)}
              </span>
            )}
          </div>

          <div>
            {stockInfo.isOrderable ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(product, 1, currentVariant);
                }}
                className="px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Add ({currentVariant?.color || 'Blue'})
              </button>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs text-stone-500 font-medium">
                <Bell className="w-3 h-3 text-stone-400" />
                Notify Me
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
