import { AuthProvider } from "@/context/AuthContext";
import { LoaderProvider } from "@/context/LoaderContext";
import { MenuProvider } from "@/context/MenuContext";
import { OrderProvider } from "@/context/OrderContext";
import { Stack } from "expo-router";
import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// SafeAreaView from react-native is deprecated
// react-native-safe-area-context is the recommended alternative
// It provides safe gaps on top, left, right, and bottom of the screen

// Like App.tsx
const RootLayout = () => {
  const insets = useSafeAreaInsets();
  // / device safe area values (top, left, right, and bottom)
  console.log(insets);
  return (
    <LoaderProvider>
      <AuthProvider>
        <OrderProvider>
          <MenuProvider>
            <View className="flex-1" style={{ marginTop: insets.top }}>
              {/* Stack renders the currently active screen with navigation capability */}
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="index" />
                <Stack.Screen name="addmenu" options={{ presentation: 'modal' }} />
                <Stack.Screen name="addorder" options={{ presentation: 'modal' }} />
              </Stack>
            </View>
          </MenuProvider>
        </OrderProvider>
      </AuthProvider>
    </LoaderProvider>
  );
};

export default RootLayout;
