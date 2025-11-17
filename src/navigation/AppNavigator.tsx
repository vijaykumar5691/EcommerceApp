import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { fetchProducts, fetchCategories } from "../redux/slices/productsSlice";
import { useAuth } from "../hooks/useAuth";
import MainNavigator from "./MainNavigator";
import AuthNavigator from "./AuthNavigator";

const AppNavigator = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  useAuth();

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <>
      <StatusBar style="dark" />
      <NavigationContainer>
        {user ? <MainNavigator /> : <AuthNavigator />}
      </NavigationContainer>
    </>
  );
};

export default AppNavigator;
