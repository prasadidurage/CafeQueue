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
      color: "#3b82f6",
    },
    {
      id: 2,
      title: "Daily Revenue",
      value: "$1,234",
      icon: DollarSign,
      color: "#10b981",
    },
    {
      id: 3,
      title: "Total Customers",
      value: "156",
      icon: Users,
      color: "#8b5cf6",
    },
    {
      id: 4,
      title: "Growth",
      value: "+23%",
      icon: TrendingUp,
      color: "#f59e0b",
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
    <ScrollView className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="bg-blue-600 pt-12 pb-6 px-6 rounded-b-3xl">
        <Text className="text-white text-3xl font-bold">Dashboard</Text>
        <Text className="text-blue-100 mt-2">
          Welcome back, {user?.email?.split("@")[0] || "Admin"}!
        </Text>
      </View>

      {/* Stats Grid */}
      <View className="px-6 -mt-8">
        <View className="flex-row flex-wrap justify-between">
          {stats.map((stat) => (
            <View
              key={stat.id}
              className="bg-white rounded-2xl p-4 mb-4 shadow-sm"
              style={{ width: "48%" }}
            >
              <View
                className="w-12 h-12 rounded-full items-center justify-center mb-3"
                style={{ backgroundColor: `${stat.color}20` }}
              >
                <stat.icon size={24} color={stat.color} />
              </View>
              <Text className="text-2xl font-bold text-slate-900">
                {stat.value}
              </Text>
              <Text className="text-slate-500 text-sm mt-1">{stat.title}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Recent Orders */}
      <View className="px-6 mt-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-xl font-bold text-slate-900">
            Recent Orders
          </Text>
          <Pressable>
            <Text className="text-blue-600 font-semibold">View All</Text>
          </Pressable>
        </View>

        {recentOrders.map((order) => (
          <View
            key={order.id}
            className="bg-white rounded-2xl p-4 mb-3 shadow-sm"
          >
            <View className="flex-row justify-between items-start mb-2">
              <View className="flex-1">
                <Text className="text-slate-900 font-semibold text-base">
                  {order.customer}
                </Text>
                <Text className="text-slate-500 text-sm mt-1">
                  {order.items}
                </Text>
              </View>
              <View
                className="px-3 py-1 rounded-full"
                style={{
                  backgroundColor:
                    order.status === "Ready"
                      ? "#dcfce7"
                      : order.status === "Preparing"
                        ? "#fef3c7"
                        : "#e0e7ff",
                }}
              >
                <Text
                  className="text-xs font-semibold"
                  style={{
                    color:
                      order.status === "Ready"
                        ? "#16a34a"
                        : order.status === "Preparing"
                          ? "#d97706"
                          : "#4f46e5",
                  }}
                >
                  {order.status}
                </Text>
              </View>
            </View>
            <Text className="text-slate-900 font-bold text-lg mt-2">
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
