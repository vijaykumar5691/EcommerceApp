import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";

interface FilterSidebarProps {
  onClose: () => void;
  onApply: (filters: any) => void;
  categories?: Array<{ id: number; name: string } | string>;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  onClose,
  onApply,
  categories,
}) => {
  const [priceMin, setPriceMin] = useState(10);
  const [priceMax, setPriceMax] = useState(1000);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(5);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [categoryOpen, setCategoryOpen] = useState<boolean>(false);
  const [selectedDiscounts, setSelectedDiscounts] = useState<string[]>([]);

  const colors = [
    { name: "Orange", color: "#FF9800" },
    { name: "Red", color: "#F44336" },
    { name: "Navy", color: "#1E3A8A" },
    { name: "Teal", color: "#5F8D9B" },
    { name: "White", color: "#FFFFFF" },
    { name: "Brown", color: "#8D6E63" },
    { name: "Pink", color: "#F8BBD0" },
  ];

  const discounts = ["50% off", "40% off", "30% off", "25% off"];

  const handleApply = () => {
    // Treat the single slider as the minimum price: send price_min = slider value and price_max = 100
    onApply({
      priceMin: priceMin,
      priceMax: priceMax,
      selectedColor,
      selectedRating,
      // pass category id (number) or null
      selectedCategory,
      selectedDiscounts,
    });
  };

  const toggleDiscount = (discount: string) => {
    if (selectedDiscounts.includes(discount)) {
      setSelectedDiscounts(selectedDiscounts.filter((d) => d !== discount));
    } else {
      setSelectedDiscounts([...selectedDiscounts, discount]);
    }
  };

  const statusBarHeight =
    Platform.OS === "android" ? StatusBar.currentHeight || 0 : 44;

  return (
    <View
      className="flex-1 bg-slate-900"
      style={{
        paddingTop: statusBarHeight,
        borderTopLeftRadius: 30,
        borderBottomLeftRadius: 30,
        overflow: "hidden",
      }}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent={true}
      />

      {/* Full ScrollView including header */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header - Filter icon LEFT, Filter text RIGHT */}
        <View className="flex-row justify-between items-center px-6 py-6">
          <Text className="text-white text-2xl font-bold">Filter</Text>
          <TouchableOpacity onPress={onClose} className="mr-4">
            <Ionicons name="options" size={28} color="white" />
          </TouchableOpacity>
        </View>

        {/* Price Range */}
        <View className="px-6 py-6 ">
          <Text className="text-white text-lg font-semibold mb-4">Price</Text>
          <View className="mb-4">
            <Slider
              style={{ width: "100%", height: 40 }}
              minimumValue={0}
              maximumValue={1000}
              value={priceMin}
              onValueChange={setPriceMin}
              minimumTrackTintColor="#FFFFFF"
              maximumTrackTintColor="#4B5563"
              thumbTintColor="#FFFFFF"
            />
          </View>
          <View className="flex-row justify-between">
            <Text className="text-white text-base font-medium">
              ${Math.round(priceMin)}
            </Text>
            <Text className="text-white text-base font-medium">
              ${priceMax}
            </Text>
          </View>
        </View>

        {/* Color */}
        <View className="px-6 py-6">
          <Text className="text-white text-lg font-semibold mb-4">Color</Text>
          <View className="flex-row flex-wrap">
            {colors.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedColor(item.name)}
                className="mr-4 mb-4"
                activeOpacity={0.7}
              >
                <View
                  className="w-12 h-12 rounded-full items-center justify-center"
                  style={{
                    backgroundColor: item.color,
                    borderWidth: item.color === "#FFFFFF" ? 1 : 0,
                    borderColor: "#4B5563",
                  }}
                >
                  {selectedColor === item.name && (
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color={item.color === "#FFFFFF" ? "black" : "white"}
                    />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Star Rating */}
        <View className="px-6 py-6">
          <Text className="text-white text-lg font-semibold mb-4">
            Star Rating
          </Text>
          <View className="flex-row">
            {[1, 2, 3, 4, 5].map((rating) => (
              <TouchableOpacity
                key={rating}
                onPress={() => setSelectedRating(rating)}
                className={`w-14 h-14 rounded-full items-center justify-center mr-3 ${
                  selectedRating === rating ? "bg-white" : "border border-white"
                }`}
                activeOpacity={0.7}
              >
                <View className="flex-row items-center">
                  <Ionicons
                    name="star"
                    size={16}
                    color={selectedRating === rating ? "black" : "white"}
                  />
                  <Text
                    className={`ml-1 font-medium ${
                      selectedRating === rating ? "text-black" : "text-white"
                    }`}
                  >
                    {rating}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Category */}
        <View className="px-6 py-6 ">
          <Text className="text-white text-lg font-semibold mb-4">
            Category
          </Text>

          {categories && Array.isArray(categories) && categories.length > 0 ? (
            <View>
              <TouchableOpacity
                onPress={() => setCategoryOpen((s) => !s)}
                className="flex-row items-center bg-gray-800 rounded-full px-5 py-3 justify-between"
                activeOpacity={0.8}
              >
                <View className="flex-row items-center">
                  <Ionicons name="shirt" size={20} color="white" />
                  <Text className="text-white text-base ml-3">
                    {(() => {
                      if (selectedCategory === null) return "All";
                      const matched = (categories as any[]).find(
                        (c: any, idx: number) =>
                          typeof c === "object"
                            ? c.id === selectedCategory
                            : idx === selectedCategory
                      );
                      return matched
                        ? typeof matched === "object"
                          ? matched.name
                          : String(matched)
                        : "All";
                    })()}
                  </Text>
                </View>
                <Ionicons
                  name={categoryOpen ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="white"
                />
              </TouchableOpacity>

              {categoryOpen && (
                <View
                  style={{
                    marginTop: 12,
                    backgroundColor: "#1F2937",
                    borderRadius: 12,
                    padding: 8,
                    maxHeight: 240,
                  }}
                >
                  <ScrollView
                    showsVerticalScrollIndicator={true}
                    nestedScrollEnabled={true}
                    contentContainerStyle={{ paddingBottom: 12 }}
                  >
                    {categories.map((c: any, idx: number) => {
                      const id = typeof c === "object" ? c.id : idx;
                      const name = typeof c === "object" ? c.name : String(c);
                      const active = selectedCategory === id;
                      return (
                        <TouchableOpacity
                          key={id}
                          onPress={() => {
                            setSelectedCategory(id);
                            setCategoryOpen(false);
                          }}
                          className={`px-4 py-3 rounded-lg mb-2 ${
                            active ? "bg-yellow-400/20" : ""
                          }`}
                          activeOpacity={0.8}
                        >
                          <Text
                            className={`${
                              active ? "text-yellow-400" : "text-white"
                            }`}
                          >
                            {name}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedCategory(null);
                        setCategoryOpen(false);
                      }}
                      className="px-4 py-3 rounded-lg"
                      activeOpacity={0.8}
                    >
                      <Text className="text-white">Clear selection</Text>
                    </TouchableOpacity>
                  </ScrollView>
                </View>
              )}
            </View>
          ) : (
            <TouchableOpacity
              className="flex-row items-center bg-gray-800 rounded-full px-5 py-3 justify-between"
              activeOpacity={0.7}
            >
              <View className="flex-row items-center">
                <Ionicons name="shirt" size={20} color="white" />
                <Text className="text-white text-base ml-3">Other</Text>
              </View>
              <Ionicons name="chevron-down" size={20} color="white" />
            </TouchableOpacity>
          )}
        </View>
        {/* Discount */}
        <View className="px-6 py-6">
          <Text className="text-white text-lg font-semibold mb-4">
            Discount
          </Text>
          <View className="flex-row flex-wrap">
            {discounts.map((discount, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => toggleDiscount(discount)}
                className="border border-white rounded-full px-5 py-2 mr-3 mb-3 flex-row items-center"
                activeOpacity={0.7}
              >
                <Text className="text-white text-sm mr-2">{discount}</Text>
                {selectedDiscounts.includes(discount) && (
                  <Ionicons name="close" size={16} color="white" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Apply Button - Fixed at Bottom */}
      <View className="absolute bottom-8 left-0 right-10 flex items-end px-6 py-5 bg-slate-900">
        <TouchableOpacity
          onPress={handleApply}
          className="bg-white w-[50%]  rounded-full py-3"
          activeOpacity={0.8}
        >
          <Text className="text-slate-900 text-center text-lg font-bold">
            Apply
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FilterSidebar;
