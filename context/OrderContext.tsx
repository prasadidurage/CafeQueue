import React, { createContext, useContext, useEffect, useState } from "react";
import { Order, OrderService } from "../services/OrderService";

interface OrderContextType {
  orders: Order[];
  addOrder: (
    order: Omit<Order, "id" | "createdAt" | "time">,
  ) => Promise<void>;
  updateOrder: (order: Partial<Order> & { id: string }) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  updateOrderStatus: (id: string, status: Order["status"]) => Promise<void>;
  isLoading: boolean;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: React.ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = OrderService.subscribeToOrders((updatedOrders) => {
      setOrders(updatedOrders);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addOrder = async (
    order: Omit<Order, "id" | "createdAt" | "time">,
  ) => {
    await OrderService.addOrder(order);
  };

  const updateOrder = async (order: Partial<Order> & { id: string }) => {
    const { id, ...updates } = order;
    await OrderService.updateOrder(id, updates);
  };

  const deleteOrder = async (id: string) => {
    await OrderService.deleteOrder(id);
  };

  const updateOrderStatus = async (id: string, status: Order["status"]) => {
    await OrderService.updateOrderStatus(id, status);
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        addOrder,
        updateOrder,
        deleteOrder,
        updateOrderStatus,
        isLoading,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
};
