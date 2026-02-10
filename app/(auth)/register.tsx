import { useLoader } from "@/hooks/useLoader";
import { registerUser } from "@/services/authService";
import { useRouter } from "expo-router";
import { ChevronLeft, Lock, Mail, User, UserPlus } from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  Keyboard,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const Register = () => {
  const router = useRouter();
  const { showLoader, hideLoader, isLoading } = useLoader();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [conPassword, setConPassword] = useState("");

  const handleRegister = async () => {
    if (isLoading) return;

    if (!name || !email || !password || !conPassword) {
      Alert.alert("Error", "Please fill all fields...!");
      return;
    }
    if (password !== conPassword) {
      Alert.alert("Error", "Passwords do not match...!");
      return;
    }

    try {
      showLoader();
      await registerUser(name, email, password);
      Alert.alert("Success", "Account created successfully!");
      router.replace("/login");
    } catch (err) {
      Alert.alert("Error", "Registration failed. Please try again.");
    } finally {
      hideLoader();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className="flex-1 bg-[#FDFBF7]">
        {/* Background Decorative Circles */}
        <Animated.View entering={FadeInUp.delay(200).duration(1000).springify()} className="absolute -top-20 -right-20 w-64 h-64 bg-[#A6AE91] rounded-full opacity-20 blur-3xl" />
        <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()} className="absolute bottom-20 -left-20 w-72 h-72 bg-[#D7CCC8] rounded-full opacity-30 blur-3xl" />

        <View className="flex-1 justify-center px-8">
          {/* Header */}
          <Animated.View entering={FadeInDown.delay(100).duration(1000).springify()} className="items-center mb-10">
            <View className="bg-[#A6AE91] p-5 rounded-[30px] mb-5 shadow-lg shadow-[#A6AE91]/40">
              <UserPlus color="#FDFBF7" size={38} strokeWidth={1.5} />
            </View>
            <Text className="text-4xl font-extrabold text-[#2C1B10] tracking-tight">
              Join Us
            </Text>
            <Text className="text-[#6D5D50] mt-2 font-medium tracking-wide text-center">
              CREATE YOUR STAFF ACCOUNT
            </Text>
          </Animated.View>

          {/* Form Fields */}
          <View className="space-y-4">
            {/* Name Input */}
            <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()} className="bg-white/80 border border-[#E0D7D0] flex-row items-center p-4 rounded-2xl shadow-sm">
              <User size={20} color="#8D7B6D" />
              <TextInput
                placeholder="Full Name"
                placeholderTextColor="#A69080"
                className="flex-1 ml-4 text-[#4A3728] font-medium"
                value={name}
                onChangeText={setName}
              />
            </Animated.View>

            {/* Email Input */}
            <Animated.View entering={FadeInDown.delay(300).duration(1000).springify()} className="bg-white/80 border border-[#E0D7D0] flex-row items-center p-4 rounded-2xl shadow-sm mt-3">
              <Mail size={20} color="#8D7B6D" />
              <TextInput
                placeholder="Email Address"
                placeholderTextColor="#A69080"
                className="flex-1 ml-4 text-[#4A3728] font-medium"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
              />
            </Animated.View>

            {/* Password Input */}
            <Animated.View entering={FadeInDown.delay(400).duration(1000).springify()} className="bg-white/80 border border-[#E0D7D0] flex-row items-center p-4 rounded-2xl shadow-sm mt-3">
              <Lock size={20} color="#8D7B6D" />
              <TextInput
                placeholder="Password"
                placeholderTextColor="#A69080"
                secureTextEntry
                className="flex-1 ml-4 text-[#4A3728] font-medium"
                value={password}
                onChangeText={setPassword}
              />
            </Animated.View>

            {/* Confirm Password */}
            <Animated.View entering={FadeInDown.delay(500).duration(1000).springify()} className="bg-white/80 border border-[#E0D7D0] flex-row items-center p-4 rounded-2xl shadow-sm mt-3">
              <Lock size={20} color="#8D7B6D" />
              <TextInput
                placeholder="Confirm Password"
                placeholderTextColor="#A69080"
                secureTextEntry
                className="flex-1 ml-4 text-[#4A3728] font-medium"
                value={conPassword}
                onChangeText={setConPassword}
              />
            </Animated.View>

            {/* Register Button */}
            <Animated.View entering={FadeInDown.delay(600).duration(1000).springify()}>
              <Pressable
                onPress={handleRegister}
                disabled={isLoading}
                style={({ pressed }) => [{ opacity: (pressed || isLoading) ? 0.8 : 1 }]}
                className="bg-[#4A3728] p-5 rounded-2xl shadow-xl shadow-[#4A3728]/30 mt-8"
              >
                <Text className="text-[#FDFBF7] text-center font-bold text-lg">
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Text>
              </Pressable>
            </Animated.View>

            {/* Login Link */}
            <Animated.View entering={FadeInDown.delay(700).duration(1000).springify()}>
              <Pressable
                onPress={() => router.back()}
                className="flex-row justify-center items-center mt-8"
              >
                <ChevronLeft size={18} color="#8D7B6D" />
                <Text className="text-[#8D7B6D] ml-1">Already have an account? </Text>
                <Text className="text-[#A6AE91] font-bold underline">Login</Text>
              </Pressable>
            </Animated.View>
          </View>
        </View>

        {/* Brand Label */}
        <Animated.View entering={FadeInDown.delay(800).duration(1000).springify()} className="items-center pb-8">
          <Text className="text-[#D7CCC8] font-semibold text-xs tracking-[2px]">
            CAFEQUEUE STAFF PORTAL
          </Text>
        </Animated.View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default Register;