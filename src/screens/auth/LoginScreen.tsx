import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
  StatusBar,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../types";
import { useAuth } from "../../hooks/useAuth";

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, "Login">;
};

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const { login } = useAuth();

  const validateEmail = (value: string) => {
    const re =
      /^(([^<>()\[\]\\.,;:\s@\"]+(\.[^<>()\[\]\\.,;:\s@\"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i;
    return re.test(String(value).toLowerCase());
  };

  const handleLogin = async () => {
    setEmailError(null);
    setPasswordError(null);

    let hasError = false;
    if (!email.trim()) {
      setEmailError("Email is required");
      hasError = true;
    } else if (!validateEmail(email)) {
      setEmailError("Please enter a valid email");
      hasError = true;
    }

    if (!password) {
      setPasswordError("Password is required");
      hasError = true;
    }

    if (hasError) return;

    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);

    if (!result.success) {
      const msg = result.error || "Please try again";
      // show credential errors under password field by default
      setPasswordError(msg);
    } else {
      (navigation as any).reset({ index: 0, routes: [{ name: "HomeTabs" }] });
    }
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 px-8 pt-24">
            <View className="mb-16">
              <Text className="text-[#FCFCFD] text-2xl font-bold mb-2">
                Log into
              </Text>
              <Text className="text-[#FCFCFD] text-2xl font-bold">
                your account
              </Text>
            </View>

            <View className="mb-6">
              <TextInput
                className="text-white text-sm font-light pb-3 border-b border-[#B1B5C3]"
                placeholder="Email address"
                placeholderTextColor="#FCFCFD"
                value={email}
                onChangeText={(t) => {
                  setEmail(t);
                  if (emailError) setEmailError(null);
                }}
                onBlur={() => {
                  if (!email.trim()) setEmailError("Email is required");
                  else if (!validateEmail(email))
                    setEmailError("Please enter a valid email");
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              {emailError ? (
                <Text className="text-red-400 text-xs mt-2">{emailError}</Text>
              ) : null}
            </View>

            <View className="mb-28">
              <TextInput
                className="text-white text-sm font-light pb-3 border-b border-[#B1B5C3]"
                placeholder="Password"
                placeholderTextColor="#FCFCFD"
                value={password}
                onChangeText={(t) => {
                  setPassword(t);
                  if (passwordError) setPasswordError(null);
                }}
                onBlur={() => {
                  if (!password) setPasswordError("Password is required");
                }}
                secureTextEntry
                autoCapitalize="none"
              />
              {passwordError ? (
                <Text className="text-red-400 text-xs mt-2">
                  {passwordError}
                </Text>
              ) : null}
            </View>

            <View className="items-center">
              <TouchableOpacity
                className="bg-[#FCFCFD] w-40 rounded-full py-4 items-center mb-32"
                onPress={handleLogin}
                disabled={isLoading}
                activeOpacity={0.9}
              >
                {isLoading ? (
                  <ActivityIndicator color="black" />
                ) : (
                  <Text className="text-background text-base font-bold">
                    LOG IN
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            <View className="flex-row mt-[70%] justify-center items-end">
              <Text className="text-[#FCFCFD] text-sm font-medium">
                Don't have an account?{" "}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                <Text className="text-[#FCFCFD] text-sm font-medium underline">
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginScreen;
