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
    Award,
    Coffee
} from "lucide-react-native";
import React from "react";
import { Alert, Pressable, ScrollView, Text, View, StatusBar } from "react-native";

const Profile = () => {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to leave?", [
      { text: "Stay", style: "cancel" },
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
    { id: 1, title: "Account Settings", icon: Settings, color: "#7F5539" },
    { id: 2, title: "Notifications", icon: Bell, color: "#A98467" },
    { id: 3, title: "Privacy & Security", icon: Shield, color: "#606C38" },
    { id: 4, title: "Help & Support", icon: HelpCircle, color: "#B08968" },
  ];

  return (
    <View className="flex-1 bg-[#F5F1ED]">
      <StatusBar barStyle="dark-content" />
      
      {/* --- Creamy Header --- */}
      <View className="bg-[#E6CCB2] pt-16 pb-20 px-8 rounded-b-[60px] shadow-sm">
        <Text className="text-[#7F5539] text-sm font-bold tracking-[3px] uppercase">Staff Profile</Text>
        <Text className="text-[#432818] text-4xl font-black mt-1">Settings</Text>
      </View>

      {/* --- Floating Profile Card --- */}
      <View className="px-6 -mt-16">
        <View className="bg-white rounded-[40px] p-8 shadow-xl shadow-black/5 border border-[#EDE0D4]">
          <View className="items-center">
            {/* Avatar with Ring */}
            <View className="p-1 border-2 border-[#DDBEA9] rounded-full mb-4">
               <View className="bg-[#F5F1ED] w-24 h-24 rounded-full items-center justify-center border-4 border-white shadow-inner">
                 <User size={48} color="#7F5539" strokeWidth={1.5} />
               </View>
            </View>
            
            <Text className="text-[#432818] font-black text-2xl">
              {user?.email?.split("@")[0] || "Chief Barista"}
            </Text>
            
            <View className="flex-row items-center mt-2 bg-[#F5F1ED] px-4 py-1.5 rounded-full">
              <Store size={14} color="#B08968" />
              <Text className="text-[#B08968] font-bold text-[11px] ml-2 uppercase tracking-tighter">
                Main Street Cafe Manager
              </Text>
            </View>
          </View>

          {/* Stats Row */}
          <View className="flex-row mt-8 pt-6 border-t border-[#F5F1ED]">
            <View className="flex-1 items-center">
              <Text className="text-xl font-black text-[#7F5539]">156</Text>
              <Text className="text-[#A98467] text-[10px] font-bold uppercase mt-1">Orders</Text>
            </View>
            <View className="w-[1px] bg-[#EDE0D4] h-8 self-center" />
            <View className="flex-1 items-center">
              <Text className="text-xl font-black text-[#7F5539]">4.8</Text>
              <Text className="text-[#A98467] text-[10px] font-bold uppercase mt-1">Rating</Text>
            </View>
            <View className="w-[1px] bg-[#EDE0D4] h-8 self-center" />
            <View className="flex-1 items-center">
              <Text className="text-xl font-black text-[#7F5539]">$2.4K</Text>
              <Text className="text-[#A98467] text-[10px] font-bold uppercase mt-1">Sales</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 mt-6" showsVerticalScrollIndicator={false}>
        {/* Menu List */}
          <View className="bg-white rounded-[35px] p-4 border border-[#EDE0D4] shadow-sm">
            {menuItems.map((item, index) => (
              <Pressable
                key={item.id}
                className={`flex-row items-center p-4 ${index !== menuItems.length - 1 ? 'border-b border-[#F5F1ED]' : ''}`}
              >
                <View className="w-10 h-10 rounded-2xl items-center justify-center" style={{ backgroundColor: `${item.color}15` }}>
                  <item.icon size={20} color={item.color} />
                </View>
                <Text className="flex-1 text-[#432818] font-bold text-base ml-4">
                  {item.title}
                </Text>
                <ChevronRight size={18} color="#DDBEA9" />
              </Pressable>
            ))}
          </View>

        {/* Logout Section */}
        <Pressable
          onPress={handleLogout}
          className="mt-6 bg-[#6B2737] rounded-[28px] p-5 flex-row items-center justify-center shadow-lg shadow-[#6B2737]/20"
        >
          <LogOut size={20} color="white" strokeWidth={2.5} />
          <Text className="text-white font-black text-base ml-3 uppercase tracking-wider">
            Sign Out
          </Text>
        </Pressable>
        
        <Text className="text-center text-[#B08968] text-[10px] font-bold mt-8 uppercase tracking-[2px]">
          CafeQueue v2.0.4 • 2026
        </Text>
        <View className="h-12" />
      </ScrollView>
    </View>
  );
};

export default Profile;