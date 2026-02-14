import React, { createContext, ReactNode, useContext, useState } from "react";

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  qty: number;
}

export interface Order {
  id: string;
  customer: string;
  items: string[]; // Keeping strings for display simplicity for now: "2x Espresso"
  total: string;
  status: "Preparing" | "Ready" | "Delivered" | "Cancelled";
  time: string;
  rawItems?: OrderItem[]; // Optional full item details if needed later
}

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrder: (order: Order) => void;
  deleteOrder: (id: string) => void;
  updateOrderStatus: (id: string, status: Order["status"]) => void;
  stats: {
    revenue: number;
    totalOrders: number;
    pending: number;
    completed: number;
  };
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "001",
      customer: "John Doe",
      items: ["2x Espresso", "1x Croissant"],
      total: "$10.50",
      status: "Preparing",
      time: "5m",
    },
    {
      id: "002",
      customer: "Jane Smith",
      items: ["1x Latte", "1x Club Sandwich"],
      total: "$12.50",
      status: "Ready",
      time: "10m",
    },
    {
      id: "003",
      customer: "Mike Johnson",
      items: ["3x Cappuccino"],
      total: "$13.50",
      status: "Delivered",
      time: "25m",
    },
    {
      id: "004",
      customer: "Sarah Williams",
      items: ["1x Green Tea", "2x Muffin"],
      total: "$8.50",
      status: "Cancelled",
      time: "30m",
    },
    {
      id: "005",
      customer: "David Brown",
      items: ["2x Latte", "1x Caesar Salad"],
      total: "$15.00",
      status: "Preparing",
      time: "2m",
    },
  ]);

  const addOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
  };

  const updateOrder = (updatedOrder: Order) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === updatedOrder.id ? updatedOrder : order,
      ),
    );
  };

  const deleteOrder = (id: string) => {
    setOrders((prev) => prev.filter((order) => order.id !== id));
  };

  const updateOrderStatus = (id: string, status: Order["status"]) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === id ? { ...order, status } : order)),
    );
  };

  const stats = {
    revenue: orders
      .filter((o) => o.status !== "Cancelled")
      .reduce((acc, curr) => acc + parseFloat(curr.total.replace("$", "")), 0),
    totalOrders: orders.length,
    pending: orders.filter((o) => o.status === "Preparing").length,
    completed: orders.filter((o) => o.status === "Delivered").length,
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        addOrder,
        updateOrder,
        deleteOrder,
        updateOrderStatus,
        stats,
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
