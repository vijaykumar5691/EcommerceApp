import React from "react";
import { TouchableOpacity, Text, View, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface CategoryIconProps {
  // Accept any string key; we'll map common keys to local images and fallback to Ionicons
  icon: string;
  label: string;
  onPress: () => void;
  isActive?: boolean;
  // optional remote image uri provided by API (category.image)
  imageUri?: string | null;
}

// Map of icon keys (as used across the app) to local image requires
const LOCAL_ICONS: Record<string, any> = {
  woman: require("../../assets/icons/women.png"),
  man: require("../../assets/icons/men.png"),
  accessories: require("../../assets/icons/accessories.png"),
  beauty: require("../../assets/icons/beauty.png"),
  // Support the names used in HomeScreen
  "glasses-outline": require("../../assets/icons/accessories.png"),
  "cut-outline": require("../../assets/icons/beauty.png"),
};

const CategoryIcon: React.FC<CategoryIconProps> = ({
  icon,
  label,
  onPress,
  isActive = false,
  imageUri = null,
}) => {
  const localImage = LOCAL_ICONS[icon];
  const remoteImage = imageUri;

  return (
    <TouchableOpacity
      onPress={onPress}
      className="items-center mr-6"
      activeOpacity={0.7}
    >
      <View
        className={`w-14 h-14 ${
          isActive ? "rounded-none" : "rounded-full"
        } items-center justify-center ${
          isActive ? "bg-white" : "bg-background"
        }`}
        // ensure images don't overflow the square/circle
        style={{ overflow: "hidden" }}
      >
        {remoteImage ? (
          <Image
            source={{ uri: remoteImage }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
        ) : localImage ? (
          <Image
            source={localImage}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
        ) : (
          <Ionicons
            name={icon as any}
            size={32}
            color={isActive ? "#1E293B" : "#FFFFFF"}
          />
        )}
      </View>
      <Text className="text-white text-xs mt-2">{label}</Text>
    </TouchableOpacity>
  );
};

export default CategoryIcon;
