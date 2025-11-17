import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import { useAppSelector } from "../../redux/hooks";
import { useAuth } from "../../hooks/useAuth";

const CustomDrawer: React.FC<DrawerContentComponentProps> = (props) => {
  const { logout } = useAuth();
  const user = useAppSelector((state) => state.auth.user);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", onPress: () => logout(), style: "destructive" },
    ]);
  };

  // helper to get the deep active route name (works for nested navigators)
  const getActiveRouteName = () => {
    try {
      // start from drawer state
      let route: any = props.state.routes[props.state.index];
      // drill into nested state until leaf
      while (route.state && route.state.index !== undefined) {
        route = route.state.routes[route.state.index];
      }
      return route.name;
    } catch (e) {
      return undefined;
    }
  };

  const activeRoute = getActiveRouteName();

  return (
    <View className="flex-1 bg-background">
      {/* Scrollable Content */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex-row justify-center items-center gap-5 pt-28 pb-8 px-5">
          <View className="w-14 h-14 rounded-full overflow-hidden bg-pink-400">
            {user?.photoURL ? (
              <Image
                source={{ uri: user.photoURL || "" }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <View className="w-full h-full items-center justify-center">
                <Ionicons name="person" size={28} color="white" />
              </View>
            )}
          </View>

          <View className="">
            {/* Name */}
            <Text className="text-white text-lg font-bold mb-1">
              {user?.displayName || "Manisha Saini"}
            </Text>

            {/* Email */}
            <Text className="text-white text-xs font-regular">
              {user?.email || "manisha@gmail.com"}
            </Text>
          </View>
        </View>

        {/* Menu Items */}
        <View className="py-4">
          {/* Homepage */}
          {(() => {
            const isActive = activeRoute === "Home";
            return (
              <TouchableOpacity
                onPress={() => {
                  props.navigation.closeDrawer();
                  // navigate to Home tab inside Main stack
                  props.navigation.navigate("Main", {
                    screen: "HomeTabs",
                    params: { screen: "Home" },
                  });
                }}
                className={`flex-row items-center rounded-2xl px-5 py-3 mx-4 mb-3 ${
                  isActive ? "bg-[#23262F] py-6" : ""
                }`}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="home"
                  size={20}
                  color={isActive ? "#FFFFFF" : "#B1B5C3"}
                />
                <Text
                  className={`text-base font-bold ml-4 ${
                    isActive ? "text-white" : "text-[#B1B5C3]"
                  }`}
                >
                  Homepage
                </Text>
              </TouchableOpacity>
            );
          })()}

          {/* Discover */}
          {(() => {
            const isActive = activeRoute === "Discover";
            return (
              <TouchableOpacity
                onPress={() => {
                  props.navigation.closeDrawer();
                  props.navigation.navigate("Main", {
                    screen: "HomeTabs",
                    params: { screen: "Discover" },
                  });
                }}
                className={`flex-row items-center px-9 py-3 mb-3 ${
                  isActive ? "bg-[#23262F] py-6 rounded-2xl" : ""
                }`}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="search"
                  size={24}
                  color={isActive ? "#FFFFFF" : "#B1B5C3"}
                />
                <Text
                  className={`text-base font-bold ml-4 ${
                    isActive ? "text-white" : "text-[#B1B5C3]"
                  }`}
                >
                  Discover
                </Text>
              </TouchableOpacity>
            );
          })()}

          {/* My Order -> Cart */}
          {(() => {
            const isActive = activeRoute === "Cart";
            return (
              <TouchableOpacity
                onPress={() => {
                  props.navigation.closeDrawer();
                  props.navigation.navigate("Main", {
                    screen: "HomeTabs",
                    params: { screen: "Cart" },
                  });
                }}
                className={`flex-row items-center px-9 py-3 mb-3 ${
                  isActive ? "bg-[#23262F] py-6 rounded-2xl" : ""
                }`}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="bag-handle"
                  size={24}
                  color={isActive ? "#FFFFFF" : "#B1B5C3"}
                />
                <Text
                  className={`text-base font-bold ml-4 ${
                    isActive ? "text-white" : "text-[#B1B5C3]"
                  }`}
                >
                  My Order
                </Text>
              </TouchableOpacity>
            );
          })()}

          {/* My Profile */}
          {(() => {
            const isActive = activeRoute === "Profile";
            return (
              <TouchableOpacity
                onPress={() => {
                  props.navigation.closeDrawer();
                  props.navigation.navigate("Main", {
                    screen: "HomeTabs",
                    params: { screen: "Profile" },
                  });
                }}
                className={`flex-row items-center px-9 py-3 mb-4 ${
                  isActive ? "bg-[#23262F] py-6 rounded-2xl" : ""
                }`}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="person"
                  size={24}
                  color={isActive ? "#FFFFFF" : "#B1B5C3"}
                />
                <Text
                  className={`text-base font-bold ml-4 ${
                    isActive ? "text-white" : "text-[#B1B5C3]"
                  }`}
                >
                  My profile
                </Text>
              </TouchableOpacity>
            );
          })()}

          {/* OTHER Section Label */}
          <Text className="text-[#777E90] text-sm font-medium px-9 mb-3 mt-2">
            OTHER
          </Text>

          {/* Setting */}
          <TouchableOpacity
            onPress={() => {}}
            className="flex-row items-center px-9 py-3 mb-3"
            activeOpacity={0.7}
          >
            <Ionicons name="settings" size={24} color="#B1B5C3" />
            <Text className="text-[#B1B5C3] text-base font-bold ml-4">
              Setting
            </Text>
          </TouchableOpacity>

          {/* Support */}
          <TouchableOpacity
            onPress={() => {}}
            className="flex-row items-center px-9 py-3 mb-3"
            activeOpacity={0.7}
          >
            <Ionicons name="mail" size={24} color="#B1B5C3" />
            <Text className="text-[#B1B5C3] text-base font-bold ml-4">
              Support
            </Text>
          </TouchableOpacity>

          {/* About us */}
          <TouchableOpacity
            onPress={() => {}}
            className="flex-row items-center px-9 py-3"
            activeOpacity={0.7}
          >
            <Ionicons name="information-circle" size={24} color="#B1B5C3" />
            <Text className="text-[#B1B5C3] text-base font-bold ml-4">
              About us
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default CustomDrawer;
