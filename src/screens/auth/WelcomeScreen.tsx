import React from "react";
import { View, Text, TouchableOpacity, StatusBar, Image } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../types";
import { Ionicons } from "@expo/vector-icons";

type WelcomeScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, "Welcome">;
};

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  return (
    <View className="flex-1 bg-black">
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      <View className="flex-1 pt-16 items-center justify-center">
        <Image
          source={require("../../assets/images/splashImg.png")}
          style={{ width: "80%", height: "60%" }}
          resizeMode="contain"
        />
      </View>

      <View className="w-full items-center pb-28">
        <TouchableOpacity
          className="bg-white rounded-full justify-between w-[85%] py-3 flex-row items-center px-6"
          onPress={() => navigation.navigate("Login")}
          activeOpacity={0.9}
        >
          <Text className="text-[#666668] text-lg font-semibold mr-2">
            Get Started
          </Text>
          <Ionicons name="arrow-forward" size={20} color="#666668" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WelcomeScreen;
