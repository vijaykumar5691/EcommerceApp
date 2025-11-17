import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "../constants/api";
import { Product } from "../types";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const productService = {
  getAllProducts: async (): Promise<Product[]> => {
    const response = await apiClient.get<Product[]>(API_ENDPOINTS.PRODUCTS);
    return response.data;
  },

  getProductById: async (id: number): Promise<Product> => {
    const response = await apiClient.get<Product>(
      API_ENDPOINTS.PRODUCT_BY_ID(id)
    );
    return response.data;
  },

  getCategories: async (): Promise<any[]> => {
    const response = await apiClient.get<any[]>(API_ENDPOINTS.CATEGORIES);
    return response.data;
  },

  getCategoryById: async (id: number): Promise<any> => {
    const response = await apiClient.get(API_ENDPOINTS.CATEGORY_BY_ID(id));
    return response.data;
  },

  searchByTitle: async (title: string): Promise<Product[]> => {
    const response = await apiClient.get<Product[]>(
      API_ENDPOINTS.SEARCH_BY_TITLE(title)
    );
    return response.data;
  },

  filterByPrice: async (price: number): Promise<Product[]> => {
    const response = await apiClient.get<Product[]>(
      API_ENDPOINTS.FILTER_BY_PRICE(price)
    );
    return response.data;
  },

  filterByPriceRange: async (min: number, max: number): Promise<Product[]> => {
    const response = await apiClient.get<Product[]>(
      API_ENDPOINTS.FILTER_BY_PRICE_RANGE(min, max)
    );
    return response.data;
  },

  filterByCategory: async (categoryId: number): Promise<Product[]> => {
    const response = await apiClient.get<Product[]>(
      API_ENDPOINTS.FILTER_BY_CATEGORY(categoryId)
    );
    return response.data;
  },

  filterCombined: async (params: {
    title?: string;
    price_min?: number;
    price_max?: number;
    categoryId?: number;
  }): Promise<Product[]> => {
    const endpoint = API_ENDPOINTS.FILTER_COMBINED(params);
    console.log(
      `[productService] filterCombined -> GET ${API_BASE_URL}${endpoint}`
    );
    const response = await apiClient.get<Product[]>(endpoint);
    return response.data;
  },
};

export default apiClient;
