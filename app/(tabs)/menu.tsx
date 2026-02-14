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
  ShoppingCart,
  CheckCircle,
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
} from "react-native";

import { useMenu } from "@/context/MenuContext";
import { useOrders } from "@/context/OrderContext";

const Menu = () => {
  const {
    menuItems,
    addMenuItem,
    updateMenuItem,
    toggleStock,
    deleteMenuItem,
  } = useMenu();
  const { orders, addOrder } = useOrders();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form States
  const [formName, setFormName] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formCategory, setFormCategory] = useState("Coffee");
  const [formAvailable, setFormAvailable] = useState(true);

  // Order Creation States
  const [orderModalVisible, setOrderModalVisible] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [selectedItems, setSelectedItems] = useState<
    { id: string; name: string; price: number; qty: number }[]
  >([]);

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
    setEditingId(item.id); // item.id is now string
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
      // Need to cast or ensure logic handles string id
      await updateMenuItem({
        id: String(editingId),
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
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteMenuItem(id),
        },
      ],
    );
  };

  // Order Creation Handlers
  const openOrderModal = () => {
    setCustomerName("");
    setSelectedItems([]);
    setOrderModalVisible(true);
  };

  const addItemToOrder = (item: any) => {
    const menuItem = {
      id: String(item.id),
      name: item.name,
      price: parseFloat(item.price.replace("$", "")),
      qty: 1,
    };
    setSelectedItems((prev) => {
      const existing = prev.find((entry) => entry.id === menuItem.id);
      if (existing) {
        return prev.map((entry) =>
          entry.id === menuItem.id ? { ...entry, qty: entry.qty + 1 } : entry,
        );
      }
      return [...prev, menuItem];
    });
  };

  const removeItemFromOrder = (id: string) => {
    setSelectedItems((prev) => prev.filter((item) => item.id !== id));
  };

  const calculateTotal = () => {
    return selectedItems
      .reduce((acc, item) => acc + item.price * item.qty, 0)
      .toFixed(2);
  };

  const handleCreateOrder = () => {
    if (!customerName.trim()) {
      Alert.alert("Required", "Please enter customer name");
      return;
    }
    if (selectedItems.length === 0) {
      Alert.alert("Required", "Please select at least one item");
      return;
    }

    const items = selectedItems.map((item) => `${item.qty}x ${item.name}`);
    const total = `$${calculateTotal()}`;
    const nextIdNumber = orders.length
      ? Math.max(...orders.map((order) => Number(order.id))) + 1
      : 1;
    const nextId = String(nextIdNumber).padStart(3, "0");

    addOrder({
      id: nextId,
      customer: customerName.trim(),
      items,
      total,
      status: "Preparing",
      time: "Just now",
      rawItems: selectedItems,
    });

    Alert.alert("Success", "Order created successfully!");
    setOrderModalVisible(false);
    setCustomerName("");
    setSelectedItems([]);
  };

  return (
    <View className="flex-1 bg-[#F9F5F0]" style={{ position: "relative" }}>
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
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="pl-6"
          >
            {categories.map((cat) => (
              <Pressable
                key={cat.name}
                onPress={() => setSelectedCategory(cat.name)}
                className="items-center mr-6"
              >
                <View
                  className={`w-14 h-14 rounded-2xl items-center justify-center shadow-sm ${
                    selectedCategory === cat.name
                      ? "bg-[#7F5539]"
                      : "bg-white border border-[#EDE0D4]"
                  }`}
                >
                  <cat.icon
                    size={24}
                    color={selectedCategory === cat.name ? "#FFF" : "#B08968"}
                  />
                </View>
                <Text
                  className={`text-[11px] font-bold mt-2 uppercase tracking-tighter ${
                    selectedCategory === cat.name
                      ? "text-[#7F5539]"
                      : "text-[#B08968]"
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
              {/* Availability Badge */}
              <Pressable
                onPress={() => toggleStock(item.id)}
                className={`self-start px-2 py-1 rounded-full mb-2 ${item.available ? "bg-[#DDE5B6]" : "bg-[#F28482]/20"}`}
              >
                <Text
                  className={`text-[8px] font-black uppercase ${item.available ? "text-[#606C38]" : "text-[#BC4749]"}`}
                >
                  {item.available ? "In Stock" : "Sold Out"}
                </Text>
              </Pressable>

              <Text
                className="text-[#432818] font-bold text-lg leading-5"
                numberOfLines={2}
              >
                {item.name}
              </Text>
              <Text className="text-[#B08968] text-[10px] font-bold mt-1 uppercase">
                {item.category}
              </Text>

              <View className="flex-row justify-between items-center mt-4">
                <Text className="text-[#7F5539] font-black text-xl">
                  {item.price}
                </Text>
                <View className="flex-row items-center gap-1">
                  <Pressable
                    onPress={() => addItemToOrder(item)}
                    disabled={!item.available}
                    className="bg-[#7F5539] p-2 rounded-xl border border-[#7F5539]"
                  >
                    <ShoppingCart size={16} color="white" />
                  </Pressable>
                  <Pressable
                    onPress={() => openEditModal(item)}
                    className="bg-[#F5F1ED] p-2 rounded-xl border border-[#EDE0D4]"
                  >
                    <Edit3 size={16} color="#7F5539" />
                  </Pressable>
                  <Pressable
                    onPress={() => handleDeleteItem(item.id)}
                    className="bg-[#FDF1F0] p-2 rounded-xl border border-[#F5C6C6]"
                  >
                    <Trash2 size={16} color="#BC4749" />
                  </Pressable>
                </View>
              </View>
            </View>
          ))}
        </View>
        <View className="h-24" />
      </ScrollView>

      {/* --- Create Order Button --- */}
      {selectedItems.length > 0 && (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={openOrderModal}
          className="absolute bg-[#2C1E11] w-16 h-16 rounded-full items-center justify-center shadow-2xl border-4 border-[#F9F5F0]"
          style={{ elevation: 10, zIndex: 999, bottom: 100, right: 100 }}
        >
          <View className="items-center justify-center">
            <ShoppingCart size={24} color="#D4A373" />
            <Text className="text-[#D4A373] text-xs font-bold mt-1">
              {selectedItems.length}
            </Text>
          </View>
        </TouchableOpacity>
      )}

      {/* --- Floating Action Button (FAB) --- */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={openAddModal}
        className="absolute bg-[#7F5539] w-16 h-16 rounded-full items-center justify-center shadow-2xl border-4 border-[#F9F5F0]"
        style={{ elevation: 10, zIndex: 999, bottom: 100, right: 24 }}
      >
        <Plus size={32} color="white" strokeWidth={3} />
      </TouchableOpacity>

      {/* --- Add/Edit Modal --- */}
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-[#FDFBF7] rounded-t-[40px] p-8 shadow-2xl max-h-[85%]">
            <View className="flex-row items-center justify-between mb-6">
              <View>
                <Text className="text-[#A98467] text-xs font-bold uppercase tracking-widest">
                  {isEditing ? "Edit Item" : "New Item"}
                </Text>
                <Text className="text-[#432818] text-2xl font-black">
                  {isEditing ? "Update Menu" : "Add to Menu"}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  resetForm();
                }}
                className="bg-[#F3F4F6] p-2 rounded-full"
              >
                <X size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text className="text-[#4B5563] font-bold mb-2">Item Name</Text>
              <TextInput
                value={formName}
                onChangeText={setFormName}
                placeholder="Ex: Caramel Latte"
                className="bg-white border border-[#E5E7EB] p-4 rounded-xl text-[#2C1E11] font-semibold mb-5"
              />

              <Text className="text-[#4B5563] font-bold mb-2">Price ($)</Text>
              <TextInput
                value={formPrice}
                onChangeText={setFormPrice}
                placeholder="Ex: 4.50"
                keyboardType="decimal-pad"
                className="bg-white border border-[#E5E7EB] p-4 rounded-xl text-[#2C1E11] font-semibold mb-5"
              />

              <Text className="text-[#4B5563] font-bold mb-2">Category</Text>
              <View className="flex-row flex-wrap mb-5">
                {categoryNames.map((cat) => (
                  <Pressable
                    key={cat}
                    onPress={() => setFormCategory(cat)}
                    className={`mr-3 mb-3 px-4 py-2 rounded-full border ${
                      formCategory === cat
                        ? "bg-[#7F5539] border-[#7F5539]"
                        : "bg-white border-[#EDE0D4]"
                    }`}
                  >
                    <Text
                      className={`text-xs font-bold uppercase ${formCategory === cat ? "text-white" : "text-[#7F5539]"}`}
                    >
                      {cat}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Pressable
                onPress={() => setFormAvailable((prev) => !prev)}
                className={`px-4 py-4 rounded-xl border mb-6 items-center ${
                  formAvailable
                    ? "bg-[#ECFDF5] border-[#A7F3D0]"
                    : "bg-[#FEF2F2] border-[#FECACA]"
                }`}
              >
                <Text
                  className={`font-bold uppercase ${formAvailable ? "text-[#047857]" : "text-[#B91C1C]"}`}
                >
                  {formAvailable
                    ? "● Currently Available"
                    : "○ Marked as Sold Out"}
                </Text>
              </Pressable>
            </ScrollView>

            <TouchableOpacity
              onPress={handleSaveItem}
              className="bg-[#7F5539] p-5 rounded-2xl shadow-lg mt-4 items-center"
            >
              <Text className="text-white font-bold text-lg">
                {isEditing ? "Update Item" : "Add to Menu"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* --- Create Order Modal --- */}
      <Modal
        animationType="slide"
        transparent
        visible={orderModalVisible}
        onRequestClose={() => setOrderModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-[#FDFBF7] h-[85%] rounded-t-[30px] p-6 shadow-2xl">
            <View className="flex-row justify-between items-center mb-6">
              <View>
                <Text className="text-[#A98467] text-xs font-bold uppercase tracking-widest">
                  Create Order
                </Text>
                <Text className="text-[#432818] text-2xl font-black">
                  New Order
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setOrderModalVisible(false);
                  setCustomerName("");
                  setSelectedItems([]);
                }}
                className="bg-[#F3F4F6] p-2 rounded-full"
              >
                <X size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text className="text-[#4B5563] font-bold mb-2">
                Customer Name
              </Text>
              <TextInput
                value={customerName}
                onChangeText={setCustomerName}
                placeholder="Ex: John Doe"
                className="bg-white border border-[#E5E7EB] p-4 rounded-xl text-[#2C1E11] font-semibold mb-6"
              />

              <Text className="text-[#4B5563] font-bold mb-3">
                Selected Items
              </Text>
              {selectedItems.length === 0 ? (
                <View className="bg-[#F9FAFB] p-6 rounded-xl items-center border border-dashed border-[#D1D5DB] mb-6">
                  <Text className="text-[#9CA3AF] font-medium">
                    No items selected. Go back to menu to add items.
                  </Text>
                </View>
              ) : (
                <View className="bg-white rounded-xl border border-[#E5E7EB] mb-6 overflow-hidden">
                  {selectedItems.map((item, idx) => (
                    <View
                      key={`${item.id}-${idx}`}
                      className="flex-row justify-between items-center p-4 border-b border-[#F3F4F6]"
                    >
                      <View className="flex-row items-center">
                        <View className="bg-[#7F5539] w-6 h-6 rounded-full items-center justify-center mr-3">
                          <Text className="text-white text-xs font-bold">
                            {item.qty}
                          </Text>
                        </View>
                        <Text className="text-[#2C1E11] font-medium">
                          {item.name}
                        </Text>
                      </View>
                      <View className="flex-row items-center">
                        <Text className="text-[#4B5563] font-bold mr-4">
                          ${(item.price * item.qty).toFixed(2)}
                        </Text>
                        <TouchableOpacity
                          onPress={() => removeItemFromOrder(item.id)}
                        >
                          <Trash2 size={18} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                  <View className="bg-[#F9FAFB] p-4 flex-row justify-between items-center">
                    <Text className="text-[#4B5563] font-bold uppercase text-xs">
                      Total Amount
                    </Text>
                    <Text className="text-[#2C1E11] font-black text-xl">
                      ${calculateTotal()}
                    </Text>
                  </View>
                </View>
              )}
            </ScrollView>

            <TouchableOpacity
              onPress={handleCreateOrder}
              className="bg-[#7F5539] p-5 rounded-2xl shadow-lg shadow-[#7F5539]/30 mt-4 items-center flex-row justify-center"
            >
              <Text className="text-white font-bold text-lg mr-2">
                Create Order
              </Text>
              <CheckCircle size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Menu;
