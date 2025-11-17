import React, { useEffect } from "react";
import { Alert } from "react-native";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainStackParamList } from "../../types";
import { Ionicons } from "@expo/vector-icons";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  fetchProducts,
  setSelectedCategory,
  clearFilters,
  filterByCategory,
} from "../../redux/slices/productsSlice";
import ProductCard from "../../components/product/ProductCard";
import CategoryIcon from "../../components/common/CategoryIcon";
import { getCategoryAssets } from "../../constants/categoryAssets";

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<MainStackParamList, "HomeTabs">;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const drawerNavigation = useNavigation();

  const { filteredItems, isLoading, categories, selectedCategory } =
    useAppSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const navigateToProduct = (productId: number) => {
    navigation.navigate("ProductDetails", { productId });
  };

  const handleCategoryPress = async (cat: any, isActive: boolean) => {
    try {
      if (isActive) {
        dispatch(clearFilters());
        dispatch(setSelectedCategory(null));
        dispatch(fetchProducts());
      } else {
        dispatch(setSelectedCategory(cat.id));
        if (cat.id) await dispatch(filterByCategory(cat.id));
      }
    } catch (err: any) {
      console.error("Error handling category press:", err);
      Alert.alert("Error", err?.message || String(err));
    }
  };

  const featureProducts = filteredItems.slice(0, 5);
  const recommendedProducts = filteredItems.slice(5, 10);
  const topCollection = filteredItems.slice(10, 15);

  const selectedIdx =
    (categories &&
      categories.findIndex((c: any) => c.id === selectedCategory)) ||
    0;
  const categoryAssets = getCategoryAssets(selectedIdx ?? 0);

  const bottomLeftProduct =
    topCollection[2] ?? topCollection[0] ?? featureProducts[0] ?? null;
  const bottomRightProduct =
    topCollection[1] ?? topCollection[0] ?? featureProducts[1] ?? null;

  const splitTitleLines = (title?: string, parts = 2) => {
    if (!title) return Array(parts).fill("");
    const words = title.split(" ");
    const chunk = Math.ceil(words.length / parts) || 1;
    const lines: string[] = [];
    for (let i = 0; i < parts; i++) {
      lines.push(words.slice(i * chunk, (i + 1) * chunk).join(" "));
    }
    return lines;
  };

  const productImageSource = (p: any, fallback: any) => {
    if (!p) return fallback;
    if (p.image) return { uri: p.image };
    if (p.images && p.images.length > 0) return { uri: p.images[0] };
    return fallback;
  };

  const top0 = topCollection[0] ?? null;
  const top1 = topCollection[1] ?? null;
  const top0Lines = top0
    ? splitTitleLines(top0.title, 2)
    : ["FOR SLIM", "& BEAUTY"];
  const top1Lines = top1
    ? splitTitleLines(top1.title, 2)
    : ["Most sexy", "& fabulous design"];

  const bottomLeftTitle = bottomLeftProduct?.title || "The Office Life";
  const bottomLeftCategory =
    typeof bottomLeftProduct?.category === "string"
      ? (bottomLeftProduct?.category as string)
      : bottomLeftProduct?.category?.name || "T-Shirts";
  const [bottomLeftLine1, bottomLeftLine2] = splitTitleLines(
    bottomLeftTitle,
    2
  );

  const bottomRightTitle = bottomRightProduct?.title || "Elegant Design";
  const bottomRightCategory =
    typeof bottomRightProduct?.category === "string"
      ? (bottomRightProduct?.category as string)
      : bottomRightProduct?.category?.name || "Dresses";
  const [bottomRightLine1, bottomRightLine2] = splitTitleLines(
    bottomRightTitle,
    2
  );

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#141416]">
        <StatusBar barStyle="light-content" backgroundColor="#141416" />
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#2F2F37]">
      <StatusBar barStyle="light-content" backgroundColor="#141416" />

      <ScrollView className="mt-6 " showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center justify-between px-6 pt-12 pb-5">
          <TouchableOpacity
            onPress={() =>
              drawerNavigation.dispatch(DrawerActions.openDrawer())
            }
          >
            <Ionicons name="menu" size={20} color="white" />
          </TouchableOpacity>

          <Text className="text-[#FCFCFD] text-xl font-bold">Stylinx</Text>

          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={20} color="white" />
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-8 my-4"
          contentContainerStyle={{ alignItems: "center" }}
        >
          <View
            style={{
              minWidth: "100%",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 16,
            }}
          >
            {categories && categories.length > 0 ? (
              categories.slice(0, 9).map((cat: any, idx: number) => {
                const label = cat.name || cat.title || String(cat);
                const iconKey = (label || "").toLowerCase().includes("men")
                  ? "man"
                  : (label || "").toLowerCase().includes("glass") ||
                    (label || "").toLowerCase().includes("access")
                  ? "glasses-outline"
                  : (label || "").toLowerCase().includes("beaut")
                  ? "cut-outline"
                  : "woman";

                const isActive = selectedCategory === cat.id;

                return (
                  <CategoryIcon
                    key={cat.id ?? label}
                    icon={iconKey}
                    label={label}
                    isActive={!!isActive}
                    imageUri={cat.image || cat.icon || null}
                    onPress={() => handleCategoryPress(cat, !!isActive)}
                  />
                );
              })
            ) : (
              <>
                <CategoryIcon icon="woman" label="Women" onPress={() => {}} />
                <CategoryIcon icon="man" label="Men" onPress={() => {}} />
                <CategoryIcon
                  icon="glasses-outline"
                  label="Accessories"
                  onPress={() => {}}
                />
                <CategoryIcon
                  icon="cut-outline"
                  label="Beauty"
                  onPress={() => {}}
                />
              </>
            )}
          </View>
        </ScrollView>

        <View className="mx-6 my-4 rounded-3xl overflow-hidden h-48 ">
          <Image
            source={(() => {
              const currentCat: any = categories?.find(
                (c: any) => c.id === selectedCategory
              );
              if (
                currentCat &&
                typeof currentCat === "object" &&
                currentCat.image
              ) {
                return { uri: currentCat.image };
              }
              return require("../../assets/images/herobanner1.png");
            })()}
            className="w-full h-full"
            resizeMode="cover"
          />
          <View className="absolute inset-0 bg-black/30 justify-center px-6">
            <View className="flex-1 justify-center items-end pr-6">
              <Text className="text-white text-3xl font-bold text-right">
                Autumn
              </Text>
              <Text className="text-white text-3xl font-bold text-right">
                Collection
              </Text>
              <Text className="text-white text-2xl font-bold text-right">
                2025
              </Text>
            </View>
            <View className="absolute left-0 right-0 bottom-4 flex-row justify-center gap-2 space-x-2">
              <View className="w-2 h-2 bg-white rounded-full opacity-80" />
              <View className="w-2 h-2 bg-white rounded-full opacity-40" />
              <View className="w-2 h-2 bg-white rounded-full opacity-40" />
            </View>
          </View>
        </View>

        <View className="mt-4">
          <View className="flex-row justify-between items-center px-5 mb-3">
            <Text className="text-white text-xl font-bold">
              Feature Products
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Search", {})}>
              <Text className="text-white text-sm ">Show all</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            horizontal
            data={featureProducts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <ProductCard
                product={item}
                onPress={() => navigateToProduct(item.id)}
                size="medium"
                variant="featured"
              />
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
          />
        </View>

        <View className=" my-6  bg-[#23262F] overflow-hidden flex-row h-40">
          <View className="flex-1 justify-center pl-10">
            <Text className="text-[#B1B5C3] text-xs font-light uppercase mb-2">
              | NEW COLLECTION
            </Text>
            <Text className="text-white text-xl mt-3 font-light">HANG OUT</Text>
            <Text className="text-white text-xl font-light">& PARTY</Text>
          </View>
          <View className="relative w-36 h-36 mt-2 mr-6">
            <Image
              source={(() => {
                const idx =
                  categories?.findIndex(
                    (c: any) => c.id === selectedCategory
                  ) ?? 0;
                const assets = getCategoryAssets(idx);
                return (
                  assets?.hangout ||
                  require("../../assets/images/circleBackground.png")
                );
              })()}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
          <View className="absolute right-0 w-36 h-full mt-2 mr-6">
            <Image
              source={(() => {
                const idx =
                  categories?.findIndex(
                    (c: any) => c.id === selectedCategory
                  ) ?? 0;
                const assets = getCategoryAssets(idx);
                return (
                  assets?.hangout ||
                  require("../../assets/images/circleimage.png")
                );
              })()}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
        </View>

        <View className="mt-4">
          <View className="flex-row justify-between items-center px-5 mb-3">
            <Text className="text-white text-xl font-bold">Recommended</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Search", {})}>
              <Text className="text-white text-sm ">Show all</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 20,
              alignItems: "center",
            }}
          >
            {recommendedProducts.map((product) => (
              <TouchableOpacity
                key={product.id}
                onPress={() => navigateToProduct(product.id)}
                activeOpacity={0.9}
                className="mr-4 mt-6"
                style={{ width: 260 }}
              >
                <View className="bg-background  rounded-2xl flex-row items-center pr-3  shadow-md">
                  <View className="w-20 h-20 rounded-lg overflow-hidden ">
                    <Image
                      source={{ uri: product.image || product.images?.[0] }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  </View>

                  <View className="ml-3  flex-1">
                    <Text
                      className="text-[#FCFCFD] mb-1 text-xs font-medium"
                      numberOfLines={1}
                    >
                      {product.title}
                    </Text>
                    <Text className="text-[#FCFCFD] text-base font-bold mt-1">
                      {typeof product.price === "number"
                        ? `$ ${product.price.toFixed(2)}`
                        : `$ ${product.price}`}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View className="mt-8">
          <View className="flex-row justify-between items-center px-5 mb-3">
            <Text className="text-white text-xl font-bold">Top Collection</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Search", {})}>
              <Text className="text-[#E6E8EC] text-sm ">Show all</Text>
            </TouchableOpacity>
          </View>

          <View className="mx-5 mt-6 mb-4 rounded-xl bg-[#23262F] overflow-hidden flex-row h-40">
            <View className="flex-1 justify-center px-6">
              <Text className="text-[#F4F5F6] text-xs font-light uppercase mb-5">
                {top0?.category
                  ? `| ${String(top0.category).toUpperCase()}`
                  : "| Sale up to 40%"}
              </Text>
              <Text className="text-[#FCFCFD] text-xl font-light">
                {top0Lines[0]}
              </Text>
              <Text className="text-[#FCFCFD] text-xl font-light">
                {top0Lines[1]}
              </Text>
            </View>
            <View className="relative w-24 h-24 mt-8 mr-9">
              <Image
                source={
                  (topCollection[0]?.image && {
                    uri: topCollection[0].image,
                  }) ||
                  (topCollection[0]?.images?.[0] && {
                    uri: topCollection[0].images?.[0],
                  }) ||
                  categoryAssets?.topCollection ||
                  require("../../assets/images/circleBackground.png")
                }
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
            <View className="absolute right-0 w-36 h-full mt-2 ">
              <Image
                source={productImageSource(
                  top0,
                  categoryAssets?.topCollection ||
                    require("../../assets/images/image2.png")
                )}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
          </View>

          <View className="mx-5  mb-4 rounded-xl bg-[#23262F] overflow-hidden flex-row h-52">
            <View className="flex-1 justify-center px-6">
              <Text className="text-[#F4F5F6] text-xs font-light uppercase mb-5">
                | Summer Collection 2025
              </Text>
              <Text className="text-[#FCFCFD] text-xl font-medium">
                {top1Lines[0]}
              </Text>
              <Text className="text-[#FCFCFD] text-xl font-medium">
                {top1Lines[1]}
              </Text>
            </View>
            <View className="relative w-32 h-32 mt-9 mr-5">
              <Image
                source={
                  (topCollection[1]?.image && {
                    uri: topCollection[1].image,
                  }) ||
                  (topCollection[1]?.images?.[0] && {
                    uri: topCollection[1].images?.[0],
                  }) ||
                  categoryAssets?.topCollection ||
                  require("../../assets/images/circleBackground.png")
                }
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
            <View className="absolute right-0 w-36 h-full ">
              <Image
                source={productImageSource(
                  top1,
                  categoryAssets?.topCollection ||
                    require("../../assets/images/image3.png")
                )}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
          </View>

          <View className="flex-row px-5 pb-20">
            <View className="flex-1 mr-2">
              <TouchableOpacity
                className="bg-[#23262F] rounded-2xl overflow-hidden mb-4 h-48"
                activeOpacity={0.9}
              >
                <View className="flex-row items-center h-full">
                  <View className="w-1/2 h-full rounded-l-2xl overflow-hidden">
                    <Image
                      source={productImageSource(
                        bottomLeftProduct,
                        categoryAssets?.bottomLeft ||
                          require("../../assets/images/image4.png")
                      )}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  </View>

                  <View className="flex-1 px-4 py-6 h-full justify-center">
                    <Text
                      className="text-[#B1B5C3] mb-2 font-regular text-xs"
                      numberOfLines={1}
                    >
                      {bottomLeftCategory}
                    </Text>
                    <Text
                      className="text-[#FCFCFD] text-lg font-light leading-tight mt-2"
                      numberOfLines={1}
                    >
                      {bottomLeftLine1}
                    </Text>
                    <Text
                      className="text-[#FCFCFD] text-lg font-light"
                      numberOfLines={1}
                    >
                      {bottomLeftLine2}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            <View className="flex-1 ml-2">
              <TouchableOpacity
                className="bg-[#23262F] rounded-2xl overflow-hidden mb-4 h-48"
                activeOpacity={0.9}
              >
                <View className="flex-row items-center h-full">
                  <View className="flex-1 px-4 py-6 h-full justify-center">
                    <Text
                      className="text-[#B1B5C3] mb-2 font-regular text-xs"
                      numberOfLines={1}
                    >
                      {bottomRightCategory}
                    </Text>
                    <Text
                      className="text-[#FCFCFD] text-lg font-light leading-tight mt-2"
                      numberOfLines={1}
                    >
                      {bottomRightLine1}
                    </Text>
                    <Text
                      className="text-[#FCFCFD] text-lg font-light"
                      numberOfLines={1}
                    >
                      {bottomRightLine2}
                    </Text>
                  </View>
                  <View className="w-1/2 h-full rounded-l-2xl overflow-hidden ">
                    <Image
                      source={productImageSource(
                        bottomRightProduct,
                        categoryAssets?.bottomRight ||
                          require("../../assets/images/image5.png")
                      )}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
