import SuccessModal from "@/components/SuccessModal";
import { useMenu } from "@/context/MenuContext";
import { useOrders } from "@/context/OrderContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  CheckCircle,
  Minus,
  Plus,
  ShoppingBag,
  ShoppingCart,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AddOrder = () => {
  const router = useRouter();
  const { orderId } = useLocalSearchParams();
  const { menuItems } = useMenu();
  const { addOrder, updateOrder, orders } = useOrders();

  const [customerName, setCustomerName] = useState("");
  const [selectedItems, setSelectedItems] = useState<
    { id: string; name: string; price: number; qty: number }[]
  >([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Filter available items only
  const availableItems = menuItems.filter((item) => item.available);

  const removeItemFromOrder = (id: string) => {
    setSelectedItems((prev) => prev.filter((item) => item.id !== id));
  };

  useEffect(() => {
    if (orderId) {
      const orderToEdit = orders.find((o) => o.id === orderId);
      if (orderToEdit) {
        setIsEditing(true);
        setCustomerName(orderToEdit.customer);
        // Map rawItems if available, otherwise try to parse items string (fallback) or start empty?
        // Our updated service stores rawItems, so we should use that.
        if (orderToEdit.rawItems) {
          setSelectedItems(
            orderToEdit.rawItems.map((item) => ({
              id: item.id,
              name: item.name,
              price: item.price,
              qty: item.qty,
            })),
          );
        }
      }
    }
  }, [orderId, orders]);

  const addItemToOrder = (item: any) => {
    // Parse price string $X.XX to number if it's a string, or use directly if number
    const priceNum =
      typeof item.price === "string"
        ? parseFloat(item.price.replace("$", ""))
        : item.price;

    setSelectedItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, qty: i.qty + 1 } : i,
        );
      }
      return [
        ...prev,
        { id: item.id, name: item.name, price: priceNum, qty: 1 },
      ];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setSelectedItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = Math.max(0, item.qty + delta);
            return { ...item, qty: newQty };
          }
          return item;
        })
        .filter((item) => item.qty > 0),
    );
  };

  const calculateTotal = () => {
    return selectedItems
      .reduce((acc, item) => acc + item.price * item.qty, 0)
      .toFixed(2);
  };

  const handleSaveOrder = async () => {
    if (!customerName.trim()) {
      Alert.alert("Required", "Please enter customer name");
      return;
    }
    if (selectedItems.length === 0) {
      Alert.alert("Required", "Please select at least one item");
      return;
    }

    const orderData = {
      customer: customerName,
      items: selectedItems.map((i) => `${i.qty}x ${i.name}`),
      rawItems: selectedItems.map((i) => ({
        id: i.id.toString(),
        name: i.name,
        price: i.price,
        qty: i.qty,
      })),
      total: `$${calculateTotal()}`,
      status: "Preparing" as const,
    };

    try {
      if (isEditing && typeof orderId === "string") {
        await updateOrder({ id: orderId, ...orderData });
        setSuccessMsg("Order Updated!");
        setShowSuccess(true);
      } else {
        await addOrder(orderData);
        setSuccessMsg("Sent to Kitchen!");
        setShowSuccess(true);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to save order");
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    router.back();
  };

  return (
    <View className="flex-1 bg-[#F9F5F0]">
      <StatusBar barStyle="dark-content" />
      <SafeAreaView className="flex-1" edges={["top"]}>
        <SuccessModal
          visible={showSuccess}
          message={successMsg}
          onClose={handleSuccessClose}
        />
        {/* Header */}
        <View className="px-6 py-4 flex-row items-center border-b border-[#E6E6E6] bg-white">
          <TouchableOpacity
            onPress={() => router.back()}
            className="mr-4 bg-[#F3F4F6] p-2 rounded-full"
          >
            <ArrowLeft size={24} color="#4B5563" />
          </TouchableOpacity>
          <View>
            <Text className="text-[#D4A373] text-xs font-bold uppercase tracking-wider">
              {isEditing ? "Update Order" : "New Order"}
            </Text>
            <Text className="text-[#2C1E11] text-xl font-black">
              {isEditing ? "Edit Details" : "Walk-In Customer"}
            </Text>
          </View>
        </View>

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          {/* Customer Details */}
          <View className="p-6 bg-white mb-2">
            <Text className="text-[#4B5563] font-bold mb-2 uppercase text-xs">
              Customer Name
            </Text>
            <TextInput
              value={customerName}
              onChangeText={setCustomerName}
              placeholder="e.g. Guest #42"
              className="bg-[#F9FAFB] border border-[#E5E7EB] p-4 rounded-xl text-[#2C1E11] font-semibold text-lg"
            />
          </View>

          {/* Menu Selection */}
          <View className="px-6 py-4">
            <Text className="text-[#4B5563] font-bold mb-4 uppercase text-xs">
              Select Menu Items
            </Text>
            <View className="flex-row flex-wrap justify-between">
              {availableItems.map((item) => {
                const selectedItem = selectedItems.find(
                  (i) => i.id === item.id,
                );
                return (
                  <View
                    key={item.id}
                    className="w-[48%] bg-white p-4 rounded-[20px] border border-[#E5E7EB] mb-4 shadow-sm"
                    style={
                      selectedItem
                        ? {
                          borderColor: "#D4A373",
                          borderWidth: 2,
                        }
                        : {}
                    }
                  >
                    {/* Header Row */}
                    <View className="flex-row justify-between items-start mb-2">
                      <View className="bg-[#FFF7ED] p-2 rounded-full">
                        <ShoppingBag size={16} color="#D4A373" />
                      </View>
                      <View className="bg-[#2C1E11] px-2 py-1 rounded-lg">
                        <Text className="text-white font-bold text-xs">
                          {item.price}
                        </Text>
                      </View>
                    </View>

                    {/* Item Name & Category */}
                    <Text className="text-[#2C1E11] font-bold text-base leading-5 mb-1">
                      {item.name}
                    </Text>
                    <Text className="text-[#9CA3AF] text-xs font-medium uppercase mb-3">
                      {item.category}
                    </Text>

                    {/* Add/Qty Controls */}
                    {selectedItem ? (
                      <View className="flex-row items-center gap-2">
                        <TouchableOpacity
                          onPress={() => updateQty(item.id, -1)}
                          className="flex-1 bg-[#FEF2F2] py-2 rounded-lg items-center"
                        >
                          <Minus size={16} color="#EF4444" />
                        </TouchableOpacity>
                        <View className="flex-1 bg-[#F3F4F6] py-2 rounded-lg items-center">
                          <Text className="text-[#2C1E11] font-bold text-sm">
                            {selectedItem.qty}
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => addItemToOrder(item)}
                          className="flex-1 bg-[#7F5539] py-2 rounded-lg items-center"
                        >
                          <Plus size={16} color="white" />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity
                        onPress={() => addItemToOrder(item)}
                        className="bg-[#7F5539] py-3 rounded-xl flex-row items-center justify-center gap-1"
                      >
                        <ShoppingCart size={14} color="white" />
                        <Text className="text-white font-bold text-xs uppercase">
                          Add
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        </ScrollView>

        {/* Bottom Cart Sheet */}
        <View className="absolute bottom-0 w-full bg-white rounded-t-[35px] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] p-6 border-t border-[#F3F4F6]">
          {selectedItems.length > 0 ? (
            <>
              <View className="flex-row justify-between items-center mb-4">
                <View>
                  <Text className="text-[#9CA3AF] font-bold uppercase text-xs">
                    Order Summary
                  </Text>
                  <Text className="text-[#2C1E11] font-black text-3xl">
                    ${calculateTotal()}
                  </Text>
                </View>
                <View className="bg-[#FFF7ED] px-4 py-2 rounded-xl">
                  <Text className="text-[#D4A373] font-bold">
                    {selectedItems.length} Items
                  </Text>
                </View>
              </View>

              {/* Selected Items Display */}
              <ScrollView
                horizontal={false}
                showsVerticalScrollIndicator={false}
                className="mb-4 max-h-20"
              >
                {selectedItems.map((item) => (
                  <View
                    key={item.id}
                    className="bg-[#F9FAFB] px-4 py-2 mb-2 rounded-lg border border-[#E5E7EB] flex-row items-center justify-between"
                  >
                    <View className="flex-1">
                      <Text className="font-bold text-[#2C1E11] text-sm">
                        {item.qty}x {item.name}
                      </Text>
                      <Text className="text-[#9CA3AF] text-xs">
                        ${(item.price * item.qty).toFixed(2)}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => removeItemFromOrder(item.id)}
                      className="bg-[#FEF2F2] p-2 rounded-lg ml-2"
                    >
                      <Minus size={14} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>

              <TouchableOpacity
                onPress={handleSaveOrder}
                className="bg-[#2C1E11] w-full py-5 rounded-[25px] flex-row items-center justify-center shadow-lg active:scale-95 transition-transform"
              >
                <Text className="text-white font-black text-lg uppercase tracking-widest mr-2">
                  {isEditing ? "Update Order" : "Confirm Order"}
                </Text>
                <CheckCircle size={20} color="white" />
              </TouchableOpacity>
            </>
          ) : (
            <View className="items-center py-4">
              <Text className="text-[#9CA3AF] font-medium">
                Select items to start an order
              </Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};

export default AddOrder;
