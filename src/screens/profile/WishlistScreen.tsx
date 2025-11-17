import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppSelector } from "../../redux/hooks";

const WishlistScreen = ({ navigation }: any) => {
  const wishlistItems = useAppSelector((state) => state.cart.items);

  return (
    <View className="flex-1 bg-black">
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      <View className="flex-row items-center px-5 pt-12 pb-6">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold ml-4">My Wishlist</Text>
      </View>

      <View className="flex-1 items-center justify-center">
        <Ionicons name="heart-outline" size={80} color="#4B5563" />
        <Text className="text-white text-lg mt-4">Your wishlist is empty</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("HomeTabs")}
          className="bg-white rounded-full px-6 py-3 mt-6"
        >
          <Text className="text-black font-bold">Start Shopping</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WishlistScreen;
