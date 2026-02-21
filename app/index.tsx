import { Redirect } from "expo-router";
import React from "react";
import "../global.css";
import { useAuth } from "@/context/AuthContext";
import { ActivityIndicator, View } from "react-native";

const Index = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#4A3728" />
      </View>
    );
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)/home" />;
  }

  return <Redirect href="/(auth)/login" />;
};

export default Index;
