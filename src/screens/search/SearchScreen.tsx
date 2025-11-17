import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Modal from "react-native-modal";
import FilterSidebar from "../../components/common/FilterSidebar";
import { toggleWishlist } from "../../redux/slices/wishlistSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { applyFilters, fetchProducts } from "../../redux/slices/productsSlice";

const RECENT_SEARCHES_KEY = "@recent_searches";

const SearchScreen = ({ navigation, route }: any) => {
  const { initialSearch, initialCategoryId, initialCategoryName } =
    route.params || {};
  const [searchText, setSearchText] = useState(
    initialSearch || initialCategoryName || ""
  );
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const dispatch = useAppDispatch();
  const { filteredItems, isLoading } = useAppSelector(
    (state) => state.products
  );
  const wishlistIds = useAppSelector(
    (state) => (state as any).wishlist?.items || []
  );
  const [filterVisible, setFilterVisible] = useState(false);
  const categories = useAppSelector((s) => s.products.categories);

  useEffect(() => {
    loadRecentSearches();
    if (initialSearch) {
      handleSearch(initialSearch);
    }

    if (initialCategoryId) {
      setSearchText(
        (prev: string) => prev || String(initialCategoryName || "")
      );
      dispatch(applyFilters({ categoryId: initialCategoryId }));
    }
    if (!initialSearch && filteredItems.length === 0) {
      dispatch(fetchProducts());
    }
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

  const saveRecentSearch = async (query: string) => {
    try {
      const trimmedQuery = query.trim();
      if (!trimmedQuery) return;

      const updatedSearches = [
        trimmedQuery,
        ...recentSearches.filter(
          (s) => s.toLowerCase() !== trimmedQuery.toLowerCase()
        ),
      ].slice(0, 10);

      setRecentSearches(updatedSearches);
      await AsyncStorage.setItem(
        RECENT_SEARCHES_KEY,
        JSON.stringify(updatedSearches)
      );
    } catch (error) {
      console.error("Error saving recent search:", error);
    }
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text.length > 0) {
      saveRecentSearch(text);
      dispatch(applyFilters({ title: text }));
    }
  };

  const removeRecentSearch = async (query: string) => {
    const updatedSearches = recentSearches.filter((s) => s !== query);
    setRecentSearches(updatedSearches);
    await AsyncStorage.setItem(
      RECENT_SEARCHES_KEY,
      JSON.stringify(updatedSearches)
    );
  };

  const renderProductCard = ({ item }: any) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("ProductDetails", { productId: item.id })
      }
      className="w-[48%] mb-8"
      activeOpacity={0.8}
    >
      <View className="relative rounded-2xl overflow-hidden bg-gray-200 mb-2">
        <Image
          source={{ uri: item.images?.[0] || item.image }}
          className="w-full h-56"
          resizeMode="cover"
        />
        <TouchableOpacity
          className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full items-center justify-center"
          onPress={(e) => {
            e.stopPropagation();
            dispatch(toggleWishlist(item));
          }}
        >
          <Ionicons
            name={wishlistIds.includes(item.id) ? "heart" : "heart-outline"}
            size={20}
            color={wishlistIds.includes(item.id) ? "#EF4444" : "#1F2937"}
          />
        </TouchableOpacity>
      </View>

      <Text
        className="text-[#FCFCFD] text-xs font-normal mb-1"
        numberOfLines={1}
      >
        {item.title}
      </Text>

      <View className="flex-row items-center justify-between">
        <Text className="text-[#FCFCFD] text-base font-bold">
          ${item.price}
        </Text>

        {item.price < 100 && (
          <Text className="text-gray-100 text-xs line-through mt-1">
            ${(item.price * 1.5).toFixed(2)}
          </Text>
        )}
      </View>

      <View className="flex-row items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= 4 ? "star" : "star-outline"}
            size={12}
            color="#508A7B"
          />
        ))}
        <Text className="text-gray-400 text-xs ml-1">(64)</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      <View className="px-5 pt-14 pb-4">
        <View className="flex-row items-center justify-between mb-6">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 items-center justify-center"
          >
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>

          <Text className="text-white text-lg font-bold">{searchText}</Text>

          <View className="w-10" />
        </View>

        <View className="flex-row items-center justify-between">
          <Text className="text-white text-xl font-bold">
            Found{"\n"}
            {filteredItems.length} Results
          </Text>

          <TouchableOpacity
            onPress={() => setFilterVisible(true)}
            className="flex-row items-center bg-[#23262F] rounded-full px-4 py-2"
          >
            <Text className="text-white text-sm mr-2">Filter</Text>
            <Ionicons name="chevron-down" size={16} color="white" />
          </TouchableOpacity>
        </View>
      </View>

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
            onApply={(filters: any) => {
              const params: any = {};
              if (typeof filters.priceMin === "number")
                params.price_min = filters.priceMin;
              if (typeof filters.priceMax === "number")
                params.price_max = filters.priceMax;
              if (
                filters.selectedCategory !== undefined &&
                filters.selectedCategory !== null
              ) {
                if (typeof filters.selectedCategory === "number") {
                  params.categoryId = filters.selectedCategory;
                } else {
                  const selectedName = String(
                    filters.selectedCategory
                  ).toLowerCase();
                  const matched = categories.find((c: any) => {
                    const name = (c?.name || c?.title || "")
                      .toString()
                      .toLowerCase();
                    return (
                      name === selectedName ||
                      name.includes(selectedName) ||
                      selectedName.includes(name)
                    );
                  });
                  if (matched && (matched as any).id) {
                    params.categoryId = (matched as any).id;
                  } else {
                    params.title = selectedName;
                  }
                }
              }
              dispatch(applyFilters(params));
              setFilterVisible(false);
            }}
            categories={categories}
          />
        </View>
      </Modal>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text className="text-white text-base mt-4">Loading...</Text>
        </View>
      ) : filteredItems.length > 0 ? (
        <FlatList
          data={filteredItems}
          renderItem={renderProductCard}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: "space-between",
            paddingHorizontal: 20,
          }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      ) : (
        <View className="flex-1 items-center justify-center">
          <Ionicons name="search-outline" size={80} color="#4B5563" />
          <Text className="text-white text-lg mt-4">No results found</Text>
          <Text className="text-gray-400 text-sm mt-2">
            Try different keywords
          </Text>
        </View>
      )}
    </View>
  );
};

export default SearchScreen;
