'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { MenuItem } from '../data/menu';

export interface CartItem {
  menuItem: MenuItem;
  selectedVariant?: { name: string; price: number };
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: MenuItem, variant?: { name: string; price: number }) => void;
  removeFromCart: (itemId: string, variantName?: string) => void;
  updateQuantity: (itemId: string, variantName: string | undefined, quantity: number) => void;
  clearCart: () => void;
  tableNumber: string;
  setTableNumber: (table: string) => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [tableNumber, setTableNumberState] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart and table number from localStorage on client-side mount
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('cafe_qr_cart');
      const storedTable = localStorage.getItem('cafe_qr_table');
      
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
      if (storedTable) {
        setTableNumberState(storedTable);
      }
    } catch (e) {
      console.error('Failed to load cart state:', e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Sync cart and table number changes to localStorage
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem('cafe_qr_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart state:', e);
    }
  }, [cart, isInitialized]);

  const setTableNumber = (table: string) => {
    setTableNumberState(table);
    try {
      localStorage.setItem('cafe_qr_table', table);
    } catch (e) {
      console.error('Failed to save table number:', e);
    }
  };

  const addToCart = (item: MenuItem, variant?: { name: string; price: number }) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.menuItem.id === item.id && i.selectedVariant?.name === variant?.name
      );
      if (existingIndex > -1) {
        const nextCart = [...prev];
        nextCart[existingIndex].quantity += 1;
        return nextCart;
      }
      return [...prev, { menuItem: item, selectedVariant: variant, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string, variantName?: string) => {
    setCart((prev) =>
      prev.filter(
        (i) => !(i.menuItem.id === itemId && i.selectedVariant?.name === variantName)
      )
    );
  };

  const updateQuantity = (itemId: string, variantName: string | undefined, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId, variantName);
      return;
    }
    setCart((prev) =>
      prev.map((i) =>
        i.menuItem.id === itemId && i.selectedVariant?.name === variantName
          ? { ...i, quantity }
          : i
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((sum, item) => {
    const price = item.selectedVariant ? item.selectedVariant.price : item.menuItem.price;
    return sum + price * item.quantity;
  }, 0);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        tableNumber,
        setTableNumber,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
