import { db } from "./firebase";
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp,
} from "firebase/firestore";

const MENU_COLLECTION = "menu";

export interface MenuItem {
    id: string;
    name: string;
    price: string;
    category: string;
    available: boolean;
    image?: any; // For now keeping image as any since we moved away from local requires
    createdAt?: any;
}

export const MenuService = {
    // Subscribe to real-time updates
    subscribeToMenu: (callback: (items: MenuItem[]) => void) => {
        const q = query(
            collection(db, MENU_COLLECTION),
            orderBy("createdAt", "desc")
        );

        return onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as MenuItem[];
            callback(items);
        });
    },

    // Add a new menu item
    addMenuItem: async (item: Omit<MenuItem, "id" | "createdAt">) => {
        try {
            await addDoc(collection(db, MENU_COLLECTION), {
                ...item,
                createdAt: serverTimestamp(),
            });
        } catch (error) {
            console.error("Error adding menu item: ", error);
            throw error;
        }
    },

    // Update an existing menu item
    updateMenuItem: async (id: string, updates: Partial<MenuItem>) => {
        try {
            const docRef = doc(db, MENU_COLLECTION, id);
            await updateDoc(docRef, updates);
        } catch (error) {
            console.error("Error updating menu item: ", error);
            throw error;
        }
    },

    // Delete a menu item
    deleteMenuItem: async (id: string) => {
        try {
            await deleteDoc(doc(db, MENU_COLLECTION, id));
        } catch (error) {
            console.error("Error deleting menu item: ", error);
            throw error;
        }
    },

    // Toggle stock status
    toggleStock: async (id: string, currentStatus: boolean) => {
        try {
            const docRef = doc(db, MENU_COLLECTION, id);
            await updateDoc(docRef, { available: !currentStatus });
        } catch (error) {
            console.error("Error toggling stock status: ", error);
            throw error;
        }
    },
};
