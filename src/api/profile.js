import apiClient from "./client";

// Users
export const getUsers = () => apiClient.get("/usuarios");
export const getUser = (id) => apiClient.get(`/usuarios/${id}`);
export const updateUserProfile = (id, data) =>
  apiClient.put(`/usuarios/${id}`, data);

// User Skills (skills-usuarios)
export const getUserSkills = () => apiClient.get("/skills-usuarios");
export const createUserSkill = (data) =>
  apiClient.post("/skills-usuarios", data);
export const updateUserSkill = (usuarioId, skillId, data) =>
  apiClient.put(`/skills-usuarios/${usuarioId}/${skillId}`, data);
export const deleteUserSkill = (usuarioId, skillId) =>
  apiClient.delete(`/skills-usuarios/${usuarioId}/${skillId}`);
