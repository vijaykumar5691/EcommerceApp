import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppSelector } from "../../redux/hooks";

const CheckoutScreen = ({ navigation }: any) => {
  const { totalAmount } = useAppSelector((state) => state.cart);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [country, setCountry] = useState("");
  const [streetName, setStreetName] = useState("");
  const [city, setCity] = useState("");
  const [stateProvince, setStateProvince] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedShipping, setSelectedShipping] = useState("free");
  const [couponCode, setCouponCode] = useState("");
  const [copyBillingAddress, setCopyBillingAddress] = useState(false);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!firstName.trim()) newErrors.firstName = "First name is required";
    if (!lastName.trim()) newErrors.lastName = "Last name is required";
    if (!country.trim()) newErrors.country = "Country is required";
    if (!streetName.trim()) newErrors.streetName = "Street name is required";
    if (!city.trim()) newErrors.city = "City is required";
    if (!zipCode.trim()) newErrors.zipCode = "Zip-code is required";
    if (!phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinueToPayment = () => {
    if (validateForm()) {
      navigation.navigate("Payment", {
        shippingData: {
          firstName,
          lastName,
          country,
          streetName,
          city,
          stateProvince,
          zipCode,
          phoneNumber,
          selectedShipping,
          couponCode,
          copyBillingAddress,
        },
      });
    } else {
      Alert.alert("Error", "Please fill in all required fields");
    }
  };

  const shippingOptions = [
    {
      id: "free",
      price: "Free",
      label: "Delivery to home",
      subtitle: "Delivery from 3 to 7 business days",
    },
    {
      id: "standard",
      price: "$9.90",
      label: "Delivery to home",
      subtitle: "Delivery from 4 to 6 business days",
    },
    {
      id: "fast",
      price: "$9.90",
      label: "Fast Delivery",
      subtitle: "Delivery from 2 to 3 business days",
    },
  ];
  const validateField = (field: string, value?: string) => {
    const fieldErrors: { [key: string]: string } = {};
    const v = (val?: string) => (val || "").trim();

    switch (field) {
      case "firstName":
        if (!v(value ?? firstName))
          fieldErrors.firstName = "First name is required";
        break;
      case "lastName":
        if (!v(value ?? lastName))
          fieldErrors.lastName = "Last name is required";
        break;
      case "country":
        if (!v(value ?? country)) fieldErrors.country = "Country is required";
        break;
      case "streetName":
        if (!v(value ?? streetName))
          fieldErrors.streetName = "Street name is required";
        break;
      case "city":
        if (!v(value ?? city)) fieldErrors.city = "City is required";
        break;
      case "zipCode":
        if (!v(value ?? zipCode)) fieldErrors.zipCode = "Zip-code is required";
        break;
      case "phoneNumber":
        if (!v(value ?? phoneNumber))
          fieldErrors.phoneNumber = "Phone number is required";
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, ...fieldErrors }));
    if (!fieldErrors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };
  const countries = [
    "United States",
    "India",
    "United Kingdom",
    "Canada",
    "Australia",
  ];
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      <View className="px-5 pt-16 pb-4">
        <View className="w-11 h-11 rounded-full bg-background items-center justify-center">
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

        <View className="flex-row items-center justify-between mt-6 px-6">
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
              borderBottomColor: "#777E90",
            }}
          />

          <View className="items-center">
            <View className="w-8 h-8 bg-gray-700 rounded-full items-center justify-center">
              <Ionicons name="card" size={18} color="#777E90" />
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
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <Text className="text-white text-xs font-light mt-4 mb-3">STEP 1</Text>
        <Text className="text-white text-2xl font-bold mb-10">Shipping</Text>

        <Text className="text-white font-medium text-sm mb-2">
          First name <Text className="text-red-500">*</Text>
        </Text>
        <TextInput
          className={`bg-transparent border-b text-white text-base py-2 mb-1`}
          placeholder="Vijay"
          placeholderTextColor="#4B5563"
          value={firstName}
          onChangeText={(text) => {
            setFirstName(text);
            if (errors.firstName) {
              setErrors({ ...errors, firstName: "" });
            }
          }}
          onBlur={() => {
            setTouched((t) => ({ ...t, firstName: true }));
            validateField("firstName");
          }}
          style={{
            borderBottomColor:
              touched.firstName && errors.firstName ? "#EF4444" : "#F1F2F3",
            borderBottomWidth: 1,
          }}
        />
        {touched.firstName && errors.firstName && (
          <Text className="text-red-500 text-xs mb-3">{errors.firstName}</Text>
        )}

        <Text className="text-white text-sm mb-2 mt-4">Last name</Text>
        <TextInput
          className="bg-transparent border-b text-white text-base py-2 mb-1"
          placeholder=""
          placeholderTextColor="#4B5563"
          value={lastName}
          onChangeText={(text) => {
            setLastName(text);
            if (errors.lastName) {
              setErrors({ ...errors, lastName: "" });
            }
          }}
          onBlur={() => {
            setTouched((t) => ({ ...t, lastName: true }));
            validateField("lastName");
          }}
          style={{
            borderBottomColor:
              touched.lastName && errors.lastName ? "#EF4444" : "#F1F2F3",
            borderBottomWidth: 1,
          }}
        />
        {touched.lastName && errors.lastName ? (
          <Text className="text-red-500 text-xs mb-3">{errors.lastName}</Text>
        ) : (
          <View className="mb-3" />
        )}

        <Text className="text-white text-sm mb-2 mt-4">
          Country <Text className="text-red-500">*</Text>
        </Text>
        <View
          className="mb-4"
          style={{
            borderBottomWidth: 1,
            borderBottomColor:
              touched.country && errors.country ? "#EF4444" : "#F1F2F3",
          }}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setShowCountryDropdown((s) => !s)}
            className="flex-row items-center pb-2"
          >
            <Text
              className="flex-1 text-base"
              style={{ color: country ? "#FFFFFF" : "#9CA3AF" }}
            >
              {country || "Select a country"}
            </Text>
            <Ionicons
              name={showCountryDropdown ? "chevron-up" : "chevron-down"}
              size={20}
              color="gray"
            />
          </TouchableOpacity>

          {showCountryDropdown && (
            <View className="bg-[#23262F] rounded-xl mt-2 overflow-hidden">
              {countries.map((c) => (
                <TouchableOpacity
                  key={c}
                  onPress={() => {
                    setCountry(c);
                    setShowCountryDropdown(false);
                    setTouched((t) => ({ ...t, country: true }));
                    // validate against the newly selected value to avoid stale state
                    validateField("country", c);
                  }}
                  className="px-4 py-3 border-b border-gray-700"
                >
                  <Text className="text-white">{c}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
        {touched.country && errors.country && (
          <Text className="text-red-500 text-xs mb-3">{errors.country}</Text>
        )}

        <Text style={{ color: "#777E90" }} className="text-sm mb-2">
          Street name <Text className="text-red-500">*</Text>
        </Text>
        <TextInput
          className="bg-transparent border-b text-white text-base py-2 mb-4"
          placeholder=""
          placeholderTextColor="#4B5563"
          value={streetName}
          onChangeText={(text) => {
            setStreetName(text);
            if (errors.streetName) {
              setErrors({ ...errors, streetName: "" });
            }
          }}
          onBlur={() => {
            setTouched((t) => ({ ...t, streetName: true }));
            validateField("streetName");
          }}
          style={{
            borderBottomColor:
              touched.streetName && errors.streetName ? "#EF4444" : "#F1F2F3",
            borderBottomWidth: 1,
          }}
        />
        {touched.streetName && errors.streetName && (
          <Text className="text-red-500 text-xs mb-3">{errors.streetName}</Text>
        )}

        <Text className="text-white text-sm mb-2">
          City <Text className="text-red-500">*</Text>
        </Text>
        <TextInput
          className="bg-transparent border-b text-white text-base py-2 mb-4"
          placeholder=""
          placeholderTextColor="#4B5563"
          value={city}
          onChangeText={(text) => {
            setCity(text);
            if (errors.city) {
              setErrors({ ...errors, city: "" });
            }
          }}
          onBlur={() => {
            setTouched((t) => ({ ...t, city: true }));
            validateField("city");
          }}
          style={{
            borderBottomColor:
              touched.city && errors.city ? "#EF4444" : "#F1F2F3",
            borderBottomWidth: 1,
          }}
        />
        {touched.city && errors.city && (
          <Text className="text-red-500 text-xs mb-3">{errors.city}</Text>
        )}

        <Text className="text-white text-sm mb-2">State / Province</Text>
        <TextInput
          className="bg-transparent border-b border-[#F1F2F3] text-white text-base py-2 mb-4"
          placeholder=""
          placeholderTextColor="#4B5563"
          value={stateProvince}
          onChangeText={setStateProvince}
        />

        <Text className="text-white text-sm mb-2">
          Zip-code <Text className="text-red-500">*</Text>
        </Text>
        <TextInput
          className="bg-transparent border-b text-white text-base py-2 mb-4"
          placeholder=""
          placeholderTextColor="#4B5563"
          keyboardType="numeric"
          value={zipCode}
          onChangeText={(text) => {
            setZipCode(text);
            if (errors.zipCode) {
              setErrors({ ...errors, zipCode: "" });
            }
          }}
          onBlur={() => {
            setTouched((t) => ({ ...t, zipCode: true }));
            validateField("zipCode");
          }}
          style={{
            borderBottomColor:
              touched.zipCode && errors.zipCode ? "#EF4444" : "#F1F2F3",
            borderBottomWidth: 1,
          }}
        />
        {touched.zipCode && errors.zipCode && (
          <Text className="text-red-500 text-xs mb-3">{errors.zipCode}</Text>
        )}

        <Text className="text-white text-sm mb-2">
          Phone number <Text className="text-red-500">*</Text>
        </Text>
        <TextInput
          className="bg-transparent border-b text-white text-base py-2 mb-4"
          placeholder=""
          placeholderTextColor="#4B5563"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={(text) => {
            setPhoneNumber(text);
            if (errors.phoneNumber) {
              setErrors({ ...errors, phoneNumber: "" });
            }
          }}
          onBlur={() => {
            setTouched((t) => ({ ...t, phoneNumber: true }));
            validateField("phoneNumber");
          }}
          style={{
            borderBottomColor:
              touched.phoneNumber && errors.phoneNumber ? "#EF4444" : "#F1F2F3",
            borderBottomWidth: 1,
          }}
        />
        {touched.phoneNumber && errors.phoneNumber && (
          <Text className="text-red-500 text-xs mb-3">
            {errors.phoneNumber}
          </Text>
        )}

        <Text className="text-white text-xl font-bold mb-4 mt-6">
          Shipping method
        </Text>

        {shippingOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            onPress={() => setSelectedShipping(option.id)}
            className={`flex-row items-center bg-background p-4 mb-3 ${
              selectedShipping === option.id
                ? "border-2 bg-[#23262F] border-[#508A7B]"
                : ""
            }`}
          >
            <View
              className={`w-6 h-6 rounded-full mr-5 items-center justify-center ${
                selectedShipping === option.id
                  ? "bg-[#508A7B]"
                  : "border border-[#FCFCFD]"
              }`}
            >
              {selectedShipping === option.id && (
                <View className="w-3 h-3 bg-black rounded-full" />
              )}
            </View>

            <View className="flex-1">
              <View className="flex-row items-center mb-1">
                <Text className="text-white text-base font-bold mr-2">
                  {option.price}
                </Text>
                <Text className="text-white text-sm">{option.label}</Text>
              </View>
              <Text className="text-[#FCFCFD] font-light text-xs">
                {option.subtitle}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        <Text className="text-white text-xl font-bold mb-4 mt-6">
          Coupon Code
        </Text>
        <View className="flex-row items-center bg-[#23262F] rounded-2xl px-5 py-4 mb-6">
          <TextInput
            className="flex-1 text-white text-base"
            placeholder="Have a code? type it here..."
            placeholderTextColor="#B1B5C3"
            value={couponCode}
            onChangeText={setCouponCode}
          />
          <TouchableOpacity>
            <Text className="text-[#508A7B] text-base font-semibold">
              Validate
            </Text>
          </TouchableOpacity>
        </View>

        <Text className="text-white text-xl mt-2 font-bold mb-4">
          Billing Address
        </Text>
        <TouchableOpacity
          onPress={() => setCopyBillingAddress(!copyBillingAddress)}
          className="flex-row items-center mt-1 mb-10"
        >
          <View
            className={`w-5 h-5 rounded border mr-3 items-center justify-center ${
              copyBillingAddress
                ? "bg-[#5ECE7B] border-[#5ECE7B]"
                : "border-[#FCFCFD] "
            }`}
          >
            {copyBillingAddress && (
              <Ionicons name="checkmark" size={14} color="white" />
            )}
          </View>
          <Text className="text-white text-sm">
            Copy address data from shipping
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 bg-background px-5 py-4 ">
        <TouchableOpacity
          onPress={handleContinueToPayment}
          className="bg-white rounded-full my-6 py-4"
        >
          <Text className="text-black text-center text-lg font-bold">
            Continue to payment
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CheckoutScreen;
