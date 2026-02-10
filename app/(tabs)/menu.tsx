import { Circle, Coffee, Dessert, Edit3, Leaf, Plus, Sandwich, Search, X } from "lucide-react-native";
import React, { useState } from "react";
import { Alert, Modal, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

const Menu = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [modalVisible, setModalVisible] = useState(false);

  // Form State
  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("Coffee");
  const [newItemAvailable, setNewItemAvailable] = useState(true);

  const [menuItems, setMenuItems] = useState([
    { id: 1, name: "Espresso", category: "Coffee", price: "$3.50", available: true },
    { id: 2, name: "Cappuccino", category: "Coffee", price: "$4.50", available: true },
    { id: 3, name: "Latte", category: "Coffee", price: "$4.00", available: true },
    { id: 4, name: "Club Sandwich", category: "Food", price: "$8.50", available: true },
    { id: 5, name: "Caesar Salad", category: "Food", price: "$7.00", available: false },
    { id: 6, name: "Blueberry Muffin", category: "Bakery", price: "$3.00", available: true },
    { id: 7, name: "Croissant", category: "Bakery", price: "$3.50", available: true },
    { id: 8, name: "Green Tea", category: "Tea", price: "$2.50", available: true },
  ]);

  const categories = [
    { name: "All", icon: Circle },
    { name: "Coffee", icon: Coffee },
    { name: "Food", icon: Sandwich },
    { name: "Bakery", icon: Dessert },
    { name: "Tea", icon: Leaf },
  ];

  const filteredItems = menuItems.filter(
    (item) =>
      (selectedCategory === "All" || item.category === selectedCategory) &&
      item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  /* --- State for Editing --- */
  const [editingItemId, setEditingItemId] = useState<number | null>(null);

  const handleEditItem = (item: any) => {
    setEditingItemId(item.id);
    setNewItemName(item.name);
    setNewItemPrice(item.price.replace('$', '')); // Remove $ for input
    setNewItemCategory(item.category);
    setNewItemAvailable(item.available);
    setModalVisible(true);
  };

  const handleSaveItem = () => {
    if (!newItemName || !newItemPrice) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    const priceFormatted = newItemPrice.startsWith('$') ? newItemPrice : `$${newItemPrice}`;

    if (editingItemId) {
      // Update existing item
      setMenuItems(menuItems.map(item =>
        item.id === editingItemId
          ? { ...item, name: newItemName, price: priceFormatted, category: newItemCategory, available: newItemAvailable }
          : item
      ));
    } else {
      // Add new item
      const newItem = {
        id: menuItems.length + 1,
        name: newItemName,
        category: newItemCategory,
        price: priceFormatted,
        available: newItemAvailable,
      };
      setMenuItems([...menuItems, newItem]);
    }

    closeModal();
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingItemId(null);
    setNewItemName("");
    setNewItemPrice("");
    setNewItemCategory("Coffee");
    setNewItemAvailable(true);
  };

  return (
    <View className="flex-1 bg-[#F9F5F0]">
      {/* --- Elegant Header --- */}
      <View className="bg-[#DDBEA9] pt-16 pb-10 px-8 rounded-b-[60px] shadow-sm">
        <Text className="text-[#582F0E] text-sm font-bold tracking-[3px] uppercase">The Bakery</Text>
        <Text className="text-[#432818] text-4xl font-black mt-1">Our Menu</Text>

        {/* Search Bar Refined */}
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
        {/* --- Luxury Category Icons --- */}
        <View className="mt-8">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pl-6">
            {categories.map((cat) => (
              <Pressable
                key={cat.name}
                onPress={() => setSelectedCategory(cat.name)}
                className="items-center mr-6"
              >
                <View className={`w-14 h-14 rounded-2xl items-center justify-center shadow-sm ${selectedCategory === cat.name ? "bg-[#7F5539]" : "bg-white border border-[#EDE0D4]"
                  }`}>
                  <cat.icon size={24} color={selectedCategory === cat.name ? "#FFF" : "#B08968"} />
                </View>
                <Text className={`text-[11px] font-bold mt-2 uppercase tracking-tighter ${selectedCategory === cat.name ? "text-[#7F5539]" : "text-[#B08968]"
                  }`}>
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
              style={{ width: '48%' }}
              className="bg-white rounded-[35px] p-4 mb-5 shadow-md border border-[#EDE0D4]/50"
            >
              {/* Availability Badge */}
              <View className={`self-start px-2 py-1 rounded-full mb-2 ${item.available ? 'bg-[#DDE5B6]' : 'bg-[#F28482]/20'}`}>
                <Text className={`text-[8px] font-black uppercase ${item.available ? 'text-[#606C38]' : 'text-[#BC4749]'}`}>
                  {item.available ? "In Stock" : "Sold Out"}
                </Text>
              </View>

              <Text className="text-[#432818] font-bold text-lg leading-5" numberOfLines={2}>
                {item.name}
              </Text>
              <Text className="text-[#B08968] text-[10px] font-bold mt-1 uppercase">
                {item.category}
              </Text>

              <View className="flex-row justify-between items-center mt-4">
                <Text className="text-[#7F5539] font-black text-xl">
                  {item.price}
                </Text>
                <Pressable
                  onPress={() => handleEditItem(item)}
                  className="bg-[#F5F1ED] p-2 rounded-xl border border-[#EDE0D4]"
                >
                  <Edit3 size={16} color="#7F5539" />
                </Pressable>
              </View>
            </View>
          ))}
        </View>

        <View className="h-24" />
      </ScrollView>

      {/* --- Aesthetic Floating Button --- */}
      <Pressable
        onPress={() => {
          setEditingItemId(null); // Ensure we're adding a new item
          setNewItemName("");
          setNewItemPrice("");
          setNewItemCategory("Coffee");
          setNewItemAvailable(true);
          setModalVisible(true);
        }}
        className="absolute bottom-10 right-8 bg-[#7F5539] w-16 h-16 rounded-[25px] items-center justify-center shadow-2xl shadow-[#7F5539]/50 border-4 border-[#F9F5F0]"
        style={{ transform: [{ rotate: '45deg' }] }}
      >
        <View style={{ transform: [{ rotate: '-45deg' }] }}>
          <Plus size={30} color="white" />
        </View>
      </Pressable>

      {/* --- Add/Edit Item Modal --- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View className="flex-1 justify-center items-center bg-black/50 px-6">
          <View className="bg-[#F9F5F0] w-full rounded-[40px] p-8 shadow-2xl">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-[#432818] text-2xl font-black">
                {editingItemId ? "Edit Item" : "Add New Item"}
              </Text>
              <TouchableOpacity onPress={closeModal} className="bg-[#E9D8D6] p-2 rounded-full">
                <X size={20} color="#6B2737" />
              </TouchableOpacity>
            </View>

            <View className="space-y-4">
              <View>
                <Text className="text-[#B08968] font-bold uppercase text-xs mb-2">Item Name</Text>
                <TextInput
                  className="bg-white p-4 rounded-2xl border border-[#DDBEA9] text-[#582F0E] font-medium"
                  placeholder="e.g. Red Velvet Cake"
                  placeholderTextColor="#DDBEA9"
                  value={newItemName}
                  onChangeText={setNewItemName}
                />
              </View>

              <View className="flex-row space-x-4">
                <View className="flex-1">
                  <Text className="text-[#B08968] font-bold uppercase text-xs mb-2">Price</Text>
                  <TextInput
                    className="bg-white p-4 rounded-2xl border border-[#DDBEA9] text-[#582F0E] font-medium"
                    placeholder="0.00"
                    placeholderTextColor="#DDBEA9"
                    keyboardType="numeric"
                    value={newItemPrice}
                    onChangeText={setNewItemPrice}
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-[#B08968] font-bold uppercase text-xs mb-2">Category</Text>
                  {/* Simple Category Selector for Demo */}
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                    {["Coffee", "Food", "Bakery", "Tea"].map(cat => (
                      <TouchableOpacity
                        key={cat}
                        onPress={() => setNewItemCategory(cat)}
                        className={`mr-2 px-3 py-3 rounded-xl border ${newItemCategory === cat ? 'bg-[#7F5539] border-[#7F5539]' : 'bg-white border-[#DDBEA9]'}`}
                      >
                        <Text className={`font-bold text-xs ${newItemCategory === cat ? 'text-white' : 'text-[#7F5539]'}`}>{cat}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>

              <Pressable
                onPress={() => setNewItemAvailable(!newItemAvailable)}
                className={`flex-row items-center justify-between p-4 rounded-2xl border ${newItemAvailable ? 'bg-[#DDE5B6]/50 border-[#DDE5B6]' : 'bg-[#F28482]/20 border-[#F28482]/30'}`}
              >
                <Text className="text-[#582F0E] font-bold uppercase text-xs">Stock Status</Text>
                <View className={`px-3 py-1 rounded-full ${newItemAvailable ? 'bg-[#606C38]' : 'bg-[#BC4749]'}`}>
                  <Text className="text-white text-[10px] font-black uppercase">
                    {newItemAvailable ? "In Stock" : "Sold Out"}
                  </Text>
                </View>
              </Pressable>

              <TouchableOpacity
                onPress={handleSaveItem}
                className="bg-[#432818] py-5 rounded-[20px] mt-4 shadow-lg active:opacity-90"
              >
                <Text className="text-white text-center font-black text-lg uppercase tracking-widest">
                  {editingItemId ? "Save Changes" : "Add to Menu"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
};

export default Menu;