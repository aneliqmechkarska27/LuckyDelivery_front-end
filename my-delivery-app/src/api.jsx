// src/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:9090/api/admin';

export const fetchRestaurants = () => axios.get(`${API_BASE_URL}/restaurants`);

export const addRestaurant = (restaurant) => axios.post(`${API_BASE_URL}/restaurants`, restaurant);

export const updateRestaurant = (id, restaurant) => axios.put(`${API_BASE_URL}/restaurants/${id}`, restaurant);

export const deleteRestaurant = (id) => axios.delete(`${API_BASE_URL}/restaurants/${id}`);

export const fetchProducts = (restaurantId) => axios.get(`${API_BASE_URL}/restaurants/${restaurantId}/menu`);

export const addProduct = (restaurantId, product) => axios.post(`${API_BASE_URL}/restaurants/${restaurantId}/menu`, product);

export const updateProduct = (restaurantId, productId, product) => axios.put(`${API_BASE_URL}/restaurants/${restaurantId}/menu/${productId}`, product);

export const deleteProduct = (restaurantId, productId) => axios.delete(`${API_BASE_URL}/restaurants/${restaurantId}/menu/${productId}`);
