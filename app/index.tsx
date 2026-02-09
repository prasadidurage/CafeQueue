import { useAuth } from "@/context/AuthContext";
import { Redirect } from "expo-router";
import React from "react";
import { ActivityIndicator, View } from "react-native";
import "../global.css";

const Index = () => {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#4ade80" />
      </View>
    );
  }

  if (user) {
    return <Redirect href="/" />;
  } else {
    return <Redirect href="/login" />;
  }
};

export default Index;
