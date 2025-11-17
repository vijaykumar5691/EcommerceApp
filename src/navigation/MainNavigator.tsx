import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MainStackParamList } from "../types";

import BottomTabNavigator from "./BottomTabNavigator";
import CustomDrawer from "../components/common/CustomDrawer";
import AddressScreen from "../screens/profile/AddressScreen";
import WishlistScreen from "../screens/profile/WishlistScreen";
import ProductDetailsScreen from "../components/product/ProductDetailsScreen";
import SearchScreen from "../screens/search/SearchScreen";
import CheckoutScreen from "../screens/cart/CheckoutScreen";
import OrderConfirmationScreen from "../screens/cart/OrderConfirmationScreen";
import PaymentScreen from "../screens/cart/PaymentScreen";

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator<MainStackParamList>();

const MainStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="HomeTabs" component={BottomTabNavigator} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="Address" component={AddressScreen} />
      <Stack.Screen name="Wishlist" component={WishlistScreen} />
      <Stack.Screen
        name="OrderConfirmation"
        component={OrderConfirmationScreen}
      />
    </Stack.Navigator>
  );
};

const MainNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: "front",
        drawerPosition: "left",
        drawerStyle: {
          width: "80%",
          backgroundColor: "#0f172a",
        },
        overlayColor: "rgba(0, 0, 0, 0.7)",
        // @ts-ignore
        sceneContainerStyle: {
          backgroundColor: "#0f172a",
        },
        swipeEdgeWidth: 50,
        swipeEnabled: true,
      }}
    >
      <Drawer.Screen name="Main" component={MainStack} />
    </Drawer.Navigator>
  );
};

export default MainNavigator;
