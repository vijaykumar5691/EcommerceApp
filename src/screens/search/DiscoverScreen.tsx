import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
  FlatList,
  ActivityIndicator,
} from "react-native";
import Modal from "react-native-modal";
import { Ionicons } from "@expo/vector-icons";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  fetchProducts,
  fetchCategories,
  setSearchQuery,
  setPriceRange,
  applyFilters,
} from "../../redux/slices/productsSlice";
import FilterSidebar from "../../components/common/FilterSidebar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DrawerActions, useNavigation } from "@react-navigation/native";

const DiscoverScreen = ({ navigation }: any) => {
  const [searchText, setSearchText] = useState("");
  const [filterVisible, setFilterVisible] = useState(false);

  const RECENT_SEARCHES_KEY = "@recent_searches";
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const drawerNavigation = useNavigation();

  const dispatch = useAppDispatch();
  const { filteredItems, categories, isLoading } = useAppSelector(
    (state) => state.products
  );

  // Fetch products and categories on mount
  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    loadRecentSearches();
  }, []);

  const loadRecentSearches = async () => {
    try {
      const searches = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
      if (searches) {
        setRecentSearches(JSON.parse(searches));
      }
    } catch (error) {
      console.error("Error loading recent searches:", error);
    }
  };

  const removeRecentSearch = async (item: string) => {
    const updatedSearches = recentSearches.filter((s) => s !== item);
    setRecentSearches(updatedSearches);
    await AsyncStorage.setItem(
      RECENT_SEARCHES_KEY,
      JSON.stringify(updatedSearches)
    );
  };

  const clearAllSearches = async () => {
    setRecentSearches([]);
    await AsyncStorage.removeItem(RECENT_SEARCHES_KEY);
  };

  const safeNavigateToSearch = async (term: string) => {
    try {
      if (!term) return;

      // save to recent searches (move to front)
      try {
        const updated = [
          term,
          ...recentSearches.filter((s) => s !== term),
        ].slice(0, 10);
        setRecentSearches(updated);
        await AsyncStorage.setItem(
          RECENT_SEARCHES_KEY,
          JSON.stringify(updated)
        );
      } catch (err) {
        console.warn("Failed to update recent searches", err);
      }

      // Try to navigate to parent Search screen if available
      if (navigation && typeof navigation.getParent === "function") {
        const parent = navigation.getParent();
        if (parent && typeof parent.navigate === "function") {
          parent.navigate("Search", { initialSearch: term });
          return;
        }
      }

      // Fallback: apply filters locally
      dispatch(applyFilters({ title: term }));
    } catch (err) {
      console.warn("safeNavigateToSearch failed:", err);
      dispatch(applyFilters({ title: term }));
    }
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text.length > 2) {
      dispatch(applyFilters({ title: text }));
    } else if (text.length === 0) {
      dispatch(fetchProducts());
    }
  };

  const handleApplyFilters = (filters: any) => {
    // Build params for combined filter
    const params: any = {};
    if (typeof filters.priceMin === "number")
      params.price_min = filters.priceMin;
    if (typeof filters.priceMax === "number")
      params.price_max = filters.priceMax;

    // Map selectedCategory (string) from the sidebar to a categoryId if possible
    if (
      filters.selectedCategory !== undefined &&
      filters.selectedCategory !== null
    ) {
      // If the sidebar already provided a numeric id, use it directly
      if (typeof filters.selectedCategory === "number") {
        params.categoryId = filters.selectedCategory;
      } else {
        // otherwise try to map a category name to an id
        const selectedName = String(filters.selectedCategory).toLowerCase();
        const matched = categories.find((c: any) => {
          const name = (c?.name || c?.title || "").toString().toLowerCase();
          return (
            name === selectedName ||
            name.includes(selectedName) ||
            selectedName.includes(name)
          );
        });
        if (matched && typeof matched === "object" && (matched as any).id) {
          params.categoryId = (matched as any).id;
        }
      }
    }

    console.log("[Discover] applyFilters params:", params);
    dispatch(applyFilters(params));
    setFilterVisible(false);
  };

  const handleCategoryPress = async (
    categoryId: number,
    categoryName: string
  ) => {
    try {
      if (navigation && typeof navigation.getParent === "function") {
        const parent = navigation.getParent();
        if (parent && typeof parent.navigate === "function") {
          parent.navigate("Search", {
            initialCategoryId: categoryId,
            initialCategoryName: categoryName,
          });
          return;
        }
      }
    } catch (err) {
      console.warn(
        "Navigation to Search failed, falling back to local filter",
        err
      );
    }

    dispatch(applyFilters({ categoryId }));
  };

  const mainCategories = categories.slice(0, 5);

  const renderProductCard = ({ item }: any) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("ProductDetails", { productId: item.id })
      }
      className="w-[48%] bg-gray-800 rounded-2xl overflow-hidden mb-4"
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: item.images?.[0] || item.image }}
        className="w-full h-48 bg-gray-700"
        resizeMode="cover"
      />
      <View className="p-3">
        <Text className="text-white text-sm font-medium" numberOfLines={2}>
          {item.title}
        </Text>
        <Text className="text-white text-lg font-bold mt-1">${item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      <View className="px-5 pt-16 pb-4">
        <View className="flex-row items-center justify-between mb-8">
          <TouchableOpacity
            onPress={() =>
              drawerNavigation.dispatch(DrawerActions.openDrawer())
            }
          >
            <Ionicons name="menu" size={20} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">Discover</Text>
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={20} color="white" />
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center mb-4">
          <View className="flex-1 flex-row items-center bg-[#23262F] rounded-3xl px-4 py-2 mr-3">
            <Ionicons name="search" size={20} color="#9CA3AF" />
            <TextInput
              value={searchText}
              onChangeText={(t) => {
                setSearchText(t);
                handleSearch(t);
              }}
              onSubmitEditing={async (e) => {
                const term = e.nativeEvent.text?.trim();
                if (term && term.length > 0) {
                  try {
                    const updated = [
                      term,
                      ...recentSearches.filter((s) => s !== term),
                    ].slice(0, 10);
                    setRecentSearches(updated);
                    await AsyncStorage.setItem(
                      RECENT_SEARCHES_KEY,
                      JSON.stringify(updated)
                    );
                  } catch (err) {
                    console.warn("Failed to save recent search", err);
                  }

                  try {
                    (navigation as any)
                      .getParent()
                      ?.navigate("Search", { initialSearch: term });
                  } catch (navErr) {
                    dispatch(applyFilters({ title: term }));
                  }
                }
              }}
              placeholder="Search"
              placeholderTextColor="#9CA3AF"
              className="flex-1 ml-3 text-[#9CA3AF] text-base"
              returnKeyType="search"
            />
          </View>

          <TouchableOpacity
            onPress={() => setFilterVisible(true)}
            className="w-14 h-14 bg-[#23262F] rounded-2xl items-center justify-center"
          >
            <Ionicons name="options" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {recentSearches.length > 0 && (
          <View className="mb-4">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-[#E6E8EC] text-sm font-medium">
                Recent Searches
              </Text>
              <TouchableOpacity onPress={clearAllSearches}>
                <Ionicons name="trash-outline" size={20} color="white" />
              </TouchableOpacity>
            </View>

            <View className="flex-row flex-wrap">
              {recentSearches.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setSearchText(item);
                    safeNavigateToSearch(item);
                  }}
                  className="bg-[#23262F] rounded-2xl px-6 py-4 mr-2 mb-2 flex-row items-center"
                >
                  <Text className="text-white font-semibold text-base mr-2">
                    {item}
                  </Text>
                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation();
                      removeRecentSearch(item);
                    }}
                  >
                    <Ionicons name="close" size={20} color="#9CA3AF" />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="px-5 mb-4">
          {mainCategories.map((category: any) => (
            <TouchableOpacity
              key={category.id}
              onPress={() => handleCategoryPress(category.id, category.name)}
              className="rounded-2xl overflow-hidden h-32 mb-6"
              activeOpacity={0.8}
            >
              <Image
                source={{ uri: category.image }}
                className="w-full h-full"
                resizeMode="cover"
              />
              <View className="absolute inset-0 bg-black/40 justify-center px-6">
                <Text className="text-white text-lg font-bold uppercase">
                  {category.name}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {isLoading ? (
          <View className="flex-1 items-center justify-center py-20">
            <ActivityIndicator size="large" color="#FFFFFF" />
            <Text className="text-white text-base mt-4">
              Loading products...
            </Text>
          </View>
        ) : (
          <View className="px-5">
            <Text className="text-white text-xl font-bold mb-4">
              {searchText ? `Results for "${searchText}"` : "All Products"}
            </Text>

            <View className="flex-row flex-wrap justify-between mb-24">
              {filteredItems.slice(0, 20).map((item: any) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() =>
                    navigation.navigate("ProductDetails", {
                      productId: item.id,
                    })
                  }
                  className="w-[48%] bg-gray-800 rounded-2xl overflow-hidden mb-4"
                  activeOpacity={0.8}
                >
                  <Image
                    source={{ uri: item.images?.[0] || item.image }}
                    className="w-full h-48 bg-gray-700"
                    resizeMode="cover"
                  />
                  <View className="p-3">
                    <Text
                      className="text-white text-sm font-medium"
                      numberOfLines={2}
                    >
                      {item.title}
                    </Text>
                    <Text className="text-white text-lg font-bold mt-1">
                      ${item.price}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      <Modal
        isVisible={filterVisible}
        onBackdropPress={() => setFilterVisible(false)}
        animationIn="slideInRight"
        animationOut="slideOutRight"
        animationInTiming={300}
        animationOutTiming={300}
        backdropOpacity={0.7}
        useNativeDriver={true}
        statusBarTranslucent={true}
        style={{ margin: 0, justifyContent: "flex-end", flexDirection: "row" }}
      >
        <View style={{ width: "85%", height: "100%" }}>
          <FilterSidebar
            onClose={() => setFilterVisible(false)}
            onApply={handleApplyFilters}
            categories={categories}
          />
        </View>
      </Modal>
    </View>
  );
};

export default DiscoverScreen;
