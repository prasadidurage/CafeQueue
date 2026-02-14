import {
  Circle,
  Coffee,
  Dessert,
  Edit3,
  Leaf,
  Plus,
  Sandwich,
  Search,
  Trash2,
  X,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";

import { useMenu } from "@/context/MenuContext";

const { height } = Dimensions.get('window');

const Menu = () => {
  const {
    menuItems,
    addMenuItem,
    updateMenuItem,
    toggleStock,
    deleteMenuItem,
  } = useMenu();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form States
  const [formName, setFormName] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formCategory, setFormCategory] = useState("Coffee");
  const [formAvailable, setFormAvailable] = useState(true);

  const categories = [
    { name: "All", icon: Circle },
    { name: "Coffee", icon: Coffee },
    { name: "Food", icon: Sandwich },
    { name: "Bakery", icon: Dessert },
    { name: "Tea", icon: Leaf },
  ];

  const categoryNames = categories
    .filter((cat) => cat.name !== "All")
    .map((cat) => cat.name);

  const filteredItems = menuItems.filter(
    (item) =>
      (selectedCategory === "All" || item.category === selectedCategory) &&
      item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const resetForm = () => {
    setFormName("");
    setFormPrice("");
    setFormCategory("Coffee");
    setFormAvailable(true);
    setIsEditing(false);
    setEditingId(null);
  };

  const openAddModal = () => {
    resetForm();
    setModalVisible(true);
  };

  const openEditModal = (item: any) => {
    setFormName(item.name);
    setFormPrice(item.price.replace("$", ""));
    setFormCategory(item.category);
    setFormAvailable(item.available);
    setIsEditing(true);
    setEditingId(String(item.id));
    setModalVisible(true);
  };

  const handleSaveItem = async () => {
    if (!formName.trim()) {
      Alert.alert("Required", "Please enter a menu item name.");
      return;
    }

    const normalizedPrice = Number(formPrice.replace(/[^0-9.]/g, ""));
    if (Number.isNaN(normalizedPrice) || normalizedPrice <= 0) {
      Alert.alert("Invalid", "Please enter a valid price.");
      return;
    }

    const formattedPrice = `$${normalizedPrice.toFixed(2)}`;

    if (isEditing && editingId !== null) {
      await updateMenuItem({
        id: editingId,
        name: formName.trim(),
        category: formCategory,
        price: formattedPrice,
        available: formAvailable,
      });
    } else {
      await addMenuItem({
        name: formName.trim(),
        category: formCategory,
        price: formattedPrice,
        available: formAvailable,
      });
    }

    setModalVisible(false);
    resetForm();
  };

  const handleDeleteItem = (id: string) => {
    Alert.alert(
      "Delete item",
      "Are you sure you want to delete this menu item?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => deleteMenuItem(id) },
      ],
    );
  };

  return (
    <View className="flex-1 bg-[#F9F5F0]">
      {/* --- Header Section --- */}
      <View className="bg-[#DDBEA9] pt-16 pb-10 px-8 rounded-b-[60px] shadow-sm">
        <Text className="text-[#582F0E] text-sm font-bold tracking-[3px] uppercase">
          The Bakery
        </Text>
        <Text className="text-[#432818] text-4xl font-black mt-1">
          Our Menu
        </Text>

        {/* Search Bar */}
        <View className="flex-row items-center bg-white/80 mt-6 px-4 py-3 rounded-2xl border border-[#CB997E]/30">
          <Search size={20} color="#A98467" />
          <TextInput
            placeholder="Search your cravings..."
            placeholderTextColor="#CB997E"
            className="flex-1 ml-3 text-[#582F0E] font-medium"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* --- Category Selector --- */}
        <View className="mt-8">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pl-6">
            {categories.map((cat) => (
              <Pressable
                key={cat.name}
                onPress={() => setSelectedCategory(cat.name)}
                className="items-center mr-6"
              >
                <View
                  className={`w-14 h-14 rounded-2xl items-center justify-center shadow-sm ${selectedCategory === cat.name ? "bg-[#7F5539]" : "bg-white border border-[#EDE0D4]"
                    }`}
                >
                  <cat.icon
                    size={24}
                    color={selectedCategory === cat.name ? "#FFF" : "#B08968"}
                  />
                </View>
                <Text
                  className={`text-[11px] font-bold mt-2 uppercase tracking-tighter ${selectedCategory === cat.name ? "text-[#7F5539]" : "text-[#B08968]"
                    }`}
                >
                  {cat.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* --- Menu Grid --- */}
        <View className="px-6 mt-8 flex-row flex-wrap justify-between">
          {filteredItems.map((item) => (
            <View
              key={item.id}
              style={{ width: "48%" }}
              className="bg-white rounded-[35px] p-4 mb-5 shadow-md border border-[#EDE0D4]/50"
            >
              <Pressable
                onPress={() => toggleStock(item.id)}
                className={`self-start px-2 py-1 rounded-full mb-2 ${item.available ? "bg-[#DDE5B6]" : "bg-[#F28482]/20"}`}
              >
                <Text className={`text-[8px] font-black uppercase ${item.available ? "text-[#606C38]" : "text-[#BC4749]"}`}>
                  {item.available ? "In Stock" : "Sold Out"}
                </Text>
              </Pressable>

              <Text className="text-[#432818] font-bold text-lg leading-5" numberOfLines={2}>
                {item.name}
              </Text>
              <Text className="text-[#B08968] text-[10px] font-bold mt-1 uppercase">
                {item.category}
              </Text>

              <View className="flex-row justify-between items-center mt-4">
                <Text className="text-[#7F5539] font-black text-xl">{item.price}</Text>
                <View className="flex-row items-center gap-1">
                  <Pressable onPress={() => openEditModal(item)} className="bg-[#F5F1ED] p-2 rounded-xl border border-[#EDE0D4]">
                    <Edit3 size={16} color="#7F5539" />
                  </Pressable>
                  <Pressable onPress={() => handleDeleteItem(item.id)} className="bg-[#FDF1F0] p-2 rounded-xl border border-[#F5C6C6]">
                    <Trash2 size={16} color="#BC4749" />
                  </Pressable>
                </View>
              </View>
            </View>
          ))}
        </View>
        <View className="h-24" />
      </ScrollView>

      {/* --- Floating Action Button (FAB) --- */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={openAddModal}
        className="absolute bg-[#7F5539] w-16 h-16 rounded-full items-center justify-center shadow-2xl border-4 border-[#F9F5F0]"
        style={{ elevation: 10, zIndex: 999, bottom: 120, right: 24 }}
      >
        <Plus size={32} color="white" strokeWidth={3} />
      </TouchableOpacity>

      {/* --- Modern Centered Add/Edit Modal --- */}
      <Modal
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/60 px-6">
          <Animated.View
            entering={FadeInDown.duration(400)}
            className="bg-[#FDFBF7] w-full rounded-[40px] p-8 shadow-2xl"
            style={{ maxHeight: height * 0.8 }}
          >
            {/* Modal Header */}
            <View className="flex-row items-center justify-between mb-8">
              <View>
                <Text className="text-[#A98467] text-[10px] font-bold uppercase tracking-[3px]">
                  Management
                </Text>
                <Text className="text-[#432818] text-3xl font-black">
                  {isEditing ? "Edit Item" : "Add Item"}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => { setModalVisible(false); resetForm(); }}
                className="bg-[#F3F4F6] p-3 rounded-2xl"
              >
                <X size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Name Input */}
              <View className="mb-6">
                <Text className="text-[#4B5563] text-xs font-bold mb-2 ml-1 uppercase opacity-60">Item Name</Text>
                <TextInput
                  value={formName}
                  onChangeText={setFormName}
                  placeholder="Ex: Caramel Latte"
                  placeholderTextColor="#CBD5E1"
                  className="bg-white border border-[#EDE0D4] p-5 rounded-[20px] text-[#2C1E11] font-bold shadow-sm"
                />
              </View>

              {/* Price Input */}
              <View className="mb-6">
                <Text className="text-[#4B5563] text-xs font-bold mb-2 ml-1 uppercase opacity-60">Price ($)</Text>
                <TextInput
                  value={formPrice}
                  onChangeText={setFormPrice}
                  placeholder="Ex: 4.50"
                  placeholderTextColor="#CBD5E1"
                  keyboardType="decimal-pad"
                  className="bg-white border border-[#EDE0D4] p-5 rounded-[20px] text-[#2C1E11] font-bold shadow-sm"
                />
              </View>

              {/* Category Selection */}
              <Text className="text-[#4B5563] text-xs font-bold mb-3 ml-1 uppercase opacity-60">Category</Text>
              <View className="flex-row flex-wrap mb-6">
                {categoryNames.map((cat) => (
                  <Pressable
                    key={cat}
                    onPress={() => setFormCategory(cat)}
                    className={`mr-2 mb-2 px-5 py-3 rounded-2xl border ${formCategory === cat ? "bg-[#7F5539] border-[#7F5539]" : "bg-white border-[#EDE0D4]"
                      }`}
                  >
                    <Text className={`text-[10px] font-black uppercase tracking-tight ${formCategory === cat ? "text-white" : "text-[#7F5539]"}`}>
                      {cat}
                    </Text>
                  </Pressable>
                ))}
              </View>

              {/* Availability Toggle */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setFormAvailable((prev) => !prev)}
                className={`flex-row items-center justify-center p-5 rounded-[20px] border-2 border-dashed mb-4 ${formAvailable ? "bg-[#F0FDF4] border-[#BBF7D0]" : "bg-[#FEF2F2] border-[#FECACA]"
                  }`}
              >
                <View className={`w-3 h-3 rounded-full mr-3 ${formAvailable ? "bg-[#22C55E]" : "bg-[#EF4444]"}`} />
                <Text className={`font-black text-xs uppercase ${formAvailable ? "text-[#166534]" : "text-[#991B1B]"}`}>
                  {formAvailable ? "Available in Stock" : "Out of Stock"}
                </Text>
              </TouchableOpacity>
            </ScrollView>

            {/* Save Button */}
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={handleSaveItem}
              className="bg-[#7F5539] p-6 rounded-[25px] shadow-xl shadow-[#7F5539]/40 mt-4 items-center"
            >
              <Text className="text-white font-black text-lg uppercase tracking-widest">
                {isEditing ? "Save Changes" : "Confirm & Add"}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

export default Menu;