import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  FlatList,
  Dimensions,
  Alert,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { addToCart } from "../../redux/slices/cartSlice";
import { productService } from "../../services/api";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Enable LayoutAnimation for Android
if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const ProductDetailsScreen = ({ navigation, route }: any) => {
  const { productId } = route.params;
  const [product, setProduct] = useState<any>(null);
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState("M");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isReviewsExpanded, setIsReviewsExpanded] = useState(false);
  const [isSimilarExpanded, setIsSimilarExpanded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isDescriptionFull, setIsDescriptionFull] = useState(false);

  const dispatch = useAppDispatch();
  const flatListRef = useRef<FlatList>(null);
  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });
  const onViewRef = useRef(({ viewableItems }: any) => {
    if (viewableItems && viewableItems.length > 0) {
      const idx = viewableItems[0].index ?? 0;
      setCurrentImageIndex(idx);
    }
  });

  useEffect(() => {
    fetchProductDetails();
    fetchSimilarProducts();
  }, [productId]);

  const fetchProductDetails = async () => {
    try {
      const data = await productService.getProductById(productId);
      setProduct(data);
    } catch (error) {
      Alert.alert("Error", "Failed to load product details");
    }
  };

  const fetchSimilarProducts = async () => {
    try {
      const data = await productService.getAllProducts();
      setSimilarProducts(data.slice(0, 5));
    } catch (error) {
      console.error("Error fetching similar products:", error);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      dispatch(
        addToCart({
          ...product,
          selectedSize,
          selectedColor: colors[selectedColor].name,
        })
      );

      // Navigate to Cart tab
      navigation.navigate("HomeTabs", { screen: "Cart" });
    }
  };

  const toggleDescription = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  const toggleReviews = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsReviewsExpanded(!isReviewsExpanded);
  };

  const toggleSimilar = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsSimilarExpanded(!isSimilarExpanded);
  };

  const colors = [
    { name: "Beige", color: "#F5DEB3" },
    { name: "Black", color: "#000000" },
    { name: "Red", color: "#EF4444" },
  ];

  const sizes = ["S", "M", "L"];

  const reviews = [
    {
      id: 1,
      name: "Jennifer Rose",
      rating: 5,
      comment:
        "I love it. Awesome customer service! Helped me out with adding an additional item to my order. Thanks again!",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    {
      id: 2,
      name: "Kelly Rihana",
      rating: 5,
      comment:
        "I'm very happy with order. It was delivered on good and good quality. Recommended!",
      avatar: "https://i.pravatar.cc/150?img=5",
    },
  ];

  const renderImageCarousel = ({ item }: any) => (
    <Image
      source={{ uri: item }}
      style={{ width: SCREEN_WIDTH, height: 400 }}
      resizeMode="cover"
    />
  );

  const renderDotIndicator = () => {
    if (!product?.images) return null;

    return (
      <View className="flex-row justify-center absolute bottom-4 w-full">
        {product.images.map((_: any, index: number) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              try {
                flatListRef.current?.scrollToIndex({ index, animated: true });
                setCurrentImageIndex(index);
              } catch (err) {
                flatListRef.current?.scrollToOffset({
                  offset: index * SCREEN_WIDTH,
                  animated: true,
                } as any);
                setCurrentImageIndex(index);
              }
            }}
            activeOpacity={0.8}
          >
            <View
              className={`h-2 rounded-full mx-1 ${
                index === currentImageIndex ? "w-6 bg-white" : "w-2 bg-white/50"
              }`}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderSimilarProduct = ({ item }: any) => (
    <TouchableOpacity
      onPress={() => navigation.push("ProductDetails", { productId: item.id })}
      className="mr-4"
      style={{ width: 140 }}
    >
      {/* Product Image with white background like Figma */}
      <View className="bg-white rounded-2xl overflow-hidden mb-2">
        <Image
          source={{ uri: item.images?.[0] || item.image }}
          className="w-full h-44"
          resizeMode="cover"
        />
      </View>

      {/* Product Title */}
      <Text
        className="text-[#FCFCFD] text-xs font-medium mb-2"
        numberOfLines={1}
      >
        {item.title}
      </Text>

      {/* Price */}
      <Text className="text-[#FCFCFD] text-base font-bold">${item.price}</Text>
    </TouchableOpacity>
  );

  if (!product) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <Text className="text-white">Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Carousel */}
        <View className="relative">
          <FlatList
            ref={flatListRef}
            data={product.images || [product.image]}
            renderItem={renderImageCarousel}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(
                event.nativeEvent.contentOffset.x / SCREEN_WIDTH
              );
              setCurrentImageIndex(index);
            }}
            onViewableItemsChanged={onViewRef.current}
            viewabilityConfig={viewConfigRef.current}
            getItemLayout={(_, index) => ({
              length: SCREEN_WIDTH,
              offset: SCREEN_WIDTH * index,
              index,
            })}
            initialNumToRender={1}
          />

          {/* Back Button */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="absolute top-16 left-8 w-10 h-10 bg-background rounded-full items-center justify-center"
          >
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>

          {/* Favorite Button */}
          <TouchableOpacity
            onPress={() => setIsFavorite(!isFavorite)}
            className="absolute top-16 right-8 w-10 h-10 bg-white rounded-full items-center justify-center"
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={20}
              color={isFavorite ? "#FF6E6E" : "#1F2937"}
            />
          </TouchableOpacity>

          {/* Dot Indicators */}
          {renderDotIndicator()}
        </View>

        {/* Product Info */}
        <View
          className="px-5  py-16"
          style={{
            bottom: 20,
            backgroundColor: "#141416",
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            overflow: "hidden",
            zIndex: 50,
            elevation: 8,
          }}
        >
          <View className="flex-row mb-3 items-center justify-between">
            {/* Title and Price */}
            <Text className="text-white w-[80%] line-clamp-2 text-lg font-bold ">
              {product.title}
            </Text>
            <Text className="text-white text-2xl font-bold ">
              $ {product.price}
            </Text>
          </View>

          {/* Rating */}
          <View className="flex-row gap-1 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <Ionicons key={star} name="star" size={17} color="#508A7B" />
            ))}
            <Text className="text-white font-light text-xs mt-2 ml-2">
              (83)
            </Text>
          </View>

          <View className="flex-row mb-6 items-center border-t border-[#23262F] pt-4 justify-between">
            {/* Color Selection */}
            <View className="mb-6">
              <Text className="text-[#B1B5C3] text-sm font-medium mb-3">
                Color
              </Text>
              <View className="flex-row">
                {colors.map((color, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setSelectedColor(index)}
                    className={`w-9 h-9 rounded-full mr-3 items-center justify-center ${
                      selectedColor === index ? "border-2 border-white" : ""
                    }`}
                  >
                    <View
                      className="w-7 h-7 rounded-full"
                      style={{ backgroundColor: color.color }}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Size Selection */}
            <View className="mb-6">
              <Text className="text-[#B1B5C3] text-sm font-medium mb-3">
                Size
              </Text>
              <View className="flex-row">
                {sizes.map((size) => (
                  <TouchableOpacity
                    key={size}
                    onPress={() => setSelectedSize(size)}
                    className={`w-9 h-9 rounded-full mr-3 items-center justify-center ${
                      selectedSize === size
                        ? "bg-white"
                        : "border border-gray-600"
                    }`}
                  >
                    <Text
                      className={`text-base font-semibold ${
                        selectedSize === size ? "text-black" : "text-white"
                      }`}
                    >
                      {size}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Description Accordion */}
          <TouchableOpacity
            onPress={toggleDescription}
            className="flex-row items-center justify-between py-4 border-t border-[#23262F]"
          >
            <Text className="text-[#FCFCFD] text-base font-bold">
              Description
            </Text>
            <Ionicons
              name={isDescriptionExpanded ? "chevron-up" : "chevron-down"}
              size={22}
              color="white"
            />
          </TouchableOpacity>

          {isDescriptionExpanded && (
            <View className="pb-4">
              <Text
                className="text-[#FCFCFD] text-xs font-light leading-6"
                numberOfLines={isDescriptionFull ? undefined : 3}
              >
                {product.description ||
                  "Sportwear is no longer under culture, it is no longer indie or cobbled together as it once was. Sport is fashion today. The top is oversized in fit and style, may need to size down."}
              </Text>
              <TouchableOpacity
                className="mt-2"
                onPress={() => setIsDescriptionFull((v) => !v)}
              >
                <Text className="text-[#508A7B] text-xs font-light">
                  {isDescriptionFull ? "Show less" : "Read more"}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Reviews Accordion */}
          <TouchableOpacity
            onPress={toggleReviews}
            className="flex-row items-center justify-between py-4 border-t border-[#23262F]"
          >
            <Text className="text-[#FCFCFD] text-base font-bold">Reviews</Text>
            <Ionicons
              name={isReviewsExpanded ? "chevron-up" : "chevron-down"}
              size={22}
              color="white"
            />
          </TouchableOpacity>

          {isReviewsExpanded && (
            <View className="pb-4">
              {/* Rating Summary */}
              <View className="flex-row justify-between mb-6 items-center">
                <View className="flex-row items-center mb-6">
                  <Text className="text-[#FCFCFD] text-4xl font-bold mr-3">
                    4.9
                  </Text>
                  <Text className="text-[#E6E8EC] text-xs">OUT OF 5</Text>
                </View>
                <View className="">
                  <View className="flex-row gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Ionicons
                        key={star}
                        name="star"
                        size={18}
                        color="#508A7B"
                      />
                    ))}
                  </View>
                  <View className="flex-row items-center justify-end ">
                    <Text className="text-[#E6E8EC] font-light ml-10 text-xs mt-1">
                      83 ratings
                    </Text>
                  </View>
                </View>
              </View>

              {/* Rating Bars */}
              <View className="mb-4 w-full">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <View key={rating} className="flex-row items-center mb-2">
                    <Text className="text-[#E6E8EC] font-light text-xs w-4">
                      {rating}
                    </Text>
                    <Ionicons name="star" size={14} color="#508A7B" />
                    {/* Progress bar: white track with colored fill based on percentage */}
                    <View
                      className="flex-1 h-2 rounded-full mx-3 overflow-hidden"
                      style={{ backgroundColor: "#FFFFFF", borderRadius: 999 }}
                    >
                      <View
                        style={{
                          height: "100%",
                          backgroundColor: "#508A7B",
                          borderRadius: 999,
                          width: `${
                            rating === 5 ? 80 : rating === 4 ? 12 : 5
                          }%`,
                        }}
                      />
                    </View>
                    <Text className="text-[#E6E8EC] font-light text-xs w-10">
                      {rating === 5
                        ? "80"
                        : rating === 4
                        ? "12"
                        : rating === 3
                        ? "5"
                        : rating === 2
                        ? "3"
                        : "1"}
                      %
                    </Text>
                  </View>
                ))}
              </View>

              {/* Review List */}
              <View className="mb-4">
                <View className="flex-row items-center justify-between mb-10">
                  <Text className="text-[#E6E8EC] font-light text-xs">
                    47 Reviews
                  </Text>
                  <TouchableOpacity className="flex-row items-center">
                    <Text className="text-[#E6E8EC] font-light text-xs mr-2">
                      WRITE A REVIEW
                    </Text>
                    <Ionicons name="create-outline" size={16} color="white" />
                  </TouchableOpacity>
                </View>

                {reviews.map((review) => (
                  <View key={review.id} className="mb-6">
                    <View className="flex-row items-center mb-4">
                      <Image
                        source={{ uri: review.avatar }}
                        className="w-9 h-9 rounded-full mr-4"
                      />
                      <View>
                        <Text className="text-white text-sm font-bold">
                          {review.name}
                        </Text>
                        <View className="flex-row gap-1 mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Ionicons
                              key={star}
                              name="star"
                              size={12}
                              color="#508A7B"
                            />
                          ))}
                        </View>
                      </View>
                    </View>
                    <Text className="text-[#FCFCFD] text-xs font-light ">
                      {review.comment}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Similar Products Accordion */}
          <TouchableOpacity
            onPress={toggleSimilar}
            className="flex-row items-center justify-between py-4 border-t border-[#23262F]"
          >
            <Text className="text-[#FCFCFD] text-base font-bold">
              Similar Product
            </Text>
            <Ionicons
              name={isSimilarExpanded ? "chevron-up" : "chevron-down"}
              size={22}
              color="white"
            />
          </TouchableOpacity>

          {isSimilarExpanded && (
            <View className="py-4">
              <FlatList
                data={similarProducts}
                renderItem={renderSimilarProduct}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingRight: 20 }}
              />
            </View>
          )}
        </View>

        {/* Bottom padding for fixed button */}
        {/* <View className="h-24" /> */}
      </ScrollView>

      {/* Add to Cart Button - Fixed at Bottom */}
      <View className="rounded-t-3xl flex-row items-center justify-center bg-[#FCFCFD] px-5 py-4">
        <TouchableOpacity
          onPress={handleAddToCart}
          className="bg-white rounded-full py-4 flex-row items-center justify-center"
          activeOpacity={0.8}
        >
          <Ionicons name="bag-handle" size={20} color="#141416" />
          <Text className="text-background text-xl font-bold ml-4 mt-1">
            Add To Cart
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProductDetailsScreen;
