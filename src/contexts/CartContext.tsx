import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem } from '../types';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, cart: firebaseCart, updateCart } = useAuth();
  
  const [localCart, setLocalCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('kinetic_cart');
    if (savedCart) {
      try {
        return JSON.parse(savedCart);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const cart = user ? (firebaseCart as CartItem[]) : localCart;

  useEffect(() => {
    if (!user) {
      localStorage.setItem('kinetic_cart', JSON.stringify(localCart));
    }
  }, [localCart, user]);

  const addToCart = async (item: CartItem) => {
    if (user) {
      const newItems = [...cart, item];
      await updateCart(newItems);
    } else {
      setLocalCart((prev) => [...prev, item]);
    }
    
    toast.success(`${item.productName} added to cart`, {
      description: `${item.amount} - ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(item.price)}`,
    });
  };

  const removeFromCart = async (id: string) => {
    if (user) {
      const newItems = cart.filter((item) => item.id !== id);
      await updateCart(newItems);
    } else {
      setLocalCart((prev) => prev.filter((item) => item.id !== id));
    }
    toast.info('Item removed from cart');
  };

  const clearCart = async () => {
    if (user) {
      await updateCart([]);
    } else {
      setLocalCart([]);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
