import React, { createContext, ReactNode, useContext, useState } from "react";

export interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: string;
  available: boolean;
}

interface MenuContextType {
  menuItems: MenuItem[];
  addMenuItem: (item: MenuItem) => void;
  updateMenuItem: (item: MenuItem) => void;
  toggleStock: (id: number) => void;
  deleteMenuItem: (id: number) => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider = ({ children }: { children: ReactNode }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: 1,
      name: "Espresso",
      category: "Coffee",
      price: "$3.50",
      available: true,
    },
    {
      id: 2,
      name: "Cappuccino",
      category: "Coffee",
      price: "$4.50",
      available: true,
    },
    {
      id: 3,
      name: "Latte",
      category: "Coffee",
      price: "$4.00",
      available: true,
    },
    {
      id: 4,
      name: "Club Sandwich",
      category: "Food",
      price: "$8.50",
      available: true,
    },
    {
      id: 5,
      name: "Caesar Salad",
      category: "Food",
      price: "$7.00",
      available: false,
    },
    {
      id: 6,
      name: "Blueberry Muffin",
      category: "Bakery",
      price: "$3.00",
      available: true,
    },
    {
      id: 7,
      name: "Croissant",
      category: "Bakery",
      price: "$3.50",
      available: true,
    },
    {
      id: 8,
      name: "Green Tea",
      category: "Tea",
      price: "$2.50",
      available: true,
    },
  ]);

  const addMenuItem = (item: MenuItem) => {
    setMenuItems((prev) => [...prev, item]);
  };

  const updateMenuItem = (updatedItem: MenuItem) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item)),
    );
  };

  const toggleStock = (id: number) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, available: !item.available } : item,
      ),
    );
  };

  const deleteMenuItem = (id: number) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <MenuContext.Provider
      value={{
        menuItems,
        addMenuItem,
        updateMenuItem,
        toggleStock,
        deleteMenuItem,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error("useMenu must be used within a MenuProvider");
  }
  return context;
};
