import apiClient from "./client";

export const getProjects = () => apiClient.get("/projetos");
export const getProject = (id) => apiClient.get(`/projetos/${id}`);
export const getProjectDetails = (id) =>
  apiClient.get(`/projetos/${id}/detalhes`);
export const createProject = (data) => apiClient.post("/projetos", data);
export const updateProject = (id, data) =>
  apiClient.put(`/projetos/${id}`, data);
export const deleteProject = (id) => apiClient.delete(`/projetos/${id}`);
