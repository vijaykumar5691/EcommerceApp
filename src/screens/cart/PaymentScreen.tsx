import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { clearCart } from "../../redux/slices/cartSlice";

const PaymentScreen = ({ navigation, route }: any) => {
  const { shippingData } = route.params;
  const dispatch = useAppDispatch();
  const { totalAmount } = useAppSelector((state) => state.cart);

  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState("credit-card");
  const [selectedCard, setSelectedCard] = useState(0);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const paymentMethods = [
    { id: "cash", label: "Cash", icon: "cash" },
    { id: "credit-card", label: "Credit Card", icon: "card" },
    { id: "more", label: "", icon: "ellipsis-horizontal" },
  ];

  const savedCards = [
    {
      id: 0,
      type: "visa",
      number: "4364 1345 8932 8378",
      holder: "Vijay Kumar",
      expiry: "05/24",
      color: "from-blue-400 to-blue-600",
    },
  ];

  const checkoutMethods = [
    // { id: "paypal", icon: require("../../../assets/paypal.png") },
    // { id: "visa", icon: require("../../../assets/visa.png") },
    // { id: "mastercard", icon: require("../../../assets/mastercard.png") },
    // { id: "apple-pay", icon: require("../../../assets/apple-pay.png") },
    // { id: "amex", icon: require("../../../assets/amex.png") },
  ];

  const shippingCost =
    shippingData.selectedShipping === "free"
      ? 0
      : shippingData.selectedShipping === "fast"
      ? 9.9
      : 9.9;

  const finalTotal = totalAmount + shippingCost;

  const handlePlaceOrder = () => {
    if (!agreeTerms) {
      Alert.alert("Error", "Please agree to Terms and Conditions");
      return;
    }

    const orderData = {
      shippingInfo: shippingData,
      paymentMethod: selectedPaymentMethod,
      selectedCard: savedCards[selectedCard],
      productPrice: totalAmount,
      shippingCost: shippingCost === 0 ? "Freeship" : `$${shippingCost}`,
      total: finalTotal,
    };

    dispatch(clearCart());
    navigation.navigate("OrderConfirmation", { orderData });
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      <View className="px-5 pt-16 pb-4">
        <View className="w-11 h-11  rounded-full bg-background items-center justify-center">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 items-center justify-center"
          >
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-center -mt-6 ">
          <Text className="text-white text-xl font-bold ">Check out</Text>
        </View>

        <View className="flex-row items-center px-6 justify-between mt-6 ">
          <View className="items-center">
            <View className="w-8 h-8 bg-white rounded-full items-center justify-center">
              <Ionicons name="location" size={18} color="black" />
            </View>
          </View>

          <View
            className="flex-1 mx-2"
            style={{
              borderBottomWidth: 1,
              borderStyle: "dashed",
              borderBottomColor: "#ffffff",
            }}
          />

          <View className="items-center">
            <View className="w-8 h-8 bg-gray-700 rounded-full items-center justify-center">
              <Ionicons name="card" size={22} color="#ffffff" />
            </View>
          </View>

          <View
            className="flex-1 mx-2"
            style={{
              borderBottomWidth: 1,
              borderStyle: "dashed",
              borderBottomColor: "#777E90",
            }}
          />

          <View className="items-center">
            <View className="w-6 h-6 bg-[#777E90] rounded-full items-center justify-center">
              <Ionicons name="checkmark" size={16} color="black" />
            </View>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <Text className="text-white text-xs font-light mt-4 mb-3">STEP 2</Text>
        <Text className="text-white text-2xl font-bold mb-10">Payment</Text>

        <View className="flex-row mb-6">
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              onPress={() => setSelectedPaymentMethod(method.id)}
              className={`flex-1 mr-3 rounded-2xl p-4 items-center justify-center ${
                selectedPaymentMethod === method.id
                  ? "bg-[#FCFCFD]"
                  : "bg-[#23262F]"
              }`}
              style={{ height: 68 }}
            >
              <Ionicons
                name={method.icon as any}
                size={32}
                color={
                  selectedPaymentMethod === method.id ? "black" : "#E6E8EC"
                }
              />
              {method.label && (
                <Text
                  className={`text-sm font-semibold mt-2 ${
                    selectedPaymentMethod === method.id
                      ? "text-[23262F]"
                      : "text-[#E6E8EC]"
                  }`}
                >
                  {method.label}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-[#FCFCFD] text-base font-bold">
            Choose your card
          </Text>
          <TouchableOpacity>
            <Text className="text-[#F20000] text-xs font-normal">Add new+</Text>
          </TouchableOpacity>
        </View>

        <View className=" bg-[#3DA9E4] rounded-2xl p-6 mb-6">
          <View className="flex-row justify-between items-start mb-8">
            <View className="w-12 h-12 bg-white/20 rounded-lg" />
            <Text className="text-white text-2xl font-bold">VISA</Text>
          </View>

          <Text className="text-white text-xl font-mono tracking-widest mb-6">
            {savedCards[selectedCard].number}
          </Text>

          <View className="flex-row justify-between">
            <View>
              <Text className="text-white/70 text-xs mb-1">
                CARDHOLDER NAME
              </Text>
              <Text className="text-white text-sm font-semibold">
                {savedCards[selectedCard].holder}
              </Text>
            </View>
            <View>
              <Text className="text-white/70 text-xs mb-1">VALID THRU</Text>
              <Text className="text-white text-sm font-semibold">
                {savedCards[selectedCard].expiry}
              </Text>
            </View>
          </View>
        </View>

        <Text className="text-white font-medium text-xs mb-4">
          or check out with
        </Text>
        <View className="flex-row mb-6">
          <TouchableOpacity className="w-20 h-14 bg-black rounded-2xl  items-center justify-center mr-3">
            <Ionicons name="logo-paypal" size={24} color="#0070BA" />
          </TouchableOpacity>
          <TouchableOpacity className="w-20 h-14 bg-black rounded-2xl items-center justify-center mr-3">
            <Text className="text-blue-600 text-lg font-bold">VISA</Text>
          </TouchableOpacity>
          <TouchableOpacity className="w-16 h-14 bg-black rounded-2xl items-center justify-center mr-3">
            <View className="flex-row">
              <View className="w-4 h-4 rounded-full bg-red-500 mr-[-8]" />
              <View className="w-4 h-4 rounded-full bg-orange-500" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity className="w-16 h-14 bg-black rounded-2xl items-center justify-center mr-3">
            <Ionicons name="logo-apple" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity className="w-20 h-14 bg-black rounded-2xl items-center justify-center">
            <Text className="text-white text-xs font-bold">AMEX</Text>
          </TouchableOpacity>
        </View>

        <View className=" pt-4 mb-4">
          <View className="flex-row py-4 border-b border-[#23262F] justify-between mb-3">
            <Text className="text-[#E6E8EC] font-medium text-sm">
              Product price
            </Text>
            <Text className="text-white font-medium text-sm">
              ${totalAmount}
            </Text>
          </View>

          <View className="flex-row py-4 border-b border-[#23262F] justify-between mb-4">
            <Text className="text-[#E6E8EC] font-medium text-sm">Shipping</Text>
            <Text className="text-white font-medium text-sm">
              {shippingCost === 0 ? "Freeship" : `$${shippingCost}`}
            </Text>
          </View>

          <View className="flex-row justify-between mb-6 pt-3 border-t border-gray-800">
            <Text className="text-[#E6E8EC] text-base font-semibold">
              Subtotal
            </Text>
            <Text className="text-white text-xl font-bold">${finalTotal}</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => setAgreeTerms(!agreeTerms)}
          className="flex-row items-start mb-6"
        >
          <View
            className={`w-5 h-5 rounded mr-3 items-center justify-center ${
              agreeTerms ? "bg-[#5ECE7B]" : "border border-[#FCFCFD]"
            }`}
          >
            {agreeTerms && (
              <Ionicons name="checkmark" size={14} color="white" />
            )}
          </View>
          <Text className="flex-1 text-white font-light text-base">
            I agree to <Text className="underline">Terms and conditions</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 bg-background px-5 py-4 ">
        <TouchableOpacity
          onPress={handlePlaceOrder}
          className="bg-white rounded-full my-6 py-4"
        >
          <Text className="text-black text-center text-lg font-bold">
            Place my order
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PaymentScreen;
