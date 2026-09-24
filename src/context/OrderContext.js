import React, { createContext, useContext, useState } from 'react';

// Context dedicated to order placement, lifecycle status transitions,
// and student order history.
const OrderContext = createContext();

// Ordered status sequence satisfying Activity Sheet requirement 11
export const ORDER_STATUSES = ['Placed', 'Preparing', 'Ready for Pickup', 'Completed'];

// Seed historical orders to populate profile screen on launch
const INITIAL_ORDER_HISTORY = [
  {
    id: 'UOK-3142',
    date: '2026-09-22 12:35 PM',
    status: 'Completed',
    counter: 'Counter 1: Main Meals & Rice',
    pickupTimeSlot: 'Main Lunch Break (12:15 PM - 01:00 PM)',
    items: [
      { name: 'Chicken Rice and Curry (Student Plate)', quantity: 1, price: 220 },
      { name: 'Hot Ginger Plain Tea (Kahata)', quantity: 1, price: 30 },
    ],
    subtotal: 250,
    packagingFee: 20,
    grandTotal: 270,
    paymentMethod: 'Student Canteen Pass',
  },
  {
    id: 'UOK-2980',
    date: '2026-09-20 10:20 AM',
    status: 'Completed',
    counter: 'Counter 2: Short Eats & Bakery',
    pickupTimeSlot: 'Next Lecture Interval (10:15 AM - 10:30 AM)',
    items: [
      { name: 'Spicy Fish Bun (Malu Paan)', quantity: 2, price: 80 },
      { name: 'Iced Milo with Extra Powder', quantity: 1, price: 140 },
    ],
    subtotal: 300,
    packagingFee: 0,
    grandTotal: 300,
    paymentMethod: 'Cash at Counter',
  },
];

export function OrderProvider({ children }) {
  const [activeOrders, setActiveOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [orderHistory, setOrderHistory] = useState(INITIAL_ORDER_HISTORY);

  // Generate unique order ID in format UOK-XXXX
  const generateOrderId = () => {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    return `UOK-${randomDigits}`;
  };

  // Place a new order from checkout
  const placeOrder = ({
    items,
    subtotal,
    packagingFee,
    grandTotal,
    pickupCounter,
    pickupTimeSlot,
    contactPhone,
    paymentMethod,
    studentInfo,
  }) => {
    if (!items || items.length === 0) {
      return { success: false, message: 'Cannot place an empty order' };
    }

    const orderId = generateOrderId();
    const formattedDate = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    const newOrder = {
      id: orderId,
      date: `Today, ${formattedDate}`,
      status: 'Placed',
      counter: pickupCounter || 'Counter 1: Main Meals & Rice',
      pickupTimeSlot: pickupTimeSlot || 'Next Lecture Interval',
      contactPhone: contactPhone || '0714589231',
      paymentMethod: paymentMethod || 'Cash at Counter',
      items: items.map((ci) => ({
        id: ci.item.id,
        name: ci.item.name,
        price: ci.item.price,
        quantity: ci.quantity,
        notes: ci.notes,
      })),
      subtotal,
      packagingFee,
      grandTotal,
      studentName: studentInfo?.name || 'Student',
      studentId: studentInfo?.studentId || 'PS/2021/045',
      estimatedMinutes: 15,
      createdAt: Date.now(),
    };

    setActiveOrders((prev) => [newOrder, ...prev]);
    setCurrentOrder(newOrder);

    return { success: true, order: newOrder };
  };

  // Transition order through statuses: Placed -> Preparing -> Ready for Pickup -> Completed
  const advanceOrderStatus = (orderId) => {
    setActiveOrders((prevActive) => {
      const orderIndex = prevActive.findIndex((o) => o.id === orderId);
      if (orderIndex === -1) return prevActive;

      const order = prevActive[orderIndex];
      const currentIndex = ORDER_STATUSES.indexOf(order.status);

      if (currentIndex < ORDER_STATUSES.length - 1) {
        const nextStatus = ORDER_STATUSES[currentIndex + 1];
        const updatedOrder = { ...order, status: nextStatus };

        // Keep currentOrder state synchronized
        if (currentOrder && currentOrder.id === orderId) {
          setCurrentOrder(updatedOrder);
        }

        if (nextStatus === 'Completed') {
          // Move from active orders to history
          setOrderHistory((prevHistory) => [updatedOrder, ...prevHistory]);
          return prevActive.filter((o) => o.id !== orderId);
        }

        const updatedList = [...prevActive];
        updatedList[orderIndex] = updatedOrder;
        return updatedList;
      }

      return prevActive;
    });
  };

  const value = {
    activeOrders,
    currentOrder,
    setCurrentOrder,
    orderHistory,
    placeOrder,
    advanceOrderStatus,
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}
