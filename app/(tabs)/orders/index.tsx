import { useOrders } from "@/context/OrderContext";
import { useRouter } from "expo-router";
import { CheckCircle, ChevronRight, Clock, Coffee, Package, Plus, XCircle } from "lucide-react-native";
import React, { useState } from "react";
import { Pressable, ScrollView, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Orders = () => {
    const { orders, updateOrderStatus } = useOrders();
    const [selectedTab, setSelectedTab] = useState("All");
    const router = useRouter();

    const tabs = ["All", "Preparing", "Ready", "Delivered", "Cancelled"];

    const filteredOrders =
        selectedTab === "All"
            ? orders
            : orders.filter((order) => order.status === selectedTab);

    const getStatusConfig = (status: string) => {
        switch (status) {
            case "Preparing": return { bg: "#FFF7ED", text: "#C2410C", border: "#FED7AA", icon: Clock };
            case "Ready": return { bg: "#ECFDF5", text: "#047857", border: "#A7F3D0", icon: Package };
            case "Delivered": return { bg: "#F3F4F6", text: "#374151", border: "#E5E7EB", icon: CheckCircle };
            case "Cancelled": return { bg: "#FEF2F2", text: "#B91C1C", border: "#FECACA", icon: XCircle };
            default: return { bg: "#F9FAFB", text: "#374151", border: "#E5E7EB", icon: Clock };
        }
    };

    return (
        <View className="flex-1 bg-[#F9F5F0]">
            <StatusBar barStyle="light-content" />

            {/* Header Background */}
            <View className="absolute top-0 w-full h-[220px] bg-[#2C1E11] rounded-b-[40px] shadow-lg" />

            <SafeAreaView className="flex-1" edges={['top']}>
                {/* Header Title */}
                <View className="px-6 pt-2 pb-6">
                    <Text className="text-[#D4A373] text-xs font-bold tracking-[3px] uppercase mb-1">Kitchen Display</Text>
                    <Text className="text-white text-3xl font-black">Incoming Orders</Text>
                </View>

                {/* Custom Tab Bar */}
                <View className="mb-6">
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pl-6" contentContainerStyle={{ paddingRight: 24 }}>
                        {tabs.map((tab) => (
                            <Pressable
                                key={tab}
                                onPress={() => setSelectedTab(tab)}
                                className={`mr-3 px-5 py-2.5 rounded-full border ${selectedTab === tab
                                    ? "bg-[#D4A373] border-[#D4A373]"
                                    : "bg-[#4A3728] border-[#5C4535]"
                                    }`}
                            >
                                <Text className={`font-bold text-xs ${selectedTab === tab ? "text-[#2C1E11]" : "text-[#D4A373]"}`}>
                                    {tab}
                                </Text>
                            </Pressable>
                        ))}
                    </ScrollView>
                </View>

                {/* Orders List */}
                <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                    {filteredOrders.length === 0 ? (
                        <View className="items-center justify-center mt-20 opacity-50">
                            <Coffee size={48} color="#D4A373" />
                            <Text className="text-[#8D7B6D] font-bold mt-4 text-lg">No orders found</Text>
                        </View>
                    ) : (
                        filteredOrders.map((order) => {
                            const config = getStatusConfig(order.status);
                            const SIcon = config.icon;

                            return (
                                <View
                                    key={order.id}
                                    className="bg-white rounded-[24px] mb-4 shadow-sm border border-[#E6E6E6] overflow-hidden"
                                >
                                    {/* Ticket Header stripe */}
                                    <View className={`h-1.5 w-full`} style={{ backgroundColor: config.text }} />

                                    <View className="p-5">
                                        {/* Top Row: ID & Time */}
                                        <View className="flex-row justify-between items-center mb-3">
                                            <View className="flex-row items-center">
                                                <View className="bg-[#2C1E11] px-2 py-1 rounded-md mr-2">
                                                    <Text className="text-[#D4A373] font-black text-xs">#{order.id}</Text>
                                                </View>
                                                <Text className="text-[#9CA3AF] text-xs font-semibold">{order.time}</Text>
                                            </View>

                                            <View style={{ backgroundColor: config.bg, borderColor: config.border }} className="flex-row items-center px-2.5 py-1 rounded-lg border">
                                                <SIcon size={12} color={config.text} />
                                                <Text style={{ color: config.text }} className="text-[10px] font-black uppercase ml-1.5">
                                                    {order.status}
                                                </Text>
                                            </View>
                                        </View>

                                        {/* Customer */}
                                        <Text className="text-[#1F2937] text-xl font-black mb-3">{order.customer}</Text>

                                        {/* Dotted Line Divider */}
                                        <View className="h-[1px] w-full bg-[#E5E7EB] mb-4 border-dashed border-t border-[#D1D5DB]" style={{ borderStyle: 'dashed' }} />

                                        {/* Items List */}
                                        <View className="space-y-2 mb-4">
                                            {order.items.map((item, idx) => (
                                                <View key={idx} className="flex-row items-start">
                                                    <View className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#D4A373] mr-2.5" />
                                                    <Text className="text-[#4B5563] font-medium text-sm flex-1 leading-5">{item}</Text>
                                                </View>
                                            ))}
                                        </View>

                                        {/* Footer Actions */}
                                        <View className="flex-row items-center justify-between mt-2 pt-2">
                                            <Text className="text-[#2C1E11] text-lg font-black">{order.total}</Text>

                                            {order.status === 'Preparing' && (
                                                <Pressable
                                                    onPress={() => updateOrderStatus(order.id, 'Ready')}
                                                    className="bg-[#2C1E11] px-5 py-2.5 rounded-xl shadow-md active:opacity-90"
                                                >
                                                    <Text className="text-[#D4A373] font-bold text-xs uppercase">Mark Ready</Text>
                                                </Pressable>
                                            )}
                                            {order.status === 'Ready' && (
                                                <Pressable
                                                    onPress={() => updateOrderStatus(order.id, 'Delivered')}
                                                    className="bg-[#059669] px-5 py-2.5 rounded-xl shadow-md active:opacity-90 flex-row items-center"
                                                >
                                                    <Text className="text-white font-bold text-xs uppercase mr-1">Complete</Text>
                                                    <ChevronRight size={14} color="white" />
                                                </Pressable>
                                            )}
                                        </View>
                                    </View>
                                </View>
                            );
                        })
                    )}
                </ScrollView>

                {/* --- Floating Action Button (Navigate to Add Order) --- */}
                <Pressable
                    onPress={() => router.push("/orders/add")}
                    className="absolute bottom-8 right-8 w-16 h-16 bg-[#2C1E11] rounded-full items-center justify-center shadow-xl shadow-[#2C1E11]/40 border-4 border-white"
                >
                    <Plus size={32} color="#D4A373" strokeWidth={3} />
                </Pressable>

            </SafeAreaView>
        </View>
    );
};

export default Orders;
