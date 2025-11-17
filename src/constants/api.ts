export const API_BASE_URL = "https://api.escuelajs.co/api/v1";

export const API_ENDPOINTS = {
  PRODUCTS: "/products",
  PRODUCT_BY_ID: (id: number) => `/products/${id}`,

  CATEGORIES: "/categories",
  CATEGORY_BY_ID: (id: number) => `/categories/${id}`,

  SEARCH_BY_TITLE: (title: string) => `/products?title=${title}`,
  FILTER_BY_PRICE: (price: number) => `/products?price=${price}`,
  FILTER_BY_PRICE_RANGE: (min: number, max: number) =>
    `/products?price_min=${min}&price_max=${max}`,
  FILTER_BY_CATEGORY: (categoryId: number) =>
    `/products?categoryId=${categoryId}`,

  FILTER_COMBINED: (params: {
    title?: string;
    price_min?: number;
    price_max?: number;
    categoryId?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params.title) queryParams.append("title", params.title);
    if (params.price_min)
      queryParams.append("price_min", params.price_min.toString());
    if (params.price_max)
      queryParams.append("price_max", params.price_max.toString());
    if (params.categoryId)
      queryParams.append("categoryId", params.categoryId.toString());
    return `/products?${queryParams.toString()}`;
  },
};
