import { useMenu } from "@/context/MenuContext";
import { useOrders } from "@/context/OrderContext";
import { useRouter } from "expo-router";
import { ArrowLeft, CheckCircle, Minus, ShoppingBag } from "lucide-react-native";
import React, { useState } from "react";
import { Alert, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AddOrder = () => {
    const router = useRouter();
    const { menuItems } = useMenu();
    const { addOrder, orders } = useOrders();

    const [customerName, setCustomerName] = useState("");
    const [selectedItems, setSelectedItems] = useState<{ id: number, name: string, price: number, qty: number }[]>([]);

    // Filter available items only
    const availableItems = menuItems.filter(item => item.available);

    const addItemToOrder = (item: any) => {
        // Parse price string $X.XX to number
        const priceNum = parseFloat(item.price.replace('$', ''));

        setSelectedItems(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
            }
            return [...prev, { id: item.id, name: item.name, price: priceNum, qty: 1 }];
        });
    };

    const removeItemFromOrder = (id: number) => {
        setSelectedItems(prev => prev.filter(i => i.id !== id));
    };

    const updateQty = (id: number, delta: number) => {
        setSelectedItems(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = Math.max(0, item.qty + delta);
                return { ...item, qty: newQty };
            }
            return item;
        }).filter(item => item.qty > 0));
    }

    const calculateTotal = () => {
        return selectedItems.reduce((acc, item) => acc + (item.price * item.qty), 0).toFixed(2);
    };

    const handleCreateOrder = () => {
        if (!customerName.trim()) {
            Alert.alert("Required", "Please enter customer name");
            return;
        }
        if (selectedItems.length === 0) {
            Alert.alert("Required", "Please select at least one item");
            return;
        }

        const newOrderObj = {
            id: String(orders.length + 1).padStart(3, '0'),
            customer: customerName,
            items: selectedItems.map(i => `${i.qty}x ${i.name}`),
            total: `$${calculateTotal()}`,
            status: "Preparing" as const,
            time: "Just now"
        };

        addOrder(newOrderObj);
        Alert.alert("Success", "Order sent to kitchen!", [
            { text: "OK", onPress: () => router.back() }
        ]);
    };

    return (
        <View className="flex-1 bg-[#F9F5F0]">
            <StatusBar barStyle="dark-content" />
            <SafeAreaView className="flex-1" edges={['top']}>

                {/* Header */}
                <View className="px-6 py-4 flex-row items-center border-b border-[#E6E6E6] bg-white">
                    <TouchableOpacity onPress={() => router.back()} className="mr-4 bg-[#F3F4F6] p-2 rounded-full">
                        <ArrowLeft size={24} color="#4B5563" />
                    </TouchableOpacity>
                    <View>
                        <Text className="text-[#D4A373] text-xs font-bold uppercase tracking-wider">New Order</Text>
                        <Text className="text-[#2C1E11] text-xl font-black">Walk-In Customer</Text>
                    </View>
                </View>

                <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
                    {/* Customer Details */}
                    <View className="p-6 bg-white mb-2">
                        <Text className="text-[#4B5563] font-bold mb-2 uppercase text-xs">Customer Name</Text>
                        <TextInput
                            value={customerName}
                            onChangeText={setCustomerName}
                            placeholder="e.g. Guest #42"
                            className="bg-[#F9FAFB] border border-[#E5E7EB] p-4 rounded-xl text-[#2C1E11] font-semibold text-lg"
                        />
                    </View>

                    {/* Menu Selection */}
                    <View className="px-6 py-4">
                        <Text className="text-[#4B5563] font-bold mb-4 uppercase text-xs">Select Menu Items</Text>
                        <View className="flex-row flex-wrap justify-between">
                            {availableItems.map((item) => (
                                <TouchableOpacity
                                    key={item.id}
                                    onPress={() => addItemToOrder(item)}
                                    className="w-[48%] bg-white p-4 rounded-[20px] border border-[#E5E7EB] mb-4 shadow-sm active:border-[#D4A373]"
                                >
                                    <View className="flex-row justify-between items-start mb-2">
                                        <View className="bg-[#FFF7ED] p-2 rounded-full">
                                            <ShoppingBag size={16} color="#D4A373" />
                                        </View>
                                        <View className="bg-[#2C1E11] px-2 py-1 rounded-lg">
                                            <Text className="text-white font-bold text-xs">{item.price}</Text>
                                        </View>
                                    </View>
                                    <Text className="text-[#2C1E11] font-bold text-base leading-5 mb-1">{item.name}</Text>
                                    <Text className="text-[#9CA3AF] text-xs font-medium uppercase">{item.category}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </ScrollView>

                {/* Bottom Cart Sheet */}
                <View className="absolute bottom-0 w-full bg-white rounded-t-[35px] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] p-6 border-t border-[#F3F4F6]">
                    {selectedItems.length > 0 ? (
                        <>
                            <View className="flex-row justify-between items-center mb-6">
                                <View>
                                    <Text className="text-[#9CA3AF] font-bold uppercase text-xs">Total Amount</Text>
                                    <Text className="text-[#2C1E11] font-black text-3xl">${calculateTotal()}</Text>
                                </View>
                                <View className="bg-[#FFF7ED] px-4 py-2 rounded-xl">
                                    <Text className="text-[#D4A373] font-bold">{selectedItems.length} Items</Text>
                                </View>
                            </View>

                            {/* Compact Item List (Last 2 items or summary) can go here if needed, but keeping it simple */}
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6 max-h-16">
                                {selectedItems.map((item) => (
                                    <View key={item.id} className="mr-3 bg-[#F9FAFB] px-3 py-2 rounded-lg border border-[#E5E7EB] flex-row items-center">
                                        <Text className="font-bold text-[#2C1E11] mr-2">{item.qty}x</Text>
                                        <Text className="text-[#4B5563] text-xs font-semibold mr-2">{item.name}</Text>
                                        <TouchableOpacity onPress={() => updateQty(item.id, -1)}>
                                            <Minus size={14} color="#EF4444" />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </ScrollView>

                            <TouchableOpacity
                                onPress={handleCreateOrder}
                                className="bg-[#2C1E11] w-full py-5 rounded-[25px] flex-row items-center justify-center shadow-lg active:scale-95 transition-transform"
                            >
                                <Text className="text-white font-black text-lg uppercase tracking-widest mr-2">Confirm Order</Text>
                                <CheckCircle size={20} color="white" />
                            </TouchableOpacity>
                        </>
                    ) : (
                        <View className="items-center py-4">
                            <Text className="text-[#9CA3AF] font-medium">Select items to start an order</Text>
                        </View>
                    )}
                </View>

            </SafeAreaView>
        </View>
    );
};

export default AddOrder;
