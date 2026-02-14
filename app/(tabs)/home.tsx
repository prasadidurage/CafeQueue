import { useAuth } from "@/hooks/useAuth";
import { useOrders } from "@/context/OrderContext";
import { CheckCircle2, Clock, DollarSign, ShoppingBag, TrendingUp, User, Bell } from "lucide-react-native";
import React, { useState, useEffect } from "react";
import { Dimensions, ImageBackground, Pressable, ScrollView, StatusBar, Text, View } from "react-native";
import Animated, { FadeInDown, FadeInRight, FadeIn, FadeOut } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get('window');

const Home = () => {
  const { user } = useAuth();
  const { orders } = useOrders();

  // Compute stats from real orders
  const totalRevenue = orders.reduce((acc, order) => {
    const price = parseFloat(order.total.replace('$', '').replace(',', ''));
    return acc + (isNaN(price) ? 0 : price);
  }, 0);

  const totalOrders = orders.length;
  const pendingCount = orders.filter(o => o.status === 'Preparing').length;
  // Considering 'Ready' and 'Delivered' as "Done" or processed for this stat, or just Delivered? 
  // Let's say Done = Ready + Delivered + Cancelled to show cleared from queue? 
  // Or typically Done means completed successfully. Let's use Ready + Delivered.
  const doneCount = orders.filter(o => o.status === 'Ready' || o.status === 'Delivered').length;

  const stats = [
    { id: 1, label: "Revenue", value: `$${totalRevenue.toFixed(2)}`, icon: DollarSign, color: "#D4A373", trend: "+12%" }, // Trend is still hardcoded for now
    { id: 2, label: "Orders", value: totalOrders.toString(), icon: ShoppingBag, color: "#A6AE91", trend: "+5%" },
    { id: 3, label: "Pending", value: pendingCount.toString(), icon: Clock, color: "#E6B8A2", trend: "Active" },
    { id: 4, label: "Done", value: doneCount.toString(), icon: CheckCircle2, color: "#9CA3AF", trend: "Completed" },
  ];

  const recentOrders = orders
    .filter(order => order.status === 'Preparing')
    .slice(0, 5);

  const slideshowImages = [
    { id: 1, uri: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1887&auto=format&fit=crop", title: "Freshly Brewed", sub: "Premium Arabica" },
    { id: 2, uri: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?q=80&w=2071&auto=format&fit=crop", title: "Luxury Space", sub: "Cozy & Warm" },
    { id: 3, uri: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2070&auto=format&fit=crop", title: "Baked Daily", sub: "Sweet Treats" },
  ];

  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slideshowImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Preparing': return { bg: '#FEF3C7', text: '#D97706' };
      case 'Ready': return { bg: '#D1FAE5', text: '#059669' };
      case 'Delivered': return { bg: '#F3F4F6', text: '#374151' };
      case 'Cancelled': return { bg: '#FEF2F2', text: '#EF4444' };
      default: return { bg: '#F3F4F6', text: '#4B5563' };
    }
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <ScrollView showsVerticalScrollIndicator={false} bounces={false} contentContainerStyle={{ paddingBottom: 100 }}>

        {/* --- Hero Section with Animated Slideshow --- */}
        <View style={{ height: height * 0.55 }} className="relative">
          <Animated.View
            key={activeSlide}
            entering={FadeIn.duration(1500)}
            exiting={FadeOut.duration(1000)}
            className="absolute inset-0"
          >
            <ImageBackground
              source={{ uri: slideshowImages[activeSlide].uri }}
              style={{ width, height: '100%' }}
              resizeMode="cover"
            >
              <View className="absolute inset-0 bg-black/40" />
            </ImageBackground>
          </Animated.View>

          {/* Overlay Content */}
          <SafeAreaView className="flex-1 px-6 justify-between">
            <View className="flex-row justify-between items-center pt-4">
              <View className="bg-white/20 p-2.5 rounded-2xl border border-white/30 backdrop-blur-md">
                <User size={22} color="white" />
              </View>
              <View className="bg-white/20 p-2.5 rounded-2xl border border-white/30 backdrop-blur-md">
                <Bell size={22} color="white" />
              </View>
            </View>

            <View className="pb-12">
              <Animated.Text entering={FadeInDown.delay(300).duration(800)} className="text-white/80 font-bold uppercase tracking-[4px] text-[10px] mb-2">
                Premium Coffee Management
              </Animated.Text>
              <Animated.Text entering={FadeInDown.delay(500).duration(800)} className="text-white text-5xl font-black leading-[52px]">
                Welcome Back,{'\n'}
                <Text className="text-[#D4A373]">{user?.email?.split('@')[0] || 'Barista'}</Text>
              </Animated.Text>

              {/* Daily Target Floating Widget */}
              <Animated.View entering={FadeInRight.delay(800)} className="mt-8 flex-row items-center bg-white/10 p-4 rounded-[28px] border border-white/20 backdrop-blur-xl self-start">
                <View className="bg-[#D4A373] p-2.5 rounded-full mr-4 shadow-lg shadow-[#D4A373]/40">
                  <TrendingUp size={20} color="white" />
                </View>
                <View className="pr-4">
                  <Text className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Today's Target</Text>
                  <Text className="text-white text-xl font-bold">$1,250 <Text className="text-[#D4A373] text-sm">(85%)</Text></Text>
                </View>
              </Animated.View>
            </View>
          </SafeAreaView>
        </View>

        {/* --- Content Body (Moved Up to overlap slightly) --- */}
        <View className="bg-white rounded-t-[50px] -mt-12 pt-10">

          {/* Section: Performance Summary */}
          <View className="px-6 mb-8">
            <View className="flex-row justify-between items-end mb-5">
              <Text className="text-[#2C1E11] text-2xl font-black">Performance</Text>
              <Text className="text-[#D4A373] font-bold text-xs uppercase tracking-tighter">View Detailed Analytics</Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-6 px-6">
              {stats.map((stat, idx) => (
                <Animated.View
                  key={stat.id}
                  entering={FadeInRight.delay(idx * 150)}
                  className="bg-[#F9F5F0] p-6 rounded-[35px] mr-4 border border-[#F0E6DA]"
                  style={{ width: width * 0.45 }}
                >
                  <View className="bg-white p-3 rounded-2xl self-start mb-4 shadow-sm border border-[#F0E6DA]">
                    <stat.icon size={22} color={stat.color} />
                  </View>
                  <Text className="text-[#A98467] text-xs font-bold uppercase mb-1">{stat.label}</Text>
                  <Text className="text-[#2C1E11] text-2xl font-black">{stat.value}</Text>
                  <View className="mt-3 bg-[#E6E6E6]/50 self-start px-2 py-1 rounded-lg">
                    <Text className="text-[#4A3728] text-[10px] font-black">{stat.trend}</Text>
                  </View>
                </Animated.View>
              ))}
            </ScrollView>
          </View>

          {/* Section: Live Feed */}
          <View className="px-6 mb-10">
            <View className="flex-row justify-between items-center mb-5">
              <Text className="text-[#2C1E11] text-2xl font-black">Live Feed</Text>
              <Pressable className="bg-[#2C1E11] px-4 py-2 rounded-full">
                <Text className="text-white text-[10px] font-bold uppercase">All Orders</Text>
              </Pressable>
            </View>

            {recentOrders.length === 0 ? (
              <View className="items-center justify-center py-10 opacity-50">
                <Text className="text-[#8D7B6D] font-bold">No recent orders</Text>
              </View>
            ) : (
              recentOrders.map((order, idx) => {
                const statusStyle = getStatusColor(order.status);
                // Simple display of items (comma separated string)
                const displayItems = order.items.join(', ');

                return (
                  <Animated.View
                    key={order.id}
                    entering={FadeInDown.delay(600 + (idx * 100))}
                    className="bg-white p-5 rounded-[30px] mb-4 shadow-sm border border-[#F3F4F6] flex-row items-center"
                  >
                    <View className="h-14 w-14 bg-[#F9F5F0] rounded-[20px] items-center justify-center mr-4 border border-[#F0E6DA]">
                      <Text className="text-[#D4A373] font-black text-xs">#{order.id.slice(-4)}</Text>
                    </View>
                    <View className="flex-1">
                      <View className="flex-row justify-between items-center mb-1">
                        <Text className="text-[#2C1E11] font-bold text-lg">{order.customer}</Text>
                        <Text className="text-[#9CA3AF] text-[10px] font-medium">{order.time}</Text>
                      </View>
                      <Text className="text-[#8D7B6D] text-xs mb-3 font-medium" numberOfLines={1}>{displayItems}</Text>
                      <View className="flex-row justify-between items-center">
                        <Text className="text-[#2C1E11] font-black text-base">{order.total}</Text>
                        <View style={{ backgroundColor: statusStyle.bg }} className="px-3 py-1.5 rounded-full">
                          <Text style={{ color: statusStyle.text }} className="text-[9px] font-black uppercase tracking-widest">{order.status}</Text>
                        </View>
                      </View>
                    </View>
                  </Animated.View>
                );
              })
            )}
          </View>

        </View>
      </ScrollView>
    </View>
  );
};

export default Home;