import { useOrders } from "@/context/OrderContext";
import { CheckCircle, ChevronRight, Clock, Coffee, Package, Plus, Trash2, XCircle } from "lucide-react-native";
import React, { useState } from "react";
import { Alert, Modal, Pressable, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Orders = () => {
  const { orders, addOrder, updateOrderStatus } = useOrders();
  const [selectedTab, setSelectedTab] = useState("All");
  const [modalVisible, setModalVisible] = useState(false);

  // New Order State
  const [customerName, setCustomerName] = useState("");
  const [selectedItems, setSelectedItems] = useState<{ id: string, name: string, price: number, qty: number }[]>([]);

  // Mock Data for Menu Items Selector
  const menuOptions = [
    { id: "m1", name: "Espresso", price: 3.50 },
    { id: "m2", name: "Cappuccino", price: 4.50 },
    { id: "m3", name: "Iced Latte", price: 5.00 },
    { id: "m4", name: "Croissant", price: 3.00 },
    { id: "m5", name: "Bagel", price: 2.50 },
    { id: "m6", name: "Green Tea", price: 3.00 },
  ];

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

  // --- Add Order Logic ---
  const addItemToOrder = (item: { id: string, name: string, price: number }) => {
    setSelectedItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeItemFromOrder = (id: string) => {
    setSelectedItems(prev => prev.filter(i => i.id !== id));
  };

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
    setModalVisible(false);
    setCustomerName("");
    setSelectedItems([]);
    Alert.alert("Success", "Order sent to kitchen!");
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
            filteredOrders.map((order, index) => {
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

        {/* --- Floating Action Button (Add Order) --- */}
        <Pressable
          onPress={() => setModalVisible(true)}
          className="absolute bottom-8 right-8 w-16 h-16 bg-[#2C1E11] rounded-full items-center justify-center shadow-xl shadow-[#2C1E11]/40 border-4 border-white"
        >
          <Plus size={32} color="#D4A373" strokeWidth={3} />
        </Pressable>

        {/* --- Add Order Modal --- */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View className="flex-1 justify-end bg-black/50">
            <View className="bg-[#FDFBF7] h-[85%] rounded-t-[30px] p-6 shadow-2xl">
              {/* Modal Header */}
              <View className="flex-row justify-between items-center mb-6">
                <View>
                  <Text className="text-[#D4A373] text-xs font-bold uppercase tracking-widest">Walk-In Customer</Text>
                  <Text className="text-[#2C1E11] text-2xl font-black">New Order</Text>
                </View>
                <TouchableOpacity onPress={() => setModalVisible(false)} className="bg-[#F3F4F6] p-2 rounded-full">
                  <XCircle size={24} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Customer Name */}
                <Text className="text-[#4B5563] font-bold mb-2">Customer Name</Text>
                <TextInput
                  value={customerName}
                  onChangeText={setCustomerName}
                  placeholder="Ex: Guest #12"
                  className="bg-white border border-[#E5E7EB] p-4 rounded-xl text-[#2C1E11] font-semibold mb-6"
                />

                {/* Menu Selection */}
                <Text className="text-[#4B5563] font-bold mb-3">Select Items</Text>
                <View className="flex-row flex-wrap justify-between mb-6">
                  {menuOptions.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      onPress={() => addItemToOrder(item)}
                      className="w-[48%] bg-white p-3 rounded-xl border border-[#E5E7EB] mb-3 flex-row justify-between items-center shadow-sm"
                    >
                      <View>
                        <Text className="text-[#2C1E11] font-bold">{item.name}</Text>
                        <Text className="text-[#D4A373] font-bold text-xs">${item.price.toFixed(2)}</Text>
                      </View>
                      <View className="bg-[#F3F4F6] p-1.5 rounded-lg">
                        <Plus size={16} color="#4B5563" />
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Cart/Selected Items */}
                <Text className="text-[#4B5563] font-bold mb-3">Current Cart</Text>
                {selectedItems.length === 0 ? (
                  <View className="bg-[#F9FAFB] p-6 rounded-xl items-center border border-dashed border-[#D1D5DB] mb-6">
                    <Text className="text-[#9CA3AF] font-medium">No items selected</Text>
                  </View>
                ) : (
                  <View className="bg-white rounded-xl border border-[#E5E7EB] mb-6 overflow-hidden">
                    {selectedItems.map((item, idx) => (
                      <View key={idx} className="flex-row justify-between items-center p-4 border-b border-[#F3F4F6]">
                        <View className="flex-row items-center">
                          <View className="bg-[#2C1E11] w-6 h-6 rounded-full items-center justify-center mr-3">
                            <Text className="text-[#D4A373] text-xs font-bold">{item.qty}</Text>
                          </View>
                          <Text className="text-[#2C1E11] font-medium">{item.name}</Text>
                        </View>
                        <View className="flex-row items-center">
                          <Text className="text-[#4B5563] font-bold mr-4">${(item.price * item.qty).toFixed(2)}</Text>
                          <TouchableOpacity onPress={() => removeItemFromOrder(item.id)}>
                            <Trash2 size={18} color="#EF4444" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                    <View className="bg-[#F9FAFB] p-4 flex-row justify-between items-center">
                      <Text className="text-[#4B5563] font-bold uppercase text-xs">Total Amount</Text>
                      <Text className="text-[#2C1E11] font-black text-xl">${calculateTotal()}</Text>
                    </View>
                  </View>
                )}
              </ScrollView>

              {/* Submit Button */}
              <TouchableOpacity
                onPress={handleCreateOrder}
                className="bg-[#2C1E11] p-5 rounded-2xl shadow-lg shadow-[#2C1E11]/30 mt-4 items-center flex-row justify-center"
              >
                <Text className="text-white font-bold text-lg mr-2">Create Ticket</Text>
                <CheckCircle size={20} color="#D4A373" />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </SafeAreaView>
    </View>
  );
};

export default Orders;