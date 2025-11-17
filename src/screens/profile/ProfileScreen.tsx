import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../hooks/useAuth";
import { useAppSelector } from "../../redux/hooks";

const ProfileScreen = ({ navigation }: any) => {
  const { logout } = useAuth();
  const user = useAppSelector((state) => state.auth.user);

  const handleLogout = () => {
    Alert.alert("Log out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out",
        onPress: () => logout(),
        style: "destructive",
      },
    ]);
  };

  const menuItems = [
    {
      icon: "location",
      title: "Address",
      onPress: () => navigation.navigate("Address"),
    },
    {
      icon: "card",
      title: "Payment method",
      onPress: () => navigation.navigate("PaymentMethod"),
    },
    {
      icon: "ticket",
      title: "Voucher",
      onPress: () => navigation.navigate("Voucher"),
    },
    {
      icon: "heart",
      title: "My Wishlist",
      onPress: () => navigation.navigate("Wishlist"),
    },
    {
      icon: "star",
      title: "Rate this app",
      onPress: () => {
        Alert.alert("Rate this app", "Thank you for your support!");
      },
    },
  ];

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex-row justify-start items-center gap-5 pt-24 pb-16  px-5">
          <View className=" pl-8  ">
            <View className="w-[4.3rem] h-[4.3rem] rounded-full overflow-hidden bg-pink-400">
              {user?.photoURL ? (
                <Image
                  source={{ uri: user.photoURL || "" }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-full h-full items-center justify-center">
                  <Ionicons name="person" size={32} color="white" />
                </View>
              )}
            </View>
          </View>

          <View className="">
            <Text className="text-[#ffffff] text-lg  font-bold mb-1">
              {user?.displayName || "Manisha Saini"}
            </Text>

            <Text className="text-white text-xs">
              {user?.email || "manisha@gmail.com"}
            </Text>
          </View>
        </View>

        <View className="px-6 ">
          <View className=" border-[#262626] border rounded-2xl pt-6 pb-8">
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={item.onPress}
                className="flex-row items-center justify-between bg-gray-900 rounded-2xl px-6 py-5 mb-3"
                activeOpacity={0.7}
              >
                <View className="flex-row items-center">
                  <View className="w-10 h-10 bg-gray-800 rounded-full items-center justify-center mr-3">
                    <Ionicons
                      name={item.icon as any}
                      size={20}
                      color="#B1B5C3"
                    />
                  </View>
                  <Text className="text-white text-base font-medium">
                    {item.title}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#ffffff" />
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              onPress={handleLogout}
              className="flex-row items-center justify-between bg-gray-900 rounded-2xl px-5 py-5 mt-2"
              activeOpacity={0.7}
            >
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-gray-800 rounded-full items-center justify-center mr-3">
                  <Ionicons name="log-out" size={20} color="#B1B5C3" />
                </View>
                <Text className="text-white text-base font-medium">
                  Log out
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;
