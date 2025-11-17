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

type SignupScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, "Signup">;
};

const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | null
  >(null);

  const { signup } = useAuth();

  const validateEmail = (value: string) => {
    const re =
      /^(([^<>()\[\]\\.,;:\s@\"]+(\.[^<>()\[\]\\.,;:\s@\"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i;
    return re.test(String(value).toLowerCase());
  };

  const handleSignup = async () => {
    setNameError(null);
    setEmailError(null);
    setPasswordError(null);
    setConfirmPasswordError(null);

    let hasError = false;

    if (!name.trim()) {
      setNameError("Name is required");
      hasError = true;
    }

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
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      hasError = true;
    }

    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password");
      hasError = true;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      hasError = true;
    }

    if (hasError) return;

    setIsLoading(true);
    const result = await signup(email, password, name);
    setIsLoading(false);

    if (!result.success) {
      const msg = result.error || "Please try again";
      if (
        msg.toLowerCase().includes("email") ||
        msg.toLowerCase().includes("already")
      ) {
        setEmailError(msg);
      } else {
        Alert.alert("Signup Failed", msg);
      }
    } else {
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      try {
        (navigation as any).reset({ index: 0, routes: [{ name: "HomeTabs" }] });
      } catch (err) {
        // @ts-ignore
        navigation.navigate("HomeTabs");
      }
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
            <View className="mb-12">
              <Text className="text-white text-2xl font-bold mb-3">Create</Text>
              <Text className="text-white text-2xl font-bold">
                your account
              </Text>
            </View>

            <View className="mb-6">
              <TextInput
                className="text-white text-sm font-light pb-3 border-b border-[#B1B5C3]"
                placeholder="Enter your name"
                placeholderTextColor="#FCFCFD"
                value={name}
                onChangeText={(t) => {
                  setName(t);
                  if (nameError) setNameError(null);
                }}
                onBlur={() => {
                  if (!name.trim()) setNameError("Name is required");
                }}
                autoCapitalize="words"
              />
              {nameError ? (
                <Text className="text-red-400 text-xs mt-2">{nameError}</Text>
              ) : null}
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

            <View className="mb-6">
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
                  else if (password.length < 6)
                    setPasswordError("Password must be at least 6 characters");
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

            <View className="mb-16">
              <TextInput
                className="text-white text-sm font-light pb-3 border-b border-[#B1B5C3]"
                placeholder="Confirm password"
                placeholderTextColor="#FCFCFD"
                value={confirmPassword}
                onChangeText={(t) => {
                  setConfirmPassword(t);
                  if (confirmPasswordError) setConfirmPasswordError(null);
                }}
                onBlur={() => {
                  if (!confirmPassword)
                    setConfirmPasswordError("Please confirm your password");
                  else if (password !== confirmPassword)
                    setConfirmPasswordError("Passwords do not match");
                }}
                secureTextEntry
                autoCapitalize="none"
              />
              {confirmPasswordError ? (
                <Text className="text-red-400 text-xs mt-2">
                  {confirmPasswordError}
                </Text>
              ) : null}
            </View>

            <View className="items-center">
              <TouchableOpacity
                className="bg-[#FCFCFD] w-40 rounded-full py-4 items-center mb-32"
                onPress={handleSignup}
                disabled={isLoading}
                activeOpacity={0.9}
              >
                {isLoading ? (
                  <ActivityIndicator color="black" />
                ) : (
                  <Text className="text-background text-base font-bold">
                    SIGN UP
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            <View className="flex-row mt-[40%] justify-center items-center">
              <Text className="text-white text-base">
                Already have account?{" "}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text className="text-white text-base underline">Log In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SignupScreen;
