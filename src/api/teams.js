import apiClient from "./client";

export const getTeams = () => apiClient.get("/equipes");
export const getTeam = (id) => apiClient.get(`/equipes/${id}`);
export const getTeamDetails = (id) => apiClient.get(`/equipes/${id}/detalhes`);
export const createTeam = (data) => apiClient.post("/equipes", data);
export const updateTeam = (id, data) => apiClient.put(`/equipes/${id}`, data);
export const deleteTeam = (id) => apiClient.delete(`/equipes/${id}`);
