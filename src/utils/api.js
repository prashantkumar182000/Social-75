// src/utils/api.js
import axios from 'axios';

const API_BASE_URL = "https://social-75-39je.onrender.com/api";

// Configure axios instance with default settings
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Response interceptor to handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    }
    return Promise.reject(response);
  },
  (error) => {
    if (error.response) {
      // Server responded with a status other than 2xx
      console.error('API Error:', error.response.status, error.response.data);
      return Promise.reject({
        status: error.response.status,
        data: error.response.data,
        message: error.response.data?.message || 'An error occurred'
      });
    } else if (error.request) {
      // Request was made but no response received
      console.error('API Error: No response received', error.request);
      return Promise.reject({
        message: 'No response from server. Please check your connection.'
      });
    } else {
      // Something happened in setting up the request
      console.error('API Error:', error.message);
      return Promise.reject({
        message: error.message || 'Request setup failed'
      });
    }
  }
);

export const fetchContent = async () => {
  try {
    return await apiClient.get('/content');
  } catch (error) {
    console.error('Failed to fetch content:', error);
    throw error;
  }
};

export const fetchMapData = async () => {
  try {
    return await apiClient.get('/map');
  } catch (error) {
    console.error('Failed to fetch map data:', error);
    throw error;
  }
};

export const addUserLocation = async (data) => {
  try {
    return await apiClient.post('/map', data);
  } catch (error) {
    console.error('Failed to add location:', error);
    throw error;
  }
};

export const fetchActionHubData = async () => {
  try {
    return await apiClient.get('/action-hub');
  } catch (error) {
    console.error('Failed to fetch action hub data:', error);
    throw error;
  }
};

// Add other API calls as needed