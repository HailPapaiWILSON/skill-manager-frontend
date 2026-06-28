import apiClient from "./client";

export const cadastrar = (data) =>
  apiClient.post("/autenticacao/cadastrar", data);

export const login = (data) => apiClient.post("/autenticacao/login", data);
