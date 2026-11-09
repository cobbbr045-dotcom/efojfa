import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, ProductVariant, ProductColor, CartItem } from '../types';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, variant?: ProductVariant) => void;
  removeFromCart: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  totalItemCount: number;
  subtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  selectedProductForModal: Product | null;
  setSelectedProductForModal: (product: Product | null) => void;
  selectedColor: ProductColor;
  setSelectedColor: (color: ProductColor) => void;
  placedOrderSuccess: any;
  setPlacedOrderSuccess: (order: any) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'clevara_cart_v2';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [selectedColor, setSelectedColor] = useState<ProductColor>('Blue');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  const [placedOrderSuccess, setPlacedOrderSuccess] = useState<any>(null);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Failed to save cart to localStorage', e);
    }
  }, [items]);

  const addToCart = (product: Product, quantity = 1, variant?: ProductVariant) => {
    const targetVariant = variant || (Array.isArray(product.variants) && product.variants.length > 0 ? product.variants[0] : undefined);
    const maxStock = targetVariant ? targetVariant.stock : product.stock;

    if (maxStock <= 0) {
      return;
    }

    setItems(prev => {
      const existingIndex = prev.findIndex(item => {
        if (targetVariant) {
          return item.product.id === product.id && item.variant?.id === targetVariant.id;
        }
        return item.product.id === product.id && !item.variant;
      });

      if (existingIndex > -1) {
        const existing = prev[existingIndex];
        const nextQty = Math.min(existing.quantity + quantity, maxStock);
        const updated = [...prev];
        updated[existingIndex] = { ...existing, quantity: nextQty };
        return updated;
      }

      return [...prev, { product, variant: targetVariant, quantity: Math.min(quantity, maxStock) }];
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, variantId?: string) => {
    setItems(prev => prev.filter(item => {
      if (variantId) {
        return !(item.product.id === productId && item.variant?.id === variantId);
      }
      return item.product.id !== productId;
    }));
  };

  const updateQuantity = (productId: string, quantity: number, variantId?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId);
      return;
    }
    setItems(prev =>
      prev.map(item => {
        const matches = variantId
          ? item.product.id === productId && item.variant?.id === variantId
          : item.product.id === productId;

        if (matches) {
          const maxStock = item.variant ? item.variant.stock : item.product.stock;
          return { ...item, quantity: Math.min(quantity, maxStock) };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = items.reduce((sum, item) => {
    const price = item.product.discountedPrice || item.product.price;
    return sum + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItemCount,
        subtotal,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        selectedProductForModal,
        setSelectedProductForModal,
        selectedColor,
        setSelectedColor,
        placedOrderSuccess,
        setPlacedOrderSuccess,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
