// src/services/api.js
import axios from "axios";

const API_BASE_URL = "http://localhost:4000/api";

export const getArticles = async () => {
  const response = await axios.get(`${API_BASE_URL}/articles`);
  return response.data;
};

export const getArticleById = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/articles/${id}`);
  return response.data;
};

export const createArticle = async (article) => {
  const response = await axios.post(`${API_BASE_URL}/articles`, article);
  return response.data;
};

export const updateArticle = async (id, updatedData) => {
  const response = await axios.put(`${API_BASE_URL}/articles/${id}`, updatedData);
  return response.data;
};

export const removeArticle = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/articles/${id}`);
  return response.data;
};

export const getArticlesByJournalist = async (journalistId) => {
  const response = await axios.get(`${API_BASE_URL}/articles/journalists/${journalistId}/articles`);
  return response.data;
};

export const getJournalistById = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/journalists/${id}`);
  return response.data;
};
