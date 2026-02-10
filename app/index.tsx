import { useAuth } from "@/context/AuthContext";
import { Redirect } from "expo-router";
import React from "react";
import { ActivityIndicator, View } from "react-native";
import "../global.css";

const Index = () => {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#F9F5F0]">
        <ActivityIndicator size="large" color="#D4A373" />
      </View>
    );
  }

  if (user) {
    return <Redirect href="/(tabs)/home" />;
  } else {
    return <Redirect href="/(auth)/login" />;
  }
};

export default Index;
