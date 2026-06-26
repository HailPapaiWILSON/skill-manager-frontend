import apiClient from "./client";

export const getProjectSkills = () => apiClient.get("/skills-projetos");
export const createProjectSkill = (data) =>
  apiClient.post("/skills-projetos", data);
export const deleteProjectSkill = (projetoId, skillId) =>
  apiClient.delete(`/skills-projetos/${projetoId}/${skillId}`);
