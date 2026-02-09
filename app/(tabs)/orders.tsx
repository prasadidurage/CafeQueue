import { CheckCircle, Clock, Package, XCircle } from "lucide-react-native";
import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

const Orders = () => {
  const [selectedTab, setSelectedTab] = useState("All");

  const orders = [
    {
      id: "#ORD-001",
      customer: "John Doe",
      items: ["2x Espresso", "1x Croissant"],
      total: "$10.50",
      status: "Preparing",
      time: "5 mins ago",
    },
    {
      id: "#ORD-002",
      customer: "Jane Smith",
      items: ["1x Latte", "1x Club Sandwich"],
      total: "$12.50",
      status: "Ready",
      time: "10 mins ago",
    },
    {
      id: "#ORD-003",
      customer: "Mike Johnson",
      items: ["3x Cappuccino"],
      total: "$13.50",
      status: "Delivered",
      time: "25 mins ago",
    },
    {
      id: "#ORD-004",
      customer: "Sarah Williams",
      items: ["1x Green Tea", "2x Muffin"],
      total: "$8.50",
      status: "Cancelled",
      time: "30 mins ago",
    },
    {
      id: "#ORD-005",
      customer: "David Brown",
      items: ["2x Latte", "1x Caesar Salad"],
      total: "$15.00",
      status: "Preparing",
      time: "2 mins ago",
    },
  ];

  const tabs = ["All", "Preparing", "Ready", "Delivered", "Cancelled"];

  const filteredOrders =
    selectedTab === "All"
      ? orders
      : orders.filter((order) => order.status === selectedTab);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Preparing":
        return <Clock size={20} color="#d97706" />;
      case "Ready":
        return <Package size={20} color="#16a34a" />;
      case "Delivered":
        return <CheckCircle size={20} color="#4f46e5" />;
      case "Cancelled":
        return <XCircle size={20} color="#dc2626" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Preparing":
        return { bg: "#fef3c7", text: "#d97706" };
      case "Ready":
        return { bg: "#dcfce7", text: "#16a34a" };
      case "Delivered":
        return { bg: "#e0e7ff", text: "#4f46e5" };
      case "Cancelled":
        return { bg: "#fee2e2", text: "#dc2626" };
      default:
        return { bg: "#f1f5f9", text: "#64748b" };
    }
  };

  return (
    <View className="flex-1 bg-[#FDFBF7]">
      {/* Header */}
      <View className="bg-[#4A3728] pt-12 pb-6 px-6 rounded-b-3xl">
        <Text className="text-[#FDFBF7] text-3xl font-bold">Orders</Text>
        <Text className="text-[#E0D7D0] mt-2">Track and manage orders</Text>
      </View>

      {/* Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="px-6 mt-4"
      >
        {tabs.map((tab) => (
          <Pressable
            key={tab}
            onPress={() => setSelectedTab(tab)}
            className={`px-4 py-2 rounded-full mr-2 ${
              selectedTab === tab
                ? "bg-[#4A3728]"
                : "bg-white/90 border border-[#E0D7D0]"
            }`}
          >
            <Text
              className={`font-semibold ${
                selectedTab === tab ? "text-[#FDFBF7]" : "text-[#8D7B6D]"
              }`}
            >
              {tab}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Orders List */}
      <ScrollView className="flex-1 px-6 mt-4">
        {filteredOrders.map((order) => {
          const statusColor = getStatusColor(order.status);
          return (
            <View
              key={order.id}
              className="bg-white/90 rounded-2xl p-4 mb-3 shadow-sm border border-[#E0D7D0]"
            >
              <View className="flex-row justify-between items-start mb-3">
                <View>
                  <Text className="text-[#4A3728] font-bold text-lg">
                    {order.id}
                  </Text>
                  <Text className="text-[#8D7B6D] text-sm mt-1">
                    {order.customer}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  {getStatusIcon(order.status)}
                  <View
                    className="ml-2 px-3 py-1 rounded-full"
                    style={{ backgroundColor: statusColor.bg }}
                  >
                    <Text
                      className="text-xs font-semibold"
                      style={{ color: statusColor.text }}
                    >
                      {order.status}
                    </Text>
                  </View>
                </View>
              </View>

              <View className="border-t border-[#E0D7D0] pt-3">
                {order.items.map((item, index) => (
                  <Text key={index} className="text-[#8D7B6D] text-sm mb-1">
                    • {item}
                  </Text>
                ))}
              </View>

              <View className="flex-row justify-between items-center mt-3 pt-3 border-t border-[#E0D7D0]">
                <Text className="text-[#8D7B6D] text-sm">{order.time}</Text>
                <Text className="text-[#4A3728] font-bold text-lg">
                  {order.total}
                </Text>
              </View>

              {order.status === "Preparing" && (
                <View className="flex-row mt-3 space-x-2">
                  <Pressable className="flex-1 bg-[#A6AE91] py-2 rounded-xl mr-2">
                    <Text className="text-[#FDFBF7] text-center font-semibold">
                      Mark Ready
                    </Text>
                  </Pressable>
                  <Pressable className="flex-1 bg-[#D32F2F] py-2 rounded-xl">
                    <Text className="text-[#FDFBF7] text-center font-semibold">
                      Cancel
                    </Text>
                  </Pressable>
                </View>
              )}

              {order.status === "Ready" && (
                <Pressable className="mt-3 bg-[#4A3728] py-2 rounded-xl">
                  <Text className="text-[#FDFBF7] text-center font-semibold">
                    Mark Delivered
                  </Text>
                </Pressable>
              )}
            </View>
          );
        })}
        <View className="h-8" />
      </ScrollView>
    </View>
  );
};

export default Orders;
