import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ProductsState, Product } from "../../types";
import { productService } from "../../services/api";

const initialState: ProductsState = {
  items: [],
  filteredItems: [],
  categories: [],
  selectedCategory: null,
  searchQuery: "",
  priceRange: [0, 1000],
  isLoading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    const products = await productService.getAllProducts();
    return products;
  }
);

export const fetchCategories = createAsyncThunk(
  "products/fetchCategories",
  async () => {
    const categories = await productService.getCategories();
    return categories;
  }
);

export const searchProducts = createAsyncThunk(
  "products/searchProducts",
  async (title: string) => {
    const products = await productService.searchByTitle(title);
    return products;
  }
);

export const filterByPriceRange = createAsyncThunk(
  "products/filterByPriceRange",
  async ({ min, max }: { min: number; max: number }) => {
    const products = await productService.filterByPriceRange(min, max);
    return products;
  }
);

export const filterByCategory = createAsyncThunk(
  "products/filterByCategory",
  async (categoryId: number) => {
    const products = await productService.filterByCategory(categoryId);
    return products;
  }
);

export const applyFilters = createAsyncThunk(
  "products/applyFilters",
  async (params: {
    title?: string;
    price_min?: number;
    price_max?: number;
    categoryId?: number;
  }) => {
    const products = await productService.filterCombined(params);
    return products;
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload;
    },
    setPriceRange: (state, action: PayloadAction<[number, number]>) => {
      state.priceRange = action.payload;
    },
    clearFilters: (state) => {
      state.searchQuery = "";
      state.selectedCategory = null;
      state.priceRange = [0, 1000];
      state.filteredItems = state.items;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
        state.filteredItems = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch products";
      })

      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })

      .addCase(searchProducts.fulfilled, (state, action) => {
        state.filteredItems = action.payload;
      })

      .addCase(filterByPriceRange.fulfilled, (state, action) => {
        state.filteredItems = action.payload;
      })

      .addCase(filterByCategory.fulfilled, (state, action) => {
        state.filteredItems = action.payload;
      })

      .addCase(applyFilters.fulfilled, (state, action) => {
        state.filteredItems = action.payload;
      });
  },
});

export const {
  setSearchQuery,
  setSelectedCategory,
  setPriceRange,
  clearFilters,
} = productsSlice.actions;

export default productsSlice.reducer;
