"use client";

import React, { createContext, ReactNode, useContext, useState, useEffect } from "react";

export interface CartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  calories?: number;
  image: string;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  totalPrice: number;
  createdAt: Date;
}

// 購物車數量的存儲格式
interface CartQuantities {
  [productId: string]: number;
}

interface CartContextType {
  items: CartItem[];
  orders: Order[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number, itemData?: Partial<CartItem>) => void;
  clearCart: () => void;
  saveOrder: (orderNumber: string) => void;
  reorder: (orderId: string) => void;
  getQuantity: (id: string) => number;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// localStorage key
const CART_STORAGE_KEY = "breakfast-cart-quantities";

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartQuantities, setCartQuantities] = useState<CartQuantities>({});
  const [cartItemsData, setCartItemsData] = useState<Map<string, CartItem>>(new Map());
  const [orders, setOrders] = useState<Order[]>([]);

  // 從 localStorage 讀取購物車數據
  useEffect(() => {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    if (saved) {
      try {
        setCartQuantities(JSON.parse(saved));
      } catch (error) {
        console.error("Failed to parse cart data:", error);
      }
    }
  }, []);

  // 保存購物車數據到 localStorage
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartQuantities));
  }, [cartQuantities]);

  // 獲取購物車項目列表（包含完整數據）
  const items = Array.from(cartItemsData.values()).filter(
    (item) => (cartQuantities[item.id] || 0) > 0
  ).map((item) => ({
    ...item,
    quantity: cartQuantities[item.id] || 0,
  }));

  const addItem = (item: CartItem) => {
    setCartItemsData((prev) => {
      const newMap = new Map(prev);
      newMap.set(item.id, item);
      return newMap;
    });
    setCartQuantities((prev) => ({
      ...prev,
      [item.id]: (prev[item.id] || 0) + item.quantity,
    }));
  };

  const removeItem = (id: string) => {
    setCartQuantities((prev) => {
      const newQuantities = { ...prev };
      delete newQuantities[id];
      return newQuantities;
    });
  };

  const updateQuantity = (id: string, quantity: number, itemData?: Partial<CartItem>) => {
    // 如果提供了 itemData，更新商品資料
    if (itemData && quantity > 0) {
      setCartItemsData((prev) => {
        const newMap = new Map(prev);
        const existing = newMap.get(id);
        newMap.set(id, { ...existing, ...itemData, id } as CartItem);
        return newMap;
      });
    }
    
    // 更新數量
    if (quantity <= 0) {
      setCartQuantities((prev) => {
        const newQuantities = { ...prev };
        delete newQuantities[id];
        return newQuantities;
      });
    } else {
      setCartQuantities((prev) => ({
        ...prev,
        [id]: quantity,
      }));
    }
  };

  const getQuantity = (id: string): number => {
    return cartQuantities[id] || 0;
  };

  const clearCart = () => {
    setCartQuantities({});
  };

  const saveOrder = (orderNumber: string) => {
    const newOrder: Order = {
      id: Date.now().toString(),
      orderNumber,
      items: [...items],
      totalPrice,
      createdAt: new Date(),
    };
    setOrders((prevOrders) => [newOrder, ...prevOrders]);
  };

  const reorder = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      const newQuantities: CartQuantities = {};
      order.items.forEach((item) => {
        newQuantities[item.id] = item.quantity;
        setCartItemsData((prev) => {
          const newMap = new Map(prev);
          newMap.set(item.id, item);
          return newMap;
        });
      });
      setCartQuantities(newQuantities);
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        orders,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        saveOrder,
        reorder,
        getQuantity,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
