import React, { createContext, useContext, useEffect, useState } from "react";
import { MenuItem, MenuService } from "../services/MenuService";

interface MenuContextType {
  menuItems: MenuItem[];
  addMenuItem: (item: Omit<MenuItem, "id" | "createdAt">) => Promise<void>;
  updateMenuItem: (item: Partial<MenuItem> & { id: string }) => Promise<void>;
  deleteMenuItem: (id: string) => Promise<void>;
  toggleStock: (id: string) => Promise<void>;
  isLoading: boolean;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider = ({ children }: { children: React.ReactNode }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Subscribe to real-time updates from Firestore
    const unsubscribe = MenuService.subscribeToMenu((items) => {
      setMenuItems(items);
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const addMenuItem = async (item: Omit<MenuItem, "id" | "createdAt">) => {
    await MenuService.addMenuItem(item);
  };

  const updateMenuItem = async (item: Partial<MenuItem> & { id: string }) => {
    const { id, ...updates } = item;
    await MenuService.updateMenuItem(id, updates);
  };

  const deleteMenuItem = async (id: string) => {
    await MenuService.deleteMenuItem(id);
  };

  const toggleStock = async (id: string) => {
    const item = menuItems.find((i) => i.id === id);
    if (item) {
      await MenuService.toggleStock(id, item.available);
    }
  };

  return (
    <MenuContext.Provider
      value={{
        menuItems,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        toggleStock,
        isLoading,
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
