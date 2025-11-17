export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category:
    | string
    | {
        id: number;
        name: string;
        image: string;
      };
  image?: string;
  images?: string[];
  rating?: {
    rate: number;
    count: number;
  };
}

export interface CartItem extends Product {
  selectedSize?: string;
  selectedColor: string;
  quantity: number;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface ProductsState {
  items: Product[];
  filteredItems: Product[];
  categories: string[];
  selectedCategory: string | null;
  searchQuery: string;
  priceRange: [number, number];
  isLoading: boolean;
  error: string | null;
}

export interface CartState {
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
}

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Signup: undefined;
};

export type MainStackParamList = {
  Main: undefined;
  HomeTabs: undefined | { screen?: string };
  Search: {
    initialSearch?: string;
    initialCategoryId?: number;
    initialCategoryName?: string;
  };
  ProductDetails: { productId: number };
  Checkout: undefined;
  Payment: { shippingData: any };
  OrderConfirmation: { orderData: any };
  Address: undefined;
  PaymentMethod: undefined;
  Voucher: undefined;
  Wishlist: undefined;
};

export type BottomTabParamList = {
  Home: undefined;
  Discover: undefined;
  Cart: undefined;
  Profile: undefined;
};
