import { useAuth } from "@/hooks/useAuth";
import { logout } from "@/services/authService";
import { useRouter } from "expo-router";
import {
    Bell,
    ChevronRight,
    HelpCircle,
    LogOut,
    Mail,
    Settings,
    Shield,
    Store,
    User,
} from "lucide-react-native";
import React from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";

const Profile = () => {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();
            router.replace("/login");
          } catch (error) {
            console.error("Logout error:", error);
            Alert.alert("Error", "Failed to logout. Please try again.");
          }
        },
      },
    ]);
  };

  const menuItems = [
    { id: 1, title: "Account Settings", icon: Settings, color: "#4A3728" },
    { id: 2, title: "Notifications", icon: Bell, color: "#A6AE91" },
    { id: 3, title: "Help & Support", icon: HelpCircle, color: "#8D7B6D" },
    { id: 4, title: "Privacy & Security", icon: Shield, color: "#A69080" },
  ];

  return (
    <ScrollView className="flex-1 bg-[#FDFBF7]">
      {/* Header */}
      <View className="bg-[#4A3728] pt-12 pb-8 px-6 rounded-b-3xl">
        <Text className="text-[#FDFBF7] text-3xl font-bold">Profile</Text>
        <Text className="text-[#E0D7D0] mt-2">Manage your account</Text>
      </View>

      {/* Profile Card */}
      <View className="px-6 -mt-12">
        <View className="bg-white/90 rounded-2xl p-6 shadow-lg border border-[#E0D7D0]">
          <View className="items-center">
            <View className="bg-[#E0D7D0] w-20 h-20 rounded-full items-center justify-center mb-4">
              <User size={40} color="#4A3728" />
            </View>
            <Text className="text-[#4A3728] font-bold text-xl">
              {user?.email?.split("@")[0] || "Admin User"}
            </Text>
            <View className="flex-row items-center mt-2">
              <Mail size={16} color="#8D7B6D" />
              <Text className="text-[#8D7B6D] ml-2">
                {user?.email || "admin@cafequeue.com"}
              </Text>
            </View>
            <View className="flex-row items-center mt-1">
              <Store size={16} color="#8D7B6D" />
              <Text className="text-[#8D7B6D] ml-2">CafeQueue Manager</Text>
            </View>
          </View>

          <View className="flex-row mt-6 pt-6 border-t border-[#E0D7D0]">
            <View className="flex-1 items-center">
              <Text className="text-2xl font-bold text-[#4A3728]">156</Text>
              <Text className="text-[#8D7B6D] text-sm mt-1">Orders</Text>
            </View>
            <View className="w-px bg-[#E0D7D0]" />
            <View className="flex-1 items-center">
              <Text className="text-2xl font-bold text-[#4A3728]">4.8</Text>
              <Text className="text-[#8D7B6D] text-sm mt-1">Rating</Text>
            </View>
            <View className="w-px bg-[#E0D7D0]" />
            <View className="flex-1 items-center">
              <Text className="text-2xl font-bold text-[#4A3728]">$2.4K</Text>
              <Text className="text-[#8D7B6D] text-sm mt-1">Revenue</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Menu Items */}
      <View className="px-6 mt-6">
        {menuItems.map((item) => (
          <Pressable
            key={item.id}
            className="bg-white/90 rounded-2xl p-4 mb-3 shadow-sm flex-row items-center border border-[#E0D7D0]"
          >
            <View
              className="w-12 h-12 rounded-full items-center justify-center"
              style={{ backgroundColor: `${item.color}20` }}
            >
              <item.icon size={24} color={item.color} />
            </View>
            <Text className="flex-1 text-[#4A3728] font-semibold text-base ml-4">
              {item.title}
            </Text>
            <ChevronRight size={20} color="#8D7B6D" />
          </Pressable>
        ))}
      </View>

      {/* Logout Button */}
      <View className="px-6 mt-4">
        <Pressable
          onPress={handleLogout}
          className="bg-[#8D534A] rounded-2xl p-4 flex-row items-center justify-center shadow-sm"
        >
          <LogOut size={20} color="#FDFBF7" />
          <Text className="text-[#FDFBF7] font-bold text-base ml-2">
            Logout
          </Text>
        </Pressable>
      </View>

      <View className="h-8" />
    </ScrollView>
  );
};

export default Profile;
