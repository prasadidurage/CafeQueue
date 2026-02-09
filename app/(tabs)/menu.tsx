import { Plus, Search } from "lucide-react-native";
import React, { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";

const Menu = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const menuItems = [
    {
      id: 1,
      name: "Espresso",
      category: "Coffee",
      price: "$3.50",
      available: true,
    },
    {
      id: 2,
      name: "Cappuccino",
      category: "Coffee",
      price: "$4.50",
      available: true,
    },
    {
      id: 3,
      name: "Latte",
      category: "Coffee",
      price: "$4.00",
      available: true,
    },
    {
      id: 4,
      name: "Club Sandwich",
      category: "Food",
      price: "$8.50",
      available: true,
    },
    {
      id: 5,
      name: "Caesar Salad",
      category: "Food",
      price: "$7.00",
      available: false,
    },
    {
      id: 6,
      name: "Blueberry Muffin",
      category: "Bakery",
      price: "$3.00",
      available: true,
    },
    {
      id: 7,
      name: "Croissant",
      category: "Bakery",
      price: "$3.50",
      available: true,
    },
    {
      id: 8,
      name: "Green Tea",
      category: "Tea",
      price: "$2.50",
      available: true,
    },
  ];

  const categories = ["All", "Coffee", "Food", "Bakery", "Tea"];
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredItems = menuItems.filter(
    (item) =>
      (selectedCategory === "All" || item.category === selectedCategory) &&
      item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <View className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="bg-blue-600 pt-12 pb-6 px-6 rounded-b-3xl">
        <Text className="text-white text-3xl font-bold">Menu</Text>
        <Text className="text-blue-100 mt-2">Manage your cafe items</Text>
      </View>

      <ScrollView className="flex-1">
        {/* Search Bar */}
        <View className="px-6 mt-4">
          <View className="flex-row items-center bg-white border border-slate-200 p-3 rounded-2xl">
            <Search size={20} color="#64748b" />
            <TextInput
              placeholder="Search menu items..."
              className="flex-1 ml-3 text-slate-800"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Category Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-6 mt-4"
        >
          {categories.map((category) => (
            <Pressable
              key={category}
              onPress={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full mr-2 ${
                selectedCategory === category ? "bg-blue-600" : "bg-white"
              }`}
            >
              <Text
                className={`font-semibold ${
                  selectedCategory === category
                    ? "text-white"
                    : "text-slate-600"
                }`}
              >
                {category}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Menu Items */}
        <View className="px-6 mt-4">
          {filteredItems.map((item) => (
            <View
              key={item.id}
              className="bg-white rounded-2xl p-4 mb-3 shadow-sm"
            >
              <View className="flex-row justify-between items-start">
                <View className="flex-1">
                  <Text className="text-slate-900 font-bold text-lg">
                    {item.name}
                  </Text>
                  <Text className="text-slate-500 text-sm mt-1">
                    {item.category}
                  </Text>
                  <Text className="text-blue-600 font-bold text-xl mt-2">
                    {item.price}
                  </Text>
                </View>
                <View className="items-end">
                  <View
                    className={`px-3 py-1 rounded-full ${
                      item.available ? "bg-green-100" : "bg-red-100"
                    }`}
                  >
                    <Text
                      className={`text-xs font-semibold ${
                        item.available ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {item.available ? "Available" : "Out of Stock"}
                    </Text>
                  </View>
                  <Pressable className="mt-3 bg-blue-600 px-4 py-2 rounded-xl">
                    <Text className="text-white font-semibold">Edit</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View className="h-8" />
      </ScrollView>

      {/* Floating Add Button */}
      <Pressable className="absolute bottom-6 right-6 bg-blue-600 w-16 h-16 rounded-full items-center justify-center shadow-lg">
        <Plus size={28} color="white" />
      </Pressable>
    </View>
  );
};

export default Menu;
