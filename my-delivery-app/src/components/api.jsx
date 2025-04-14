// src/services/api.js
import axios from 'axios';

const API_BASE_URL = '/http://localhost:9090/api'; // Adjust if your backend base URL is different

// Function to fetch all restaurants
export const getAllRestaurants = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/restaurants`);
    return response.data;
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    throw error; // Re-throw the error for component handling
  }
};

// Function to fetch menu items for a specific restaurant
export const getMenuItems = async (restaurantId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/restaurants/${restaurantId}/menu`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching menu for restaurant ${restaurantId}:`, error);
    throw error;
  }
};

// Function to create a new restaurant
export const createRestaurant = async (restaurantData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/restaurants`, restaurantData);
    return response.data;
  } catch (error) {
    console.error('Error creating restaurant:', error);
    throw error;
  }
};

// Function to create a new product for a restaurant
export const createProduct = async (restaurantId, productData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/restaurants/${restaurantId}/menu`, productData);
    return response.data;
  } catch (error) {
    console.error(`Error creating product for restaurant ${restaurantId}:`, error);
    throw error;
  }
};

// Function to update a restaurant
export const updateRestaurant = async (restaurantId, restaurantData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/restaurants/${restaurantId}`, restaurantData);
    return response.data;
  } catch (error) {
    console.error(`Error updating restaurant ${restaurantId}:`, error);
    throw error;
  }
};

// Function to update a product
export const updateProduct = async (restaurantId, productId, productData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/restaurants/${restaurantId}/menu/${productId}`, productData);
    return response.data;
  } catch (error) {
    console.error(`Error updating product ${productId} for restaurant ${restaurantId}:`, error);
    throw error;
  }
};

// Function to delete a restaurant
export const deleteRestaurant = async (restaurantId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/restaurants/${restaurantId}`);
    return response.data; // Or handle success message as needed
  } catch (error) {
    console.error(`Error deleting restaurant ${restaurantId}:`, error);
    throw error;
  }
};

// Function to delete a product
export const deleteProduct = async (productId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/restaurants/0/menu/${productId}`); // Note: The restaurantId in the path doesn't seem to be used by your backend for deletion
    return response.data; // Or handle success message as needed
  } catch (error) {
    console.error(`Error deleting product ${productId}:`, error);
    throw error;
  }
};