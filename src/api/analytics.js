import apiClient from "./client";

/**
 * Termômetro do time - mostra % de cobertura de skills necessárias
 * @param {number} equipeId - ID da equipe
 * @returns {Promise} Cobertura, status, total de skills
 */
export const getThermometer = (equipeId) =>
  apiClient.get(`/analytics/thermometer/${equipeId}`);

/**
 * Lista do que falta - skills necessárias não cobertas pela equipe
 * @param {number} equipeId - ID da equipe
 * @returns {Promise} Total e lista de skills faltantes
 */
export const getMissingSkills = (equipeId) =>
  apiClient.get(`/analytics/missing-skills/${equipeId}`);

/**
 * Quem sabe o quê - busca especialistas por skill
 * @param {number} equipeId - ID da equipe
 * @param {number} [skillId] - ID da skill (opcional)
 * @param {string} [skillName] - Nome da skill (opcional)
 * @returns {Promise} Especialistas com a skill
 */
export const getSkillExperts = (equipeId, skillId, skillName) =>
  apiClient.get(`/analytics/skill-experts/${equipeId}`, {
    params: { skillId, skillName },
  });

/**
 * Projetos em risco - projetos ativos com skills faltando
 * @param {number} equipeId - ID da equipe
 * @returns {Promise} Projetos em risco e suas skills críticas
 */
export const getAtRiskProjects = (equipeId) =>
  apiClient.get(`/analytics/at-risk-projects/${equipeId}`);

/**
 * O que o time mais faz - top 5 skills mais usadas
 * @param {number} equipeId - ID da equipe
 * @returns {Promise} Top 5 skills com contagem e percentual
 */
export const getTopSkills = (equipeId) =>
  apiClient.get(`/analytics/top-skills/${equipeId}`);

/**
 * Ranking de polivalência - membros com mais skills
 * @param {number} equipeId - ID da equipe
 * @returns {Promise} Ranking de membros por total de skills
 */
export const getVersatilityRanking = (equipeId) =>
  apiClient.get(`/analytics/versatility-ranking/${equipeId}`);
