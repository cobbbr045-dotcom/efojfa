import React, { useState } from 'react';
import { Product, Specification } from '../../types';
import { X, Plus, Trash2, Image, Layers, Sparkles } from 'lucide-react';

interface ProductFormModalProps {
  isOpen: boolean;
  product?: Product | null;
  onClose: () => void;
  onSave: (productData: any) => Promise<void>;
}

const CATEGORIES = [
  'Surface & Glass Care',
  'Body Cleaner',
  'Stone & Wood Care',
  'Accessories',
  'Kitchen & Tableware',
];

const PRESET_IMAGES = [
  { label: 'CLEVARA Blue Variant', url: '/src/assets/images/clevara_cleaner_blue_1794193742888.jpg' },
  { label: 'CLEVARA White Variant', url: '/src/assets/images/clevara_cleaner_white_1794193756650.jpg' },
  { label: 'CLEVARA Orange Variant', url: '/src/assets/images/clevara_cleaner_orange_1794193770204.jpg' },
  { label: 'CLEVARA Lifestyle Space', url: '/src/assets/images/hero_clevara_lifestyle_1794115562217.jpg' },
];

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  product,
  onClose,
  onSave,
}) => {
  const isEditing = Boolean(product);

  const [name, setName] = useState(product?.name || '');
  const [description, setDescription] = useState(product?.description || '');
  const [category, setCategory] = useState(product?.category || CATEGORIES[0]);
  const [sku, setSku] = useState(product?.sku || `CLV-${Math.floor(1000 + Math.random() * 9000)}`);
  const [price, setPrice] = useState<number | string>(product?.price ?? 499);
  const [discountedPrice, setDiscountedPrice] = useState<number | string>(product?.discountedPrice ?? '');
  const [stock, setStock] = useState<number | string>(product?.stock ?? 25);
  const [lowStockThreshold, setLowStockThreshold] = useState<number | string>(product?.lowStockThreshold ?? 5);
  const [status, setStatus] = useState<string>(product?.status || 'published');
  const [isFeatured, setIsFeatured] = useState<boolean>(product?.isFeatured ?? false);
  const [isBestseller, setIsBestseller] = useState<boolean>(product?.isBestseller ?? false);

  // Images
  const [images, setImages] = useState<string[]>(
    product?.images?.length ? product.images : [PRESET_IMAGES[0].url]
  );
  const [newImageUrl, setNewImageUrl] = useState('');

  // Restocking
  const [restockStatus, setRestockStatus] = useState<string>(product?.restockStatus || 'available');
  const [expectedRestockDate, setExpectedRestockDate] = useState<string>(product?.expectedRestockDate || '');
  const [incomingStock, setIncomingStock] = useState<number | string>(product?.incomingStock ?? '');
  const [restockAnnouncement, setRestockAnnouncement] = useState<string>(product?.restockAnnouncement || '');

  // Specifications
  const [specifications, setSpecifications] = useState<Specification[]>(
    product?.specifications || [
      { key: 'Volume', value: '500 ml' },
      { key: 'Origin', value: 'Handcrafted in Nepal' },
    ]
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleAddSpec = () => {
    setSpecifications([...specifications, { key: '', value: '' }]);
  };

  const handleRemoveSpec = (idx: number) => {
    setSpecifications(specifications.filter((_, i) => i !== idx));
  };

  const handleSpecChange = (idx: number, field: 'key' | 'value', val: string) => {
    const updated = [...specifications];
    updated[idx][field] = val;
    setSpecifications(updated);
  };

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setImages([...images, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (idx: number) => {
    setImages(images.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Product name is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        description: description.trim(),
        category,
        sku: sku.trim(),
        price: Number(price),
        discountedPrice: discountedPrice !== '' ? Number(discountedPrice) : undefined,
        stock: Number(stock),
        lowStockThreshold: Number(lowStockThreshold),
        status,
        isFeatured,
        isBestseller,
        images: images.length > 0 ? images : [PRESET_IMAGES[0].url],
        specifications: specifications.filter((s) => s.key.trim() && s.value.trim()),
        restockStatus,
        expectedRestockDate: expectedRestockDate || undefined,
        incomingStock: incomingStock !== '' ? Number(incomingStock) : undefined,
        restockAnnouncement: restockAnnouncement.trim() || undefined,
      };

      await onSave(payload);
      onClose();
    } catch (err: any) {
      alert(err.message || 'Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in text-stone-900">
      <div
        className="relative bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <h2 className="text-xl font-serif font-bold text-stone-900">
              {isEditing ? `Edit Product — ${product?.name}` : 'Add New CLEVARA Product'}
            </h2>
            <p className="text-xs text-stone-500 font-light mt-0.5">
              All prices entered in Nepalese Rupees (रु. NPR). Synchronizes immediately with storefront.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-900 rounded-full hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-xs">
          {/* Basic Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500 border-b pb-1">
              General Information
            </h3>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">Product Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. CLEVARA Spray Window Cleaner"
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-stone-500"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed luxury formula description and surface directions..."
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-stone-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-stone-500"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Product SKU</label>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="CLV-WIN-500"
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-stone-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500 border-b pb-1">
              Pricing (रु. NPR) & Inventory
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  Regular Price in NPR (रु.) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-stone-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  Discounted Price in NPR (रु.) <span className="text-stone-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 1350"
                  value={discountedPrice}
                  onChange={(e) => setDiscountedPrice(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-stone-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  Available Stock Quantity *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-stone-500 font-semibold"
                />
                <p className="mt-1 text-[10px] text-stone-400">
                  Stock labels automatically calculate based on actual units.
                </p>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  Low-Stock Threshold
                </label>
                <input
                  type="number"
                  min="1"
                  value={lowStockThreshold}
                  onChange={(e) => setLowStockThreshold(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-stone-500"
                />
              </div>
            </div>
          </div>

          {/* Product Status & Flags */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500 border-b pb-1">
              Storefront Visibility & Toggles
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">Product Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-stone-500"
                >
                  <option value="published">Published (Visible in Store)</option>
                  <option value="unpublished">Unpublished (Draft)</option>
                  <option value="hidden">Hidden</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="featured-toggle"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded border-stone-300 text-stone-900 focus:ring-stone-500 w-4 h-4"
                />
                <label htmlFor="featured-toggle" className="text-stone-700 font-medium">
                  Featured Product
                </label>
              </div>

              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="bestseller-toggle"
                  checked={isBestseller}
                  onChange={(e) => setIsBestseller(e.target.checked)}
                  className="rounded border-stone-300 text-stone-900 focus:ring-stone-500 w-4 h-4"
                />
                <label htmlFor="bestseller-toggle" className="text-stone-700 font-medium">
                  Bestseller Tag
                </label>
              </div>
            </div>
          </div>

          {/* Restocking & Coming Soon Controls */}
          <div className="space-y-4 bg-amber-50/50 p-4 rounded-xl border border-amber-200/60">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-900 border-b border-amber-200 pb-1">
              Restocking & Pre-Release Configuration
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-amber-900 font-semibold mb-1">Restock Status</label>
                <select
                  value={restockStatus}
                  onChange={(e) => setRestockStatus(e.target.value)}
                  className="w-full bg-white border border-amber-200 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none"
                >
                  <option value="available">Available</option>
                  <option value="restocking_soon">Restocking Soon</option>
                  <option value="coming_soon">Coming Soon</option>
                </select>
              </div>

              <div>
                <label className="block text-amber-900 font-semibold mb-1">Expected Date</label>
                <input
                  type="date"
                  value={expectedRestockDate}
                  onChange={(e) => setExpectedRestockDate(e.target.value)}
                  className="w-full bg-white border border-amber-200 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-amber-900 font-semibold mb-1">Incoming Units</label>
                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 50"
                  value={incomingStock}
                  onChange={(e) => setIncomingStock(e.target.value)}
                  className="w-full bg-white border border-amber-200 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-amber-900 font-semibold mb-1">Restock Announcement Note</label>
              <input
                type="text"
                placeholder="e.g. Next production batch arriving in Kathmandu on Nov 20."
                value={restockAnnouncement}
                onChange={(e) => setRestockAnnouncement(e.target.value)}
                className="w-full bg-white border border-amber-200 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none"
              />
            </div>
          </div>

          {/* Product Images */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500 border-b pb-1">
              Product Images
            </h3>

            {/* Presets picker */}
            <div>
              <span className="text-stone-500 block mb-1.5">Select from Studio Assets:</span>
              <div className="flex flex-wrap gap-2">
                {PRESET_IMAGES.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      if (!images.includes(preset.url)) {
                        setImages([...images, preset.url]);
                      }
                    }}
                    className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-md text-[11px] border border-stone-200"
                  >
                    + {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Active image list */}
            <div className="flex flex-wrap gap-3 pt-2">
              {images.map((imgUrl, idx) => (
                <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-stone-200 group">
                  <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-full opacity-80 hover:opacity-100"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Custom image input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add custom image URL (e.g. /src/assets/images/...)"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="flex-1 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800"
              >
                Add Image
              </button>
            </div>
          </div>

          {/* Specifications */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-1">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                Product Specifications
              </h3>
              <button
                type="button"
                onClick={handleAddSpec}
                className="text-stone-700 hover:text-stone-950 font-semibold flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>Add Specification</span>
              </button>
            </div>

            <div className="space-y-2">
              {specifications.map((spec, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Key (e.g. Volume)"
                    value={spec.key}
                    onChange={(e) => handleSpecChange(idx, 'key', e.target.value)}
                    className="w-1/3 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Value (e.g. 500 ml / 16.9 fl oz)"
                    value={spec.value}
                    onChange={(e) => handleSpecChange(idx, 'value', e.target.value)}
                    className="flex-1 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSpec(idx)}
                    className="p-2 text-stone-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-6 border-t border-stone-200 flex justify-end gap-3 sticky bottom-0 bg-white py-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg shadow-md cursor-pointer"
            >
              {isSubmitting ? 'Saving Product...' : isEditing ? 'Update Product' : 'Publish Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
