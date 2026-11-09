import React, { useState } from 'react';
import { Product } from '../../types';
import { ProductCard } from './ProductCard';
import { SlidersHorizontal, Sparkles, Package } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  sortOption: string;
  setSortOption: (sort: string) => void;
  onSelectProduct: (product: Product) => void;
  onOpenOwnerPortal: () => void;
}

const CATEGORIES = [
  'All',
  'Surface & Glass Care',
  'Body Cleaner',
  'Stone & Wood Care',
  'Accessories',
  'Kitchen & Tableware',
];

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  selectedCategory,
  setSelectedCategory,
  sortOption,
  setSortOption,
  onSelectProduct,
  onOpenOwnerPortal,
}) => {
  return (
    <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-stone-500 font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-stone-700" />
            <span>Curated Sanctuary Formulas</span>
          </div>
          <h2 className="mt-1 text-3xl font-serif font-bold text-stone-900">
            The Living Catalog
          </h2>
          <p className="mt-1 text-sm text-stone-500 font-light">
            Refined botanical solutions formulated for architecture, glass, and pure interiors.
          </p>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-3">
          <label htmlFor="sort-select" className="text-xs text-stone-500 font-medium">Sort by</label>
          <select
            id="sort-select"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="bg-white border border-stone-200 text-xs text-stone-800 rounded-lg px-3 py-2 focus:outline-none focus:border-stone-400"
          >
            <option value="newest">Newest Additions</option>
            <option value="popular">Bestsellers First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="py-6 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200/70 hover:text-stone-900'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Products Grid or Empty Storefront State */}
      {products.length === 0 ? (
        <div className="text-center py-20 px-4 bg-white border border-stone-200/80 rounded-2xl max-w-xl mx-auto my-8">
          <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-stone-400 mb-4">
            <Package className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-serif font-semibold text-stone-900">
            The CLEVARA Catalog is Currently Being Prepared
          </h3>
          <p className="mt-2 text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
            Our atelier is formulating the next seasonal curation of crystal glass cleansers and botanical concentrates.
          </p>
          <div className="mt-6">
            <button
              onClick={onOpenOwnerPortal}
              className="px-5 py-2.5 bg-stone-900 text-white text-xs font-semibold rounded-lg hover:bg-stone-800 transition-colors"
            >
              Access Owner Portal to Add Products
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 pt-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      )}
    </section>
  );
};
