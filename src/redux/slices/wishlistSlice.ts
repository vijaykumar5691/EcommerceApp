import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../../types";

type WishlistState = {
  items: number[];
};

const initialState: WishlistState = {
  items: [],
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlist: (state, action: PayloadAction<Product>) => {
      if (!state.items.includes(action.payload.id)) {
        state.items.push(action.payload.id);
      }
    },
    removeFromWishlist: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((id) => id !== action.payload);
    },
    toggleWishlist: (state, action: PayloadAction<Product>) => {
      const id = action.payload.id;
      if (state.items.includes(id)) {
        state.items = state.items.filter((i) => i !== id);
      } else {
        state.items.push(id);
      }
    },
    clearWishlist: (state) => {
      state.items = [];
    },
  },
});

export const {
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
  clearWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
