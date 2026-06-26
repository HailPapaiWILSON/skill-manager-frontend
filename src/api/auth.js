import apiClient from "./client";

export const register = (data) => apiClient.post("/auth/cadastrar", data);

export const login = (data) => apiClient.post("/auth/login", data);
