import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  Pressable, 
  TouchableWithoutFeedback, 
  Keyboard,
  SafeAreaView 
} from "react-native";
import { useRouter } from "expo-router";
import { Coffee, Mail, Lock, ChevronRight } from "lucide-react-native";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className="flex-1 bg-[#FDFBF7]"> 
        {/* Decorative Shapes - Coffee Theme Colors */}
        <View className="absolute -top-10 -left-10 w-40 h-40 bg-[#4A3728] rounded-full opacity-10" />
        <View className="absolute top-40 -right-20 w-64 h-64 bg-[#A6AE91] rounded-full opacity-20" />
        <View className="absolute bottom-[-50] left-[-20] w-80 h-80 bg-[#D7CCC8] rounded-full opacity-30" />

        <View className="flex-1 justify-center px-8">
          {/* Header Section */}
          <View className="items-center mb-12">
            <View className="bg-[#4A3728] p-5 rounded-[30px] mb-5 shadow-lg shadow-[#4A3728]/40">
              <Coffee color="#FDFBF7" size={38} strokeWidth={1.5} />
            </View>
            <Text className="text-4xl font-extrabold text-[#2C1B10] tracking-tight">
              CafeQueue
            </Text>
            <Text className="text-[#6D5D50] mt-2 font-medium tracking-wide">
              SMART FOOD MANAGEMENT
            </Text>
          </View>

          {/* Form Section */}
          <View className="space-y-5">
            {/* Email Input */}
            <View className="bg-white/80 border border-[#E0D7D0] flex-row items-center p-4 rounded-2xl shadow-sm">
              <Mail size={20} color="#8D7B6D" />
              <TextInput
                placeholder="Work Email"
                placeholderTextColor="#A69080"
                className="flex-1 ml-4 text-[#4A3728] font-medium"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
              />
            </View>

            {/* Password Input */}
            <View className="bg-white/80 border border-[#E0D7D0] flex-row items-center p-4 rounded-2xl shadow-sm mt-4">
              <Lock size={20} color="#8D7B6D" />
              <TextInput
                placeholder="Password"
                placeholderTextColor="#A69080"
                secureTextEntry
                className="flex-1 ml-4 text-[#4A3728] font-medium"
                value={password}
                onChangeText={setPassword}
              />
            </View>

            {/* Login Button */}
            <Pressable 
              onPress={() => router.replace("/home")}
              style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}
              className="bg-[#4A3728] flex-row justify-center items-center p-5 rounded-2xl shadow-xl shadow-[#4A3728]/30 mt-8"
            >
              <Text className="text-[#FDFBF7] text-center font-bold text-lg mr-2">
                Sign In to Workspace
              </Text>
              <ChevronRight color="#FDFBF7" size={20} />
            </Pressable>

            {/* Register Link */}
            <View className="flex-row justify-center mt-8">
              <Text className="text-[#8D7B6D]">New to CafeQueue? </Text>
              <Pressable onPress={() => router.push("/register")}>
                <Text className="text-[#A6AE91] font-bold">Create Account</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Footer Accent */}
        <View className="items-center pb-8">
          <Text className="text-[#D7CCC8] font-semibold text-xs tracking-[2px]">
            PREMIUM CAFE SOLUTIONS
          </Text>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default Login;