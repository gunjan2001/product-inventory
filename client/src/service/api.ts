import axios from 'axios';

// Base URL for API - adjust based on your environment
const API_BASE_URL = (import.meta).env?.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error);
      throw new Error('Network error. Please check your connection.');
    }
    
    // Re-throw the error to be handled by the calling function
    throw error;
  }
);

// Types
export interface Category {
  _id: string;
  name: string;
}

export interface Product {
  _id: string;
  name: string;
  description?: string;
  quantity: number;
  categories: Category[];
  createdAt: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  pages: number;
}

export interface CreateProductData {
  name: string;
  description?: string;
  quantity: number;
  categories?: string[];
}

/**
 * Fetch all categories
 */
export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await api.get('/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

/**
 * Fetch products with pagination, search, and filters
 */
export const fetchProducts = async (
  page: number = 1,
  search: string = '',
  categories: string[] = []
): Promise<ProductsResponse> => {
  try {
    const params: any = { page };
    
    if (search.trim() !== '') {
      params.search = search?.trim() || '';
    }
    
    if (categories.length > 0) {
      params.categories = categories.join(',');
    }

    const response = await api.get('/products', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

/**
 * Create a new product
 */
export const createProduct = async (productData: CreateProductData): Promise<Product> => {
  try {
    const response = await api.post('/products', productData);
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

/**
 * Delete a product by ID
 */
export const deleteProduct = async (productId: string): Promise<void> => {
  try {
    await api.delete(`/products/${productId}`);
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

export default api;
