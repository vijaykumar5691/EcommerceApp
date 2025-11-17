import { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser,
} from "firebase/auth";
import { auth } from "../config/firebase";
import { useAppDispatch } from "../redux/hooks";
import { setUser, setLoading, setError } from "../redux/slices/authSlice";
import { User } from "../types";

export const useAuth = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user: FirebaseUser | null) => {
        if (user) {
          dispatch(
            setUser({
              id: user.uid,
              email: user.email || "",
              displayName: user.displayName || undefined,
            })
          );
        } else {
          dispatch(setUser(null));
        }
        dispatch(setLoading(false));
      }
    );

    return unsubscribe;
  }, [dispatch]);

  const signup = async (
    email: string,
    password: string,
    displayName?: string
  ) => {
    try {
      dispatch(setLoading(true));
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (displayName) {
        try {
          await updateProfile(userCredential.user, { displayName });
        } catch (err) {
          console.warn("Failed to set displayName on signup", err);
        }
      }
      dispatch(
        setUser({
          id: userCredential.user.uid,
          email: userCredential.user.email || "",
          displayName: userCredential.user.displayName || undefined,
        })
      );
      return { success: true };
    } catch (error: any) {
      dispatch(setError(error.message));
      return { success: false, error: error.message };
    } finally {
      dispatch(setLoading(false));
    }
  };

  const login = async (email: string, password: string) => {
    try {
      dispatch(setLoading(true));
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      dispatch(
        setUser({
          id: userCredential.user.uid,
          email: userCredential.user.email || "",
        })
      );
      return { success: true };
    } catch (error: any) {
      dispatch(setError(error.message));
      return { success: false, error: error.message };
    } finally {
      dispatch(setLoading(false));
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      dispatch(setUser(null));
    } catch (error: any) {
      dispatch(setError(error.message));
    }
  };

  return { signup, login, logout };
};
