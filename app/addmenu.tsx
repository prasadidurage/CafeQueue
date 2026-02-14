import { useMenu } from "@/context/MenuContext";
import { useRouter } from "expo-router";
import { ArrowLeft, CheckCircle, Upload } from "lucide-react-native";
import React, { useState } from "react";
import { Alert, Pressable, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AddMenu = () => {
    const router = useRouter();
    const { addMenuItem } = useMenu();

    const [newItemName, setNewItemName] = useState("");
    const [newItemPrice, setNewItemPrice] = useState("");
    const [newItemCategory, setNewItemCategory] = useState("Coffee");
    const [newItemAvailable, setNewItemAvailable] = useState(true);

    const handleSaveItem = () => {
        if (!newItemName || !newItemPrice) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        const priceFormatted = newItemPrice.startsWith('$') ? newItemPrice : `$${newItemPrice}`;

        const newItem = {
            id: Date.now(), // Simple unique ID generation
            name: newItemName,
            category: newItemCategory,
            price: priceFormatted,
            available: newItemAvailable,
        };

        addMenuItem(newItem);
        Alert.alert("Success", "Item added to menu!", [
            { text: "OK", onPress: () => router.back() }
        ]);
    };

    return (
        <View className="flex-1 bg-[#F9F5F0]">
            <StatusBar barStyle="dark-content" />
            <SafeAreaView className="flex-1" edges={['top']}>
                {/* Header */}
                <View className="px-6 py-4 flex-row items-center border-b border-[#E6E6E6] bg-white">
                    <TouchableOpacity onPress={() => router.back()} className="mr-4 bg-[#F3F4F6] p-2 rounded-full">
                        <ArrowLeft size={24} color="#4B5563" />
                    </TouchableOpacity>
                    <View>
                        <Text className="text-[#D4A373] text-xs font-bold uppercase tracking-wider">Kitchen Update</Text>
                        <Text className="text-[#2C1E11] text-xl font-black">Add New Item</Text>
                    </View>
                </View>

                <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
                    {/* Item Name */}
                    <View className="mb-6">
                        <Text className="text-[#4B5563] font-bold mb-2 uppercase text-xs">Item Name</Text>
                        <TextInput
                            value={newItemName}
                            onChangeText={setNewItemName}
                            placeholder="e.g. Hazelnut Latte"
                            className="bg-white border border-[#E5E7EB] p-4 rounded-xl text-[#2C1E11] font-semibold text-lg"
                        />
                    </View>

                    {/* Price & Category Row */}
                    <View className="flex-row space-x-4 mb-6">
                        <View className="flex-1">
                            <Text className="text-[#4B5563] font-bold mb-2 uppercase text-xs">Price</Text>
                            <TextInput
                                value={newItemPrice}
                                onChangeText={setNewItemPrice}
                                placeholder="0.00"
                                keyboardType="numeric"
                                className="bg-white border border-[#E5E7EB] p-4 rounded-xl text-[#2C1E11] font-semibold text-lg"
                            />
                        </View>
                    </View>

                    {/* Category Selection */}
                    <View className="mb-6">
                        <Text className="text-[#4B5563] font-bold mb-3 uppercase text-xs">Category</Text>
                        <View className="flex-row flex-wrap">
                            {["Coffee", "Food", "Bakery", "Tea"].map((cat) => (
                                <TouchableOpacity
                                    key={cat}
                                    onPress={() => setNewItemCategory(cat)}
                                    className={`mr-3 mb-3 px-4 py-3 rounded-xl border ${newItemCategory === cat
                                        ? "bg-[#2C1E11] border-[#2C1E11]"
                                        : "bg-white border-[#E5E7EB]"
                                        }`}
                                >
                                    <Text
                                        className={`font-bold text-xs ${newItemCategory === cat ? "text-white" : "text-[#4B5563]"
                                            }`}
                                    >
                                        {cat}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Stock Status */}
                    <Pressable
                        onPress={() => setNewItemAvailable(!newItemAvailable)}
                        className={`flex-row items-center justify-between p-4 rounded-xl border mb-8 ${newItemAvailable ? 'bg-[#ECFDF5] border-[#A7F3D0]' : 'bg-[#FEF2F2] border-[#FECACA]'}`}
                    >
                        <View>
                            <Text className="text-[#1F2937] font-bold text-sm">Availability Status</Text>
                            <Text className="text-[#6B7280] text-xs">Is this item currently in stock?</Text>
                        </View>
                        <View className={`px-3 py-1 rounded-full ${newItemAvailable ? 'bg-[#059669]' : 'bg-[#DC2626]'}`}>
                            <Text className="text-white text-[10px] font-black uppercase">
                                {newItemAvailable ? "In Stock" : "Sold Out"}
                            </Text>
                        </View>
                    </Pressable>

                    {/* Submit Button */}
                    <TouchableOpacity
                        onPress={handleSaveItem}
                        className="bg-[#D4A373] w-full py-5 rounded-[25px] flex-row items-center justify-center shadow-lg active:opacity-90"
                    >
                        <Text className="text-[#2C1E11] font-black text-lg uppercase tracking-widest mr-2">Add to Menu</Text>
                        <CheckCircle size={20} color="#2C1E11" />
                    </TouchableOpacity>

                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

export default AddMenu;
