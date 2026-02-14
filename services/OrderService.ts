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

const ORDERS_COLLECTION = "orders";

export interface OrderItem {
    id: string;
    name: string;
    price: number;
    qty: number;
}

export interface Order {
    id: string;
    customer: string;
    items: string[]; // Keeping the string array format for display compatibility
    rawItems: OrderItem[]; // Storing structured data for logic
    total: string;
    status: "Preparing" | "Ready" | "Delivered" | "Cancelled";
    time?: string;
    createdAt?: any;
}

export const OrderService = {
    // Subscribe to real-time updates
    subscribeToOrders: (callback: (orders: Order[]) => void) => {
        const q = query(
            collection(db, ORDERS_COLLECTION),
            orderBy("createdAt", "desc")
        );

        return onSnapshot(q, (snapshot) => {
            const orders = snapshot.docs.map((doc) => {
                const data = doc.data();
                // Convert timestamp to readable time string if needed, or handle in UI
                const time = data.createdAt
                    ? new Date(data.createdAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : "Just now";

                return {
                    id: doc.id,
                    ...data,
                    time,
                };
            }) as Order[];
            callback(orders);
        });
    },

    // Add a new order
    addOrder: async (order: Omit<Order, "id" | "createdAt" | "time">) => {
        try {
            await addDoc(collection(db, ORDERS_COLLECTION), {
                ...order,
                createdAt: serverTimestamp(),
            });
        } catch (error) {
            console.error("Error adding order: ", error);
            throw error;
        }
    },

    // Update order status
    updateOrderStatus: async (id: string, status: Order["status"]) => {
        try {
            const docRef = doc(db, ORDERS_COLLECTION, id);
            await updateDoc(docRef, { status });
        } catch (error) {
            console.error("Error updating order status: ", error);
            throw error;
        }
    },

    // Update entire order
    updateOrder: async (id: string, updates: Partial<Order>) => {
        try {
            const docRef = doc(db, ORDERS_COLLECTION, id);
            await updateDoc(docRef, updates);
        } catch (error) {
            console.error("Error updating order: ", error);
            throw error;
        }
    },

    // Delete an order
    deleteOrder: async (id: string) => {
        try {
            await deleteDoc(doc(db, ORDERS_COLLECTION, id));
        } catch (error) {
            console.error("Error deleting order: ", error);
            throw error;
        }
    },
};
