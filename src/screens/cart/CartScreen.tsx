import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} from "../../redux/slices/cartSlice";

const CartScreen = ({ navigation }: any) => {
  const dispatch = useAppDispatch();
  const { items, totalAmount, totalItems } = useAppSelector(
    (state) => state.cart
  );

  if (items.length === 0) {
    return (
      <View className="flex-1 bg-background items-center justify-center px-6">
        <StatusBar barStyle="light-content" backgroundColor="#1C1E2D" />

        <Ionicons name="cart-outline" size={100} color="#4B5563" />

        <Text className="text-white text-2xl font-bold mt-6 mb-2 text-center">
          Your cart is empty
        </Text>

        <Text className="text-[#FCFCFD] text-base mb-8 text-center">
          Add products to get started
        </Text>

        <TouchableOpacity
          onPress={() => navigation.navigate("HomeTabs", { screen: "Home" })}
          className="bg-white rounded-full px-8 py-3"
        >
          <Text className="text-slate-900 font-bold text-base">
            Start Shopping
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#23262F]">
      <StatusBar barStyle="light-content" backgroundColor="#23262F" />

      <View className="flex-row items-center px-5 pt-16 pb-6">
        <View className="w-11 h-11 ml-4 rounded-full bg-background items-center justify-center">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 items-center justify-center"
          >
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-center ml-[25%] items-end">
          <Text className="text-white text-xl font-bold pt-4 ml-4">
            Your Cart
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 300 }}
      >
        {items.map((item) => (
          <View
            key={item.id}
            className="mx-5 h-28 mb-4 bg-background rounded-3xl  flex-row"
          >
            <View className=" rounded-2xl overflow-hidden bg-white">
              <Image
                source={{ uri: item.images?.[0] || item.image }}
                className="w-28 h-full"
                resizeMode="cover"
              />
            </View>

            <View className="flex-1 ml-4 py-3 justify-between">
              <View className="flex-row justify-between items-start">
                <View className="w-[70%]">
                  <Text
                    className="text-[#FCFCFD] text-sm font-bold"
                    numberOfLines={1}
                  >
                    {item.title}
                  </Text>
                  <Text className="text-[#FCFCFD] text-base font-bold mt-2">
                    ${item.price}
                  </Text>
                </View>
                <View className="mt-2 mr-6">
                  <View className="w-5 h-5  bg-[#508A7B] rounded items-center justify-center">
                    <Ionicons name="checkmark" size={16} color="background" />
                  </View>
                </View>
              </View>

              <View className="flex-row items-center justify-between pr-4 ">
                <View className="flex-row items-center">
                  <Text className="text-[#E6E8EC] font-medium text-xs">
                    Size: {item.selectedSize || "L"} | Color:{" "}
                    {item.selectedColor || "Cream"}
                  </Text>
                </View>

                <View className="flex-row items-center bg-[#1C1E2D] border-[#E6E8EC] border rounded-full px-2 py-1">
                  <TouchableOpacity
                    onPress={() => dispatch(decreaseQuantity(item.id))}
                    className="w-6 h-6 items-center justify-center"
                  >
                    <Text className="text-[#E6E8EC] text-lg">-</Text>
                  </TouchableOpacity>

                  <Text className="text-[#E6E8EC] text-base font-semibold mx-4">
                    {item.quantity}
                  </Text>

                  <TouchableOpacity
                    onPress={() => dispatch(increaseQuantity(item.id))}
                    className="w-6 h-6 items-center justify-center"
                  >
                    <Text className="text-[#E6E8EC] text-lg">+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <View
        className="absolute left-0 right-0 px-5 py-6"
        style={{
          bottom: 80,
          backgroundColor: "#141416",
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          overflow: "hidden",
          zIndex: 50,
          elevation: 8,
        }}
      >
        <View className="flex-row py-4 justify-between mb-3">
          <Text className="text-[#E6E8EC] font-semibold text-sm">
            Product price
          </Text>
          <Text className="text-white text-sm font-semibold">
            ${totalAmount}
          </Text>
        </View>

        <View className="flex-row border-t border-[#23262F] py-4 justify-between mb-4">
          <Text className="text-[#E6E8EC] font-semibold text-sm">Shipping</Text>
          <Text className="text-white text-sm font-semibold">Freeship</Text>
        </View>

        <View className="flex-row justify-between mb-5 pt-4 border-t border-[#23262F]">
          <Text className="text-white text-lg font-semibold">Subtotal</Text>
          <Text className="text-white text-xl font-bold">${totalAmount}</Text>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate("Checkout")}
          className="bg-[#FCFCFD] z-50 rounded-full mt-5 py-4"
          activeOpacity={0.8}
        >
          <Text className="text-black text-center text-lg font-bold">
            Proceed to checkout
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CartScreen;
