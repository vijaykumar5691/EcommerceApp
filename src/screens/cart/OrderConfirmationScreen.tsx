import React from "react";
import { View, Text, TouchableOpacity, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const OrderConfirmationScreen = ({ navigation, route }: any) => {
  const { orderData } = route.params || {};

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      <View className="px-5 pt-16 pb-4">
        <View className="w-11 h-11  rounded-full bg-background items-center justify-center">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 items-center justify-center"
          >
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-center -mt-6 ">
          <Text className="text-white text-xl font-bold ">Check out</Text>
        </View>

        <View className="flex-row items-center px-6 justify-between mt-6 ">
          <View className="items-center">
            <View className="w-8 h-8 bg-white rounded-full items-center justify-center">
              <Ionicons name="location" size={18} color="black" />
            </View>
          </View>

          <View
            className="flex-1 mx-2"
            style={{
              borderBottomWidth: 1,
              borderStyle: "dashed",
              borderBottomColor: "#ffffff",
            }}
          />

          <View className="items-center">
            <View className="w-8 h-8 bg-gray-700 rounded-full items-center justify-center">
              <Ionicons name="card" size={22} color="#ffffff" />
            </View>
          </View>

          <View
            className="flex-1 mx-2"
            style={{
              borderBottomWidth: 1,
              borderStyle: "dashed",
              borderBottomColor: "#777E90",
            }}
          />

          <View className="items-center">
            <View className="w-6 h-6 bg-white rounded-full items-center justify-center">
              <Ionicons name="checkmark" size={16} color="black" />
            </View>
          </View>
        </View>
      </View>

      <View className="flex-1  mt-10 px-8">
        <Text className="text-white text-2xl ml-3 font-bold mb-20">
          Order Completed
        </Text>

        <View className="items-center  mb-16">
          <View className="relative">
            <Ionicons name="bag-handle" size={110} color="white" />

            <View className="absolute -bottom-2 -right-2 w-16 h-16 bg-white rounded-full items-center justify-center border-4 border-black">
              <Ionicons name="checkmark" size={32} color="black" />
            </View>
          </View>
        </View>

        <Text className="text-white text-center text-base mb-2">
          Thank you for your purchase.
        </Text>
        <Text className="text-white text-center text-base mb-2">
          You can view your order in 'My Orders'
        </Text>
        <Text className="text-white text-center text-base">section.</Text>
      </View>

      <View className="px-8 pb-[45%]">
        <TouchableOpacity
          onPress={() => navigation.navigate("HomeTabs", { screen: "Home" })}
          className="bg-white rounded-full py-4"
          activeOpacity={0.8}
        >
          <Text className="text-black text-center text-lg font-bold">
            Continue shopping
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OrderConfirmationScreen;
