import apiClient from "./client";

export const getExperts = (skillId, nivel) =>
  apiClient.get("/analytics/experts", { params: { skillId, nivel } });

export const getHeatmap = () => apiClient.get("/analytics/heatmap");

export const getTechRisk = (threshold) =>
  apiClient.get("/analytics/tech-risk", { params: { threshold } });

export const getGaps = (equipeId) =>
  apiClient.get("/analytics/gaps", { params: { equipeId } });
