// src/utils/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; // Ensure port matches your backend

export const fetchContent = async () => {
  const response = await axios.get(`${API_BASE_URL}/content`);
  return response.data;
};

export const fetchMapData = async () => {
  const response = await axios.get(`${API_BASE_URL}/map`);
  return response.data;
};

export const addUserLocation = async (data) => {
  const response = await axios.post(`${API_BASE_URL}/map`, data);
  return response.data;
};

export const fetchActionHubData = async () => {
  const response = await axios.get(`${API_BASE_URL}/action-hub`);
  return response.data;
};