import { useOrders } from "@/context/OrderContext";
import {
  CheckCircle,
  ChevronRight,
  Clock,
  Coffee,
  Edit3,
  Package,
  Plus,
  Trash2,
  X,
  XCircle,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Orders = () => {
  const { orders, addOrder, updateOrder, deleteOrder, updateOrderStatus } =
    useOrders();
  const [selectedTab, setSelectedTab] = useState("All");
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [selectedItems, setSelectedItems] = useState<
    { id: string; name: string; price: number; qty: number }[]
  >([]);
  const [selectedStatus, setSelectedStatus] = useState<
    "Preparing" | "Ready" | "Delivered" | "Cancelled"
  >("Preparing");

  const menuOptions = [
    { id: "m1", name: "Espresso", price: 3.5 },
    { id: "m2", name: "Cappuccino", price: 4.5 },
    { id: "m3", name: "Iced Latte", price: 5.0 },
    { id: "m4", name: "Croissant", price: 3.0 },
    { id: "m5", name: "Bagel", price: 2.5 },
    { id: "m6", name: "Green Tea", price: 3.0 },
  ];

  const tabs = ["All", "Preparing", "Ready", "Delivered", "Cancelled"];

  const filteredOrders =
    selectedTab === "All"
      ? orders
      : orders.filter((order) => order.status === selectedTab);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "Preparing":
        return {
          bg: "#FFF7ED",
          text: "#C2410C",
          border: "#FED7AA",
          icon: Clock,
        };
      case "Ready":
        return {
          bg: "#ECFDF5",
          text: "#047857",
          border: "#A7F3D0",
          icon: Package,
        };
      case "Delivered":
        return {
          bg: "#F3F4F6",
          text: "#374151",
          border: "#E5E7EB",
          icon: CheckCircle,
        };
      case "Cancelled":
        return {
          bg: "#FEF2F2",
          text: "#B91C1C",
          border: "#FECACA",
          icon: XCircle,
        };
      default:
        return {
          bg: "#F9FAFB",
          text: "#374151",
          border: "#E5E7EB",
          icon: Clock,
        };
    }
  };

  const resetForm = () => {
    setCustomerName("");
    setSelectedItems([]);
    setSelectedStatus("Preparing");
    setIsEditing(false);
    setEditingId(null);
  };

  const openAddModal = () => {
    resetForm();
    setModalVisible(true);
  };

  const parseOrderItems = (items: string[]) => {
    return items.map((entry, idx) => {
      const match = entry.match(/^(\d+)x\s+(.*)$/);
      const qty = match ? Number(match[1]) : 1;
      const name = match ? match[2] : entry;
      const menuItem = menuOptions.find((option) => option.name === name);
      return {
        id: menuItem?.id ?? `custom-${idx}`,
        name,
        price: menuItem?.price ?? 0,
        qty,
      };
    });
  };

  const openEditModal = (order: {
    id: string;
    customer: string;
    items: string[];
    status: "Preparing" | "Ready" | "Delivered" | "Cancelled";
  }) => {
    setCustomerName(order.customer);
    setSelectedItems(parseOrderItems(order.items));
    setSelectedStatus(order.status);
    setIsEditing(true);
    setEditingId(order.id);
    setModalVisible(true);
  };

  const addItemToOrder = (item: {
    id: string;
    name: string;
    price: number;
  }) => {
    setSelectedItems((prev) => {
      const existing = prev.find((entry) => entry.id === item.id);
      if (existing) {
        return prev.map((entry) =>
          entry.id === item.id ? { ...entry, qty: entry.qty + 1 } : entry,
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeItemFromOrder = (id: string) => {
    setSelectedItems((prev) => prev.filter((item) => item.id !== id));
  };

  const calculateTotal = () => {
    return selectedItems
      .reduce((acc, item) => acc + item.price * item.qty, 0)
      .toFixed(2);
  };

  const handleSaveOrder = () => {
    if (!customerName.trim()) {
      Alert.alert("Required", "Please enter customer name");
      return;
    }
    if (selectedItems.length === 0) {
      Alert.alert("Required", "Please select at least one item");
      return;
    }

    const items = selectedItems.map((item) => `${item.qty}x ${item.name}`);
    const total = `$${calculateTotal()}`;

    if (isEditing && editingId) {
      const existing = orders.find((order) => order.id === editingId);
      updateOrder({
        id: editingId,
        customer: customerName.trim(),
        items,
        total,
        status: selectedStatus,
        time: existing?.time ?? "Just now",
        rawItems: selectedItems,
      });
    } else {
      const nextIdNumber = orders.length
        ? Math.max(...orders.map((order) => Number(order.id))) + 1
        : 1;
      const nextId = String(nextIdNumber).padStart(3, "0");
      addOrder({
        id: nextId,
        customer: customerName.trim(),
        items,
        total,
        status: selectedStatus,
        time: "Just now",
        rawItems: selectedItems,
      });
    }

    setModalVisible(false);
    resetForm();
  };

  const handleDeleteOrder = (id: string) => {
    Alert.alert("Delete order", "Are you sure you want to delete this order?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteOrder(id) },
    ]);
  };

  return (
    <View className="flex-1 bg-[#F9F5F0]">
      <StatusBar barStyle="light-content" />

      {/* Header Background */}
      <View className="absolute top-0 w-full h-[220px] bg-[#2C1E11] rounded-b-[40px] shadow-lg" />

      <SafeAreaView className="flex-1" edges={["top"]}>
        {/* Header Title */}
        <View className="px-6 pt-2 pb-6">
          <Text className="text-[#D4A373] text-xs font-bold tracking-[3px] uppercase mb-1">
            Kitchen Display
          </Text>
          <Text className="text-white text-3xl font-black">
            Incoming Orders
          </Text>
        </View>

        {/* Custom Tab Bar */}
        <View className="mb-6">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="pl-6"
            contentContainerStyle={{ paddingRight: 24 }}
          >
            {tabs.map((tab) => (
              <Pressable
                key={tab}
                onPress={() => setSelectedTab(tab)}
                className={`mr-3 px-5 py-2.5 rounded-full border ${
                  selectedTab === tab
                    ? "bg-[#D4A373] border-[#D4A373]"
                    : "bg-[#4A3728] border-[#5C4535]"
                }`}
              >
                <Text
                  className={`font-bold text-xs ${selectedTab === tab ? "text-[#2C1E11]" : "text-[#D4A373]"}`}
                >
                  {tab}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Orders List */}
        <ScrollView
          className="flex-1 px-6"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {filteredOrders.length === 0 ? (
            <View className="items-center justify-center mt-20 opacity-50">
              <Coffee size={48} color="#D4A373" />
              <Text className="text-[#8D7B6D] font-bold mt-4 text-lg">
                No orders found
              </Text>
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
                  <View
                    className={`h-1.5 w-full`}
                    style={{ backgroundColor: config.text }}
                  />

                  <View className="p-5">
                    {/* Top Row: ID & Time */}
                    <View className="flex-row justify-between items-center mb-3">
                      <View className="flex-row items-center">
                        <View className="bg-[#2C1E11] px-2 py-1 rounded-md mr-2">
                          <Text className="text-[#D4A373] font-black text-xs">
                            #{order.id}
                          </Text>
                        </View>
                        <Text className="text-[#9CA3AF] text-xs font-semibold">
                          {order.time}
                        </Text>
                      </View>

                      <View
                        style={{
                          backgroundColor: config.bg,
                          borderColor: config.border,
                        }}
                        className="flex-row items-center px-2.5 py-1 rounded-lg border"
                      >
                        <SIcon size={12} color={config.text} />
                        <Text
                          style={{ color: config.text }}
                          className="text-[10px] font-black uppercase ml-1.5"
                        >
                          {order.status}
                        </Text>
                      </View>
                    </View>

                    {/* Customer */}
                    <Text className="text-[#1F2937] text-xl font-black mb-3">
                      {order.customer}
                    </Text>

                    {/* Dotted Line Divider */}
                    <View
                      className="h-[1px] w-full bg-[#E5E7EB] mb-4 border-dashed border-t border-[#D1D5DB]"
                      style={{ borderStyle: "dashed" }}
                    />

                    {/* Items List */}
                    <View className="space-y-2 mb-4">
                      {order.items.map((item, idx) => (
                        <View key={idx} className="flex-row items-start">
                          <View className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#D4A373] mr-2.5" />
                          <Text className="text-[#4B5563] font-medium text-sm flex-1 leading-5">
                            {item}
                          </Text>
                        </View>
                      ))}
                    </View>

                    {/* Footer Actions */}
                    <View className="flex-row items-center justify-between mt-2 pt-2">
                      <Text className="text-[#2C1E11] text-lg font-black">
                        {order.total}
                      </Text>

                      <View className="flex-row items-center">
                        {order.status === "Preparing" && (
                          <Pressable
                            onPress={() => updateOrderStatus(order.id, "Ready")}
                            className="bg-[#2C1E11] px-4 py-2.5 rounded-xl shadow-md active:opacity-90 mr-2"
                          >
                            <Text className="text-[#D4A373] font-bold text-xs uppercase">
                              Mark Ready
                            </Text>
                          </Pressable>
                        )}
                        {order.status === "Ready" && (
                          <Pressable
                            onPress={() =>
                              updateOrderStatus(order.id, "Delivered")
                            }
                            className="bg-[#059669] px-4 py-2.5 rounded-xl shadow-md active:opacity-90 flex-row items-center mr-2"
                          >
                            <Text className="text-white font-bold text-xs uppercase mr-1">
                              Complete
                            </Text>
                            <ChevronRight size={14} color="white" />
                          </Pressable>
                        )}
                        <Pressable
                          onPress={() => openEditModal(order)}
                          className="bg-[#F5F1ED] p-2 rounded-xl border border-[#EDE0D4] mr-2"
                        >
                          <Edit3 size={16} color="#7F5539" />
                        </Pressable>
                        <Pressable
                          onPress={() => handleDeleteOrder(order.id)}
                          className="bg-[#FDF1F0] p-2 rounded-xl border border-[#F5C6C6]"
                        >
                          <Trash2 size={16} color="#BC4749" />
                        </Pressable>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>

        {/* --- Floating Action Button (Add Order) --- */}
        <Pressable
          onPress={openAddModal}
          className="absolute bottom-8 right-8 w-16 h-16 bg-[#2C1E11] rounded-full items-center justify-center shadow-xl shadow-[#2C1E11]/40 border-4 border-white"
        >
          <Plus size={32} color="#D4A373" strokeWidth={3} />
        </Pressable>

        <Modal
          animationType="slide"
          transparent
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View className="flex-1 justify-end bg-black/50">
            <View className="bg-[#FDFBF7] h-[85%] rounded-t-[30px] p-6 shadow-2xl">
              <View className="flex-row justify-between items-center mb-6">
                <View>
                  <Text className="text-[#D4A373] text-xs font-bold uppercase tracking-widest">
                    {isEditing ? "Edit Order" : "Walk-In Customer"}
                  </Text>
                  <Text className="text-[#2C1E11] text-2xl font-black">
                    {isEditing ? "Update Order" : "New Order"}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(false);
                    resetForm();
                  }}
                  className="bg-[#F3F4F6] p-2 rounded-full"
                >
                  <X size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                <Text className="text-[#4B5563] font-bold mb-2">
                  Customer Name
                </Text>
                <TextInput
                  value={customerName}
                  onChangeText={setCustomerName}
                  placeholder="Ex: Guest #12"
                  className="bg-white border border-[#E5E7EB] p-4 rounded-xl text-[#2C1E11] font-semibold mb-6"
                />

                <Text className="text-[#4B5563] font-bold mb-3">
                  Order Status
                </Text>
                <View className="flex-row flex-wrap mb-6">
                  {["Preparing", "Ready", "Delivered", "Cancelled"].map(
                    (status) => (
                      <Pressable
                        key={status}
                        onPress={() =>
                          setSelectedStatus(
                            status as
                              | "Preparing"
                              | "Ready"
                              | "Delivered"
                              | "Cancelled",
                          )
                        }
                        className={`mr-3 mb-3 px-4 py-2 rounded-full border ${selectedStatus === status ? "bg-[#2C1E11] border-[#2C1E11]" : "bg-white border-[#EDE0D4]"}`}
                      >
                        <Text
                          className={`text-xs font-bold uppercase ${selectedStatus === status ? "text-[#D4A373]" : "text-[#7F5539]"}`}
                        >
                          {status}
                        </Text>
                      </Pressable>
                    ),
                  )}
                </View>

                <Text className="text-[#4B5563] font-bold mb-3">
                  Select Items
                </Text>
                <View className="flex-row flex-wrap justify-between mb-6">
                  {menuOptions.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      onPress={() => addItemToOrder(item)}
                      className="w-[48%] bg-white p-3 rounded-xl border border-[#E5E7EB] mb-3 flex-row justify-between items-center shadow-sm"
                    >
                      <View>
                        <Text className="text-[#2C1E11] font-bold">
                          {item.name}
                        </Text>
                        <Text className="text-[#D4A373] font-bold text-xs">
                          ${item.price.toFixed(2)}
                        </Text>
                      </View>
                      <View className="bg-[#F3F4F6] p-1.5 rounded-lg">
                        <Plus size={16} color="#4B5563" />
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text className="text-[#4B5563] font-bold mb-3">
                  Current Cart
                </Text>
                {selectedItems.length === 0 ? (
                  <View className="bg-[#F9FAFB] p-6 rounded-xl items-center border border-dashed border-[#D1D5DB] mb-6">
                    <Text className="text-[#9CA3AF] font-medium">
                      No items selected
                    </Text>
                  </View>
                ) : (
                  <View className="bg-white rounded-xl border border-[#E5E7EB] mb-6 overflow-hidden">
                    {selectedItems.map((item, idx) => (
                      <View
                        key={`${item.id}-${idx}`}
                        className="flex-row justify-between items-center p-4 border-b border-[#F3F4F6]"
                      >
                        <View className="flex-row items-center">
                          <View className="bg-[#2C1E11] w-6 h-6 rounded-full items-center justify-center mr-3">
                            <Text className="text-[#D4A373] text-xs font-bold">
                              {item.qty}
                            </Text>
                          </View>
                          <Text className="text-[#2C1E11] font-medium">
                            {item.name}
                          </Text>
                        </View>
                        <View className="flex-row items-center">
                          <Text className="text-[#4B5563] font-bold mr-4">
                            ${(item.price * item.qty).toFixed(2)}
                          </Text>
                          <TouchableOpacity
                            onPress={() => removeItemFromOrder(item.id)}
                          >
                            <Trash2 size={18} color="#EF4444" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                    <View className="bg-[#F9FAFB] p-4 flex-row justify-between items-center">
                      <Text className="text-[#4B5563] font-bold uppercase text-xs">
                        Total Amount
                      </Text>
                      <Text className="text-[#2C1E11] font-black text-xl">
                        ${calculateTotal()}
                      </Text>
                    </View>
                  </View>
                )}
              </ScrollView>

              <TouchableOpacity
                onPress={handleSaveOrder}
                className="bg-[#2C1E11] p-5 rounded-2xl shadow-lg shadow-[#2C1E11]/30 mt-4 items-center flex-row justify-center"
              >
                <Text className="text-white font-bold text-lg mr-2">
                  {isEditing ? "Update Order" : "Create Ticket"}
                </Text>
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
