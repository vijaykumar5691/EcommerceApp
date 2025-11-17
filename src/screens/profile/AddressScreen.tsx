import React from "react";
import { View, Text, TouchableOpacity, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const AddressScreen = ({ navigation }: any) => {
  return (
    <View className="flex-1 bg-black">
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      <View className="flex-row items-center px-5 pt-12 pb-6">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold ml-4">Address</Text>
      </View>

      <View className="flex-1 items-center justify-center">
        <Ionicons name="location" size={80} color="#4B5563" />
        <Text className="text-white text-lg mt-4">No addresses saved yet</Text>
        <TouchableOpacity className="bg-white rounded-full px-6 py-3 mt-6">
          <Text className="text-black font-bold">Add Address</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddressScreen;
