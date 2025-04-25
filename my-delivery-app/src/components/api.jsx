// src/services/api.js
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_BASE_URL = 'http://localhost:9090/api'; // Ensure this is correct

const apiInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add token and log
apiInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log(`[Axios Request - ${config.method.toUpperCase()} ${config.url}] Token being sent:`, token); // Log token

      try {
        const decodedToken = jwtDecode(token);
        console.log(`[Axios Request - ${config.method.toUpperCase()} ${config.url}] Decoded Token:`, decodedToken); // Log decoded token
      } catch (error) {
        console.error(`[Axios Request - ${config.method.toUpperCase()} ${config.url}] Error decoding token:`, error);
      }
    }
    return config;
  },
  error => {
    console.error('Axios Request Error:', error);
    return Promise.reject(error);
  }
);

// Function to fetch all restaurants
export const getAllRestaurants = async () => {
  try {
    const response = await apiInstance.get('/restaurants');
    return response.data;
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    throw error;
  }
};

// Function to fetch menu items for a specific restaurant
export const getMenuItems = async (restaurantId) => {
  try {
    const response = await apiInstance.get(`/restaurants/${restaurantId}/menu`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching menu for restaurant ${restaurantId}:`, error);
    throw error;
  }
};

// Function to create a new restaurant
export const createRestaurant = async (restaurantData) => {
  try {
    const response = await apiInstance.post('/restaurants', restaurantData);
    return response.data;
  } catch (error) {
    console.error('Error creating restaurant:', error);
    throw error;
  }
};

// Function to create a new product for a restaurant
export const createProduct = async (restaurantId, productData) => {
  try {
    const response = await apiInstance.post(`/restaurants/${restaurantId}/menu`, productData);
    return response.data;
  } catch (error) {
    console.error(`Error creating product for restaurant ${restaurantId}:`, error);
    throw error;
  }
};

// Function to update a restaurant
export const updateRestaurant = async (restaurantId, restaurantData) => {
  try {
    const response = await apiInstance.put(`/restaurants/${restaurantId}`, restaurantData);
    return response.data;
  } catch (error) {
    console.error(`Error updating restaurant ${restaurantId}:`, error);
    throw error;
  }
};

// Function to update a product
export const updateProduct = async (restaurantId, productId, productData) => {
  try {
    const response = await apiInstance.put(`/restaurants/${restaurantId}/menu/${productId}`, productData);
    return response.data;
  } catch (error) {
    console.error(`Error updating product ${productId} for restaurant ${restaurantId}:`, error);
    throw error;
  }
};

// Function to delete a restaurant
export const deleteRestaurant = async (restaurantId) => {
  try {
    const response = await apiInstance.delete(`/restaurants/${restaurantId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting restaurant ${restaurantId}:`, error);
    throw error;
  }
};

// Function to delete a product
export const deleteProduct = async (productId) => {
  try {
    const response = await apiInstance.delete(`/restaurants/0/menu/${productId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting product ${productId}:`, error);
    throw error;
  }
};

export default apiInstance;