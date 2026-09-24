import React, { createContext, useContext, useState, useMemo } from 'react';
import { CANTEEN_INFO } from '../constants/canteenData';

// Context dedicated to cart management, item quantity calculations,
// and state persistence across screen navigation.
const CartContext = createContext();

export const MAX_ITEM_QUANTITY = 20;
export const MIN_ITEM_QUANTITY = 1;

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isTakeaway, setIsTakeaway] = useState(true);

  // Add an item to the cart or increment quantity if already present
  const addToCart = (item, quantity = 1, notes = '') => {
    if (!item || !item.id) return { success: false, message: 'Invalid item data' };

    const validQty = Math.max(MIN_ITEM_QUANTITY, Math.min(quantity, MAX_ITEM_QUANTITY));
    const cleanNotes = typeof notes === 'string' ? notes.trim() : '';

    setCartItems((prevItems) => {
      // Check if item with matching id and special instructions exists
      const existingIndex = prevItems.findIndex(
        (ci) => ci.item.id === item.id && ci.notes === cleanNotes
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        const combinedQty = Math.min(
          updated[existingIndex].quantity + validQty,
          MAX_ITEM_QUANTITY
        );
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: combinedQty,
        };
        return updated;
      }

      return [
        ...prevItems,
        {
          id: `${item.id}-${Date.now()}`,
          item,
          quantity: validQty,
          notes: cleanNotes,
          addedAt: new Date().toISOString(),
        },
      ];
    });

    return { success: true };
  };

  // Modify quantity of a specific cart item
  const updateQuantity = (cartItemId, newQuantity) => {
    setCartItems((prevItems) => {
      if (newQuantity < MIN_ITEM_QUANTITY) {
        // Remove item if quantity falls below 1
        return prevItems.filter((ci) => ci.id !== cartItemId);
      }
      return prevItems.map((ci) => {
        if (ci.id === cartItemId) {
          const clampedQty = Math.min(newQuantity, MAX_ITEM_QUANTITY);
          return { ...ci, quantity: clampedQty };
        }
        return ci;
      });
    });
  };

  // Remove a specific line item from the cart
  const removeFromCart = (cartItemId) => {
    setCartItems((prevItems) => prevItems.filter((ci) => ci.id !== cartItemId));
  };

  // Clear entire cart upon successful checkout
  const clearCart = () => {
    setCartItems([]);
  };

  // Toggle takeaway status which determines whether the eco container fee is charged
  const toggleTakeaway = () => {
    setIsTakeaway((prev) => !prev);
  };

  // Dynamically calculate subtotal and total item count
  const { subtotal, itemCount } = useMemo(() => {
    return cartItems.reduce(
      (acc, current) => {
        const itemPrice = current.item.price || 0;
        const qty = current.quantity || 1;
        return {
          subtotal: acc.subtotal + itemPrice * qty,
          itemCount: acc.itemCount + qty,
        };
      },
      { subtotal: 0, itemCount: 0 }
    );
  }, [cartItems]);

  // Packaging container fee (LKR 20 if takeaway, LKR 0 for dine in)
  const packagingFee = useMemo(() => {
    if (cartItems.length === 0) return 0;
    return isTakeaway ? CANTEEN_INFO.containerFee : 0;
  }, [cartItems.length, isTakeaway]);

  // Grand total calculation in LKR
  const grandTotal = useMemo(() => {
    return subtotal + packagingFee;
  }, [subtotal, packagingFee]);

  const value = {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    isTakeaway,
    toggleTakeaway,
    subtotal,
    itemCount,
    packagingFee,
    grandTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
