import { useAuth } from "@/hooks/useAuth";
import { CheckCircle2, Clock, DollarSign, ShoppingBag, TrendingUp, User } from "lucide-react-native";
import React from "react";
import { Dimensions, Pressable, ScrollView, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get('window');

const Home = () => {
  const { user } = useAuth();

  // Fake Data
  const stats = [
    { id: 1, label: "Total Revenue", value: "$4,289", icon: DollarSign, color: "#D4A373", trend: "+12%" },
    { id: 2, label: "Total Orders", value: "84", icon: ShoppingBag, color: "#A6AE91", trend: "+5%" },
    { id: 3, label: "Pending", value: "12", icon: Clock, color: "#E6B8A2", trend: "Active" },
    { id: 4, label: "Completed", value: "72", icon: CheckCircle2, color: "#9CA3AF", trend: "Done" },
  ];

  const recentOrders = [
    { id: 101, customer: "Alex Morgan", items: "2x Cappuccino, 1x Bagel", total: "$12.50", status: "Preparing", time: "2m ago" },
    { id: 102, customer: "Sarah Connor", items: "1x Iced Latte", total: "$6.00", status: "Ready", time: "5m ago" },
    { id: 103, customer: "James Bond", items: "1x Espresso, 1x Croissant", total: "$8.00", status: "Delivered", time: "12m ago" },
    { id: 104, customer: "Emma Watson", items: "1x Green Tea", total: "$4.50", status: "Cancelled", time: "20m ago" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Preparing': return { bg: '#FEF3C7', text: '#D97706' };
      case 'Ready': return { bg: '#D1FAE5', text: '#059669' };
      case 'Delivered': return { bg: '#F3F4F6', text: '#4B5563' };
      case 'Cancelled': return { bg: '#FEE2E2', text: '#DC2626' };
      default: return { bg: '#F3F4F6', text: '#4B5563' };
    }
  }

  return (
    <View className="flex-1 bg-[#F9F5F0]">
      <StatusBar barStyle="light-content" />

      {/* Top Header Background */}
      <View className="absolute top-0 w-full h-[280px] bg-[#2C1E11] rounded-b-[50px] shadow-lg" />

      <SafeAreaView className="flex-1" edges={['top']}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

          {/* Header Content */}
          <View className="px-6 pt-4 mb-8">
            <View className="flex-row justify-between items-start">
              <View>
                <Text className="text-[#D4A373] font-bold tracking-widest text-xs uppercase mb-1">Cafe Manager</Text>
                <Text className="text-white text-3xl font-black leading-9">
                  Good Morning,{'\n'}
                  <Text className="text-[#D4A373]">{user?.email?.split('@')[0] || 'Barista'}</Text>
                </Text>
              </View>
              <Pressable className="bg-[#4A3728] p-3 rounded-2xl border border-[#D4A373]/30 shadow-lg">
                <User size={24} color="#D4A373" />
              </Pressable>
            </View>

            {/* Context Widget */}
            <View className="mt-6 flex-row items-center bg-[#4A3728]/80 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
              <View className="bg-[#D4A373] p-2 rounded-xl mr-3">
                <TrendingUp size={20} color="#2C1E11" />
              </View>
              <View>
                <Text className="text-white/80 text-xs font-medium">Daily Target</Text>
                <View className="flex-row items-baseline">
                  <Text className="text-white text-xl font-bold">$1,250</Text>
                  <Text className="text-[#D4A373] text-xs ml-2 font-bold">85% achieved</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Stats Grid */}
          <View className="px-6 mb-8">
            <Text className="text-[#2C1E11] text-lg font-black mb-4">Dashboard</Text>
            <View className="flex-row flex-wrap justify-between">
              {stats.map((stat) => (
                <View key={stat.id} style={{ width: width * 0.43 }} className="bg-white p-4 rounded-[24px] mb-4 shadow-sm border border-[#E6E6E6]">
                  <View className="flex-row justify-between items-start mb-3">
                    <View className="p-2.5 rounded-xl" style={{ backgroundColor: `${stat.color}20` }}>
                      <stat.icon size={18} color={stat.color} />
                    </View>
                    <Text className="text-[#9CA3AF] text-[10px] font-bold bg-[#F3F4F6] px-2 py-1 rounded-lg">
                      {stat.trend}
                    </Text>
                  </View>
                  <Text className="text-[#4B5563] text-xs font-semibold mb-0.5">{stat.label}</Text>
                  <Text className="text-[#1F2937] text-2xl font-black">{stat.value}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Quick Actions Removed */}

          {/* Recent Orders List */}
          <View className="px-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-[#2C1E11] text-lg font-black">Live Feed</Text>
              <Text className="text-[#D4A373] text-xs font-bold">See All</Text>
            </View>

            {recentOrders.map((order) => {
              const statusStyle = getStatusColor(order.status);
              return (
                <Pressable key={order.id} className="bg-white p-5 rounded-[24px] mb-3 shadow-sm border border-[#F0F0F0] flex-row items-center">
                  <View className="h-12 w-12 bg-[#F9F5F0] rounded-2xl items-center justify-center mr-4 border border-[#E6E6E6]">
                    <Text className="text-[#4A3728] font-black text-sm">#{order.id}</Text>
                  </View>
                  <View className="flex-1">
                    <View className="flex-row justify-between mb-1">
                      <Text className="text-[#1F2937] font-bold text-base">{order.customer}</Text>
                      <Text className="text-[#9CA3AF] text-[10px] font-medium">{order.time}</Text>
                    </View>
                    <Text className="text-[#6B7280] text-xs mb-2" numberOfLines={1}>{order.items}</Text>
                    <View className="flex-row justify-between items-center">
                      <Text className="text-[#D4A373] font-bold">{order.total}</Text>
                      <View style={{ backgroundColor: statusStyle.bg }} className="px-2.5 py-1 rounded-lg">
                        <Text style={{ color: statusStyle.text }} className="text-[10px] font-bold uppercase">{order.status}</Text>
                      </View>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default Home;