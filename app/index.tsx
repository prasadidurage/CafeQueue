import React, { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import "../global.css";


export default function App() {
  const [text, setText] = useState("");

  return (
    <View className="flex-1 bg-gray-50 px-6 py-8">
      <Text className="text-3xl font-bold text-gray-900 mb-8 mt-4">
        CafeQueue
      </Text>

      <View className="bg-green-500 rounded-lg shadow-md p-6 mb-6">
        <Text className="text-lg font-semibold text-gray-800 mb-4">
          Welcome to CafeQueue
        </Text>

        <TextInput
          placeholder="Enter your order..."
          value={text}
          onChangeText={setText}
          className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900 mb-6"
          placeholderTextColor="#9ca3af"
        />

        <Text className="text-base text-gray-700 mb-6">
          Your order:{" "}
          <Text className="font-semibold text-blue-600">{text}</Text>
        </Text>

        <Button
          title="Submit Order"
          onPress={() => alert("Order submitted: " + text)}
          color="#2563eb"
        />
      </View>

      <View className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <Text className="text-sm text-blue-900">
          💡 Tip: Type your order details above and submit to get in queue
        </Text>
      </View>
    </View>
  );
}
