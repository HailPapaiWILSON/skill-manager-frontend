import apiClient from "./client";

export const getCategories = () => apiClient.get("/categorias");
export const getCategory = (id) => apiClient.get(`/categorias/${id}`);
export const createCategory = (data) => apiClient.post("/categorias", data);
export const updateCategory = (id, data) =>
  apiClient.put(`/categorias/${id}`, data);
export const deleteCategory = (id) => apiClient.delete(`/categorias/${id}`);
