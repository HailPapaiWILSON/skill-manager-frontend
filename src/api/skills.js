import apiClient from "./client";

export const getSkills = () => apiClient.get("/skills");
export const getSkill = (id) => apiClient.get(`/skills/${id}`);
export const createSkill = (data) => apiClient.post("/skills", data);
export const updateSkill = (id, data) => apiClient.put(`/skills/${id}`, data);
export const deleteSkill = (id) => apiClient.delete(`/skills/${id}`);
