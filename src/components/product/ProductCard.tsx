import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Product } from "../../types";

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  size?: "small" | "medium" | "large";
  variant?: "default" | "featured";
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  size = "medium",
  variant = "default",
}) => {
  const getCardSize = () => {
    switch (size) {
      case "small":
        return "w-28 h-40";
      case "large":
        return "w-48 h-64";
      default:
        return "w-36 h-52";
    }
  };

  const getImageSize = () => {
    switch (size) {
      case "small":
        return "h-24";
      case "large":
        return "h-48";
      default:
        return "h-36";
    }
  };

  const imageUri =
    product.image ||
    product.images?.[0] ||
    "https://images.unsplash.com/photo-1513708928671-19b1d5d7d9f9";
  // Featured variant: image card with dark overlay at bottom for title+price
  if (variant === "featured") {
    // Featured style: increase image height only (keep width unchanged)
    const featuredWidthClass =
      size === "small" ? "w-36" : size === "large" ? "w-52" : "w-44";
    const featuredImageHeight =
      size === "small" ? "h-44" : size === "large" ? "h-64" : "h-60";

    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.9}
        className={`mr-6 ${featuredWidthClass}`}
      >
        <View
          className={`w-full ${featuredImageHeight}  rounded-2xl overflow-hidden`}
        >
          <Image
            source={{ uri: imageUri }}
            className={`w-full h-full`}
            resizeMode="cover"
          />
        </View>

        <View className="mt-4 px-1">
          <Text
            className="text-[#FCFCFD] text-xs font-medium"
            numberOfLines={1}
          >
            {product.title}
          </Text>
          <Text className="text-[#FCFCFD] text-base font-bold mt-2">
            {"$ "}
            {typeof product.price === "number"
              ? product.price.toFixed(2)
              : product.price}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      className={`bg-white rounded-2xl overflow-hidden mr-6 ${getCardSize()} shadow-sm`}
    >
      <View
        className={`w-full ${getImageSize()} bg-white items-center justify-center`}
      >
        <Image
          source={{ uri: imageUri }}
          className={`w-full h-full`}
          resizeMode="cover"
        />
      </View>

      <View className="p-3 bg-white">
        <Text className="text-[#0F172A] text-sm font-medium" numberOfLines={2}>
          {product.title}
        </Text>
        {product.description ? (
          <Text className="text-[#475569] text-xs mt-1" numberOfLines={1}>
            {product.description}
          </Text>
        ) : null}
        <View className="flex-row items-center justify-between mt-2">
          <Text className="text-[#0F172A] text-base font-bold">
            $ {product.price}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;
