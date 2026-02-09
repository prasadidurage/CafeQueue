import { useAuth } from "@/hooks/useAuth";
import { Clock, DollarSign, TrendingUp, Users } from "lucide-react-native";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

const Home = () => {
  const { user } = useAuth();

  const stats = [
    {
      id: 1,
      title: "Active Orders",
      value: "12",
      icon: Clock,
      color: "#4A3728",
    },
    {
      id: 2,
      title: "Daily Revenue",
      value: "$1,234",
      icon: DollarSign,
      color: "#A6AE91",
    },
    {
      id: 3,
      title: "Total Customers",
      value: "156",
      icon: Users,
      color: "#8D7B6D",
    },
    {
      id: 4,
      title: "Growth",
      value: "+23%",
      icon: TrendingUp,
      color: "#A69080",
    },
  ];

  const recentOrders = [
    {
      id: 1,
      customer: "John Doe",
      items: "2x Coffee, 1x Sandwich",
      total: "$15.50",
      status: "Preparing",
    },
    {
      id: 2,
      customer: "Jane Smith",
      items: "1x Tea, 2x Muffin",
      total: "$12.00",
      status: "Ready",
    },
    {
      id: 3,
      customer: "Mike Johnson",
      items: "3x Coffee",
      total: "$9.00",
      status: "Delivered",
    },
  ];

  return (
    <ScrollView className="flex-1 bg-[#FDFBF7]">
      {/* Header */}
      <View className="bg-[#4A3728] pt-12 pb-6 px-6 rounded-b-3xl">
        <Text className="text-[#FDFBF7] text-3xl font-bold">Dashboard</Text>
        <Text className="text-[#E0D7D0] mt-2">
          Welcome back, {user?.email?.split("@")[0] || "Admin"}!
        </Text>
      </View>

      {/* Stats Grid */}
      <View className="px-6 -mt-8">
        <View className="flex-row flex-wrap justify-between">
          {stats.map((stat) => (
            <View
              key={stat.id}
              className="bg-white/90 rounded-2xl p-4 mb-4 shadow-sm border border-[#E0D7D0]"
              style={{ width: "48%" }}
            >
              <View
                className="w-12 h-12 rounded-full items-center justify-center mb-3"
                style={{ backgroundColor: `${stat.color}20` }}
              >
                <stat.icon size={24} color={stat.color} />
              </View>
              <Text className="text-2xl font-bold text-[#4A3728]">
                {stat.value}
              </Text>
              <Text className="text-[#8D7B6D] text-sm mt-1">{stat.title}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Recent Orders */}
      <View className="px-6 mt-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-xl font-bold text-[#4A3728]">
            Recent Orders
          </Text>
          <Pressable>
            <Text className="text-[#A6AE91] font-semibold">View All</Text>
          </Pressable>
        </View>

        {recentOrders.map((order) => (
          <View
            key={order.id}
            className="bg-white/90 rounded-2xl p-4 mb-3 shadow-sm border border-[#E0D7D0]"
          >
            <View className="flex-row justify-between items-start mb-2">
              <View className="flex-1">
                <Text className="text-[#4A3728] font-semibold text-base">
                  {order.customer}
                </Text>
                <Text className="text-[#8D7B6D] text-sm mt-1">
                  {order.items}
                </Text>
              </View>
              <View
                className="px-3 py-1 rounded-full"
                style={{
                  backgroundColor:
                    order.status === "Ready"
                      ? "#D4E4D7"
                      : order.status === "Preparing"
                        ? "#F5E6D3"
                        : "#E0D7D0",
                }}
              >
                <Text
                  className="text-xs font-semibold"
                  style={{
                    color:
                      order.status === "Ready"
                        ? "#2E5C2E"
                        : order.status === "Preparing"
                          ? "#8B5A00"
                          : "#4A3728",
                  }}
                >
                  {order.status}
                </Text>
              </View>
            </View>
            <Text className="text-[#4A3728] font-bold text-lg mt-2">
              {order.total}
            </Text>
          </View>
        ))}
      </View>

      <View className="h-8" />
    </ScrollView>
  );
};

export default Home;
