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
    <View className="flex-1 bg-[#FDFBF7]">
      {/* Header */}
      <View className="bg-[#4A3728] pt-12 pb-6 px-6 rounded-b-3xl">
        <Text className="text-[#FDFBF7] text-3xl font-bold">Menu</Text>
        <Text className="text-[#E0D7D0] mt-2">Manage your cafe items</Text>
      </View>

      <ScrollView className="flex-1">
        {/* Search Bar */}
        <View className="px-6 mt-4">
          <View className="flex-row items-center bg-white/90 border border-[#E0D7D0] p-3 rounded-2xl">
            <Search size={20} color="#8D7B6D" />
            <TextInput
              placeholder="Search menu items..."
              placeholderTextColor="#A69080"
              className="flex-1 ml-3 text-[#4A3728]"
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
                selectedCategory === category
                  ? "bg-[#4A3728]"
                  : "bg-white/90 border border-[#E0D7D0]"
              }`}
            >
              <Text
                className={`font-semibold ${
                  selectedCategory === category
                    ? "text-[#FDFBF7]"
                    : "text-[#8D7B6D]"
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
              className="bg-white/90 rounded-2xl p-4 mb-3 shadow-sm border border-[#E0D7D0]"
            >
              <View className="flex-row justify-between items-start">
                <View className="flex-1">
                  <Text className="text-[#4A3728] font-bold text-lg">
                    {item.name}
                  </Text>
                  <Text className="text-[#8D7B6D] text-sm mt-1">
                    {item.category}
                  </Text>
                  <Text className="text-[#A6AE91] font-bold text-xl mt-2">
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
                  <Pressable className="mt-3 bg-[#4A3728] px-4 py-2 rounded-xl">
                    <Text className="text-[#FDFBF7] font-semibold">Edit</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View className="h-8" />
      </ScrollView>

      {/* Floating Add Button */}
      <Pressable className="absolute bottom-6 right-6 bg-[#4A3728] w-16 h-16 rounded-full items-center justify-center shadow-lg">
        <Plus size={28} color="#FDFBF7" />
      </Pressable>
    </View>
  );
};

export default Menu;
