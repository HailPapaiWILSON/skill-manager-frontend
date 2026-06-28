import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getThermometer,
  getMissingSkills,
  getSkillExperts,
  getAtRiskProjects,
  getTopSkills,
  getVersatilityRanking,
} from "../../../api/analytics";
import { getSkills } from "../../../api/skills";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Table } from "../../../components/ui/Table";
import styles from "./Analytics.module.css";

const Analytics = ({ teamId }) => {
  const [searchSkill, setSearchSkill] = useState("");
  const [searchSkillId, setSearchSkillId] = useState("");

  // Buscar todas as skills para o dropdown
  const skillsQuery = useQuery({
    queryKey: ["skills"],
    queryFn: getSkills,
  });

  // Termômetro
  const thermometerQuery = useQuery({
    queryKey: ["analytics", "thermometer", teamId],
    queryFn: () => getThermometer(teamId),
    enabled: !!teamId,
  });

  // Skills faltantes
  const missingSkillsQuery = useQuery({
    queryKey: ["analytics", "missingSkills", teamId],
    queryFn: () => getMissingSkills(teamId),
    enabled: !!teamId,
  });

  // Projetos em risco
  const atRiskProjectsQuery = useQuery({
    queryKey: ["analytics", "atRiskProjects", teamId],
    queryFn: () => getAtRiskProjects(teamId),
    enabled: !!teamId,
  });

  // Top skills
  const topSkillsQuery = useQuery({
    queryKey: ["analytics", "topSkills", teamId],
    queryFn: () => getTopSkills(teamId),
    enabled: !!teamId,
  });

  // Ranking de polivalência
  const versatilityRankingQuery = useQuery({
    queryKey: ["analytics", "versatilityRanking", teamId],
    queryFn: () => getVersatilityRanking(teamId),
    enabled: !!teamId,
  });

  // Buscar especialistas por skill
  const [expertsQuery, setExpertsQuery] = useState(null);
  const [expertsLoading, setExpertsLoading] = useState(false);
  const [expertsResult, setExpertsResult] = useState(null);
  const [expertsError, setExpertsError] = useState(null);

  const handleSearchExperts = async () => {
    if (!searchSkillId && !searchSkill) {
      return;
    }

    setExpertsLoading(true);
    setExpertsError(null);
    setExpertsResult(null);

    try {
      const response = await getSkillExperts(
        teamId,
        searchSkillId ? Number(searchSkillId) : undefined,
        searchSkill || undefined,
      );
      setExpertsResult(response.data);
    } catch (error) {
      setExpertsError(
        error.response?.data?.erro || "Erro ao buscar especialistas",
      );
    } finally {
      setExpertsLoading(false);
    }
  };

  const isLoading =
    thermometerQuery.isLoading ||
    missingSkillsQuery.isLoading ||
    atRiskProjectsQuery.isLoading ||
    topSkillsQuery.isLoading ||
    versatilityRankingQuery.isLoading ||
    skillsQuery.isLoading;

  const error =
    thermometerQuery.error ||
    missingSkillsQuery.error ||
    atRiskProjectsQuery.error ||
    topSkillsQuery.error ||
    versatilityRankingQuery.error ||
    skillsQuery.error;

  if (isLoading) return <div>Carregando análises...</div>;
  if (error) return <div>Erro ao carregar análises</div>;

  const thermometerData = thermometerQuery.data?.data || {};
  const missingSkillsData = missingSkillsQuery.data?.data || {};
  const atRiskProjectsData = atRiskProjectsQuery.data?.data || {};
  const topSkillsData = topSkillsQuery.data?.data || {};
  const versatilityRankingData = versatilityRankingQuery.data?.data || {};
  const allSkills = skillsQuery.data?.data || [];

  // Helper para status do termômetro
  const getStatusColor = (status) => {
    switch (status) {
      case "verde":
        return styles.statusGreen;
      case "amarelo":
        return styles.statusYellow;
      case "vermelho":
        return styles.statusRed;
      default:
        return "";
    }
  };

  const getStatusEmoji = (status) => {
    switch (status) {
      case "verde":
        return "🟢";
      case "amarelo":
        return "🟡";
      case "vermelho":
        return "🔴";
      default:
        return "";
    }
  };

  // Reset experts search
  const resetExpertsSearch = () => {
    setSearchSkill("");
    setSearchSkillId("");
    setExpertsResult(null);
    setExpertsError(null);
  };

  return (
    <div className={styles.container}>
      {/* ======================================== */}
      {/* 1. TERMÔMETRO DO TIME */}
      {/* ======================================== */}
      <Card className={styles.section}>
        <h3>📊 Termômetro do Time</h3>
        {thermometerData.cobertura === null ? (
          <p className={styles.noData}>
            {thermometerData.mensagem || "Equipe não possui projetos ativos"}
          </p>
        ) : (
          <div className={styles.thermometer}>
            <div className={styles.thermometerStats}>
              <div className={styles.thermometerMain}>
                <span
                  className={`${styles.thermometerValue} ${getStatusColor(thermometerData.status)}`}
                >
                  {thermometerData.cobertura}%
                </span>
                <span className={styles.thermometerStatus}>
                  {getStatusEmoji(thermometerData.status)}{" "}
                  {thermometerData.status === "verde" && "Cobertura boa"}
                  {thermometerData.status === "amarelo" && "Cobertura média"}
                  {thermometerData.status === "vermelho" && "Cobertura crítica"}
                </span>
              </div>
              <div className={styles.thermometerDetails}>
                <span>
                  Skills necessárias:{" "}
                  <strong>{thermometerData.totalSkillsNecessarias}</strong>
                </span>
                <span>
                  Skills cobertas:{" "}
                  <strong>{thermometerData.totalSkillsCobertas}</strong>
                </span>
                <span>
                  Projetos ativos:{" "}
                  <strong>{thermometerData.projetosAtivos}</strong>
                </span>
              </div>
            </div>
            {/* Barra de progresso */}
            <div className={styles.progressBarWrapper}>
              <div
                className={`${styles.progressBar} ${getStatusColor(thermometerData.status)}`}
                style={{
                  width: `${Math.min(thermometerData.cobertura, 100)}%`,
                }}
              />
            </div>
          </div>
        )}
      </Card>

      {/* ======================================== */}
      {/* 2. LISTA DO QUE FALTA */}
      {/* ======================================== */}
      <Card className={styles.section}>
        <h3>📋 Lista do que Falta</h3>
        {missingSkillsData.mensagem ? (
          <p className={styles.noData}>{missingSkillsData.mensagem}</p>
        ) : missingSkillsData.total === 0 ? (
          <p className={styles.successMessage}>
            ✅ Todas as skills necessárias estão cobertas!
          </p>
        ) : (
          <>
            <p className={styles.missingCount}>
              Total de skills faltando:{" "}
              <strong>{missingSkillsData.total}</strong>
            </p>
            <div className={styles.missingSkillsGrid}>
              {missingSkillsData.skills?.map((skill) => (
                <div key={skill.id} className={styles.missingSkillCard}>
                  <h4>{skill.nome}</h4>
                  <span className={styles.missingCategory}>
                    {skill.categoria}
                  </span>
                  {skill.projetos?.length > 0 && (
                    <div className={styles.missingProjects}>
                      <small>Necessário em:</small>
                      <ul>
                        {skill.projetos.slice(0, 3).map((proj, idx) => (
                          <li key={idx}>{proj}</li>
                        ))}
                        {skill.projetos.length > 3 && (
                          <li>+{skill.projetos.length - 3} mais</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </Card>

      {/* ======================================== */}
      {/* 3. QUEM SABE O QUÊ */}
      {/* ======================================== */}
      <Card className={styles.section}>
        <h3>🔍 Quem Sabe o Quê</h3>
        <div className={styles.searchContainer}>
          <div className={styles.searchRow}>
            <div className={styles.searchGroup}>
              <label>Selecionar Skill</label>
              <select
                value={searchSkillId}
                onChange={(e) => {
                  setSearchSkillId(e.target.value);
                  setSearchSkill("");
                }}
              >
                <option value="">Selecione uma skill...</option>
                {allSkills.map((skill) => (
                  <option key={skill.id} value={skill.id}>
                    {skill.nome}{" "}
                    {skill.categoria?.nome && `(${skill.categoria.nome})`}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.searchGroup}>
              <label>Ou buscar por nome</label>
              <Input
                type="text"
                placeholder="Ex: React, Python..."
                value={searchSkill}
                onChange={(e) => {
                  setSearchSkill(e.target.value);
                  setSearchSkillId("");
                }}
              />
            </div>
          </div>
          <div className={styles.searchActions}>
            <Button
              onClick={handleSearchExperts}
              disabled={!searchSkillId && !searchSkill}
            >
              Buscar Especialistas
            </Button>
            <Button variant="secondary" onClick={resetExpertsSearch}>
              Limpar
            </Button>
          </div>
        </div>

        {expertsLoading && <p>Buscando especialistas...</p>}

        {expertsError && <p className={styles.errorMessage}>{expertsError}</p>}

        {expertsResult && (
          <div className={styles.expertsResult}>
            <div className={styles.expertsHeader}>
              <h4>Skill: {expertsResult.skill?.nome}</h4>
              <span>Total: {expertsResult.total} especialista(s)</span>
            </div>
            {expertsResult.total === 0 ? (
              <p className={styles.noData}>
                Nenhum especialista encontrado nesta equipe
              </p>
            ) : (
              <Table
                columns={["Nome", "E-mail", "Nível", "Anos de Experiência"]}
                data={expertsResult.especialistas || []}
                renderRow={(expert) => (
                  <tr key={expert.id}>
                    <td>{expert.nome}</td>
                    <td>{expert.email}</td>
                    <td>
                      <span
                        className={`${styles.levelBadge} ${styles[`level${expert.nivel}`]}`}
                      >
                        {expert.nivel}
                      </span>
                    </td>
                    <td>{expert.anosExperiencia} anos</td>
                  </tr>
                )}
              />
            )}
          </div>
        )}
      </Card>

      {/* ======================================== */}
      {/* 4. PROJETOS EM RISCO */}
      {/* ======================================== */}
      <Card className={styles.section}>
        <h3>⚠️ Projetos em Risco</h3>
        {atRiskProjectsData.mensagem ? (
          <p className={styles.noData}>{atRiskProjectsData.mensagem}</p>
        ) : atRiskProjectsData.total === 0 ? (
          <p className={styles.successMessage}>✅ Nenhum projeto em risco!</p>
        ) : (
          <>
            <p className={styles.riskCount}>
              Total de projetos em risco:{" "}
              <strong>{atRiskProjectsData.total}</strong>
            </p>
            <div className={styles.riskProjectsGrid}>
              {atRiskProjectsData.projetos?.map((projeto) => (
                <div key={projeto.id} className={styles.riskCard}>
                  <h4>{projeto.nome}</h4>
                  <div className={styles.riskBadge}>
                    {projeto.skillsFaltando} skill(s) faltando
                  </div>
                  {projeto.skillsCriticas?.length > 0 && (
                    <div className={styles.riskSkills}>
                      <strong>Skills críticas:</strong>
                      <ul>
                        {projeto.skillsCriticas.map((skill, idx) => (
                          <li key={idx}>{skill}</li>
                        ))}
                      </ul>
                      {projeto.skillsFaltandoTotal > 3 && (
                        <small>
                          +{projeto.skillsFaltandoTotal - 3} outras skills
                        </small>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </Card>

      {/* ======================================== */}
      {/* 5. O QUE O TIME MAIS FAZ */}
      {/* ======================================== */}
      <Card className={styles.section}>
        <h3>🏆 O que o Time Mais Faz</h3>
        {topSkillsData.mensagem ? (
          <p className={styles.noData}>{topSkillsData.mensagem}</p>
        ) : topSkillsData.topSkills?.length === 0 ? (
          <p className={styles.noData}>Nenhuma skill encontrada</p>
        ) : (
          <>
            <p className={styles.topSkillsCount}>
              Total de skills únicas:{" "}
              <strong>{topSkillsData.totalSkills}</strong>
            </p>
            <div className={styles.topSkillsList}>
              {topSkillsData.topSkills?.map((skill, index) => (
                <div key={index} className={styles.topSkillItem}>
                  <div className={styles.topSkillRank}>
                    <span className={styles.rankNumber}>#{index + 1}</span>
                    <div>
                      <strong>{skill.skill}</strong>
                      <span className={styles.skillCategory}>
                        {skill.categoria}
                      </span>
                    </div>
                  </div>
                  <div className={styles.topSkillStats}>
                    <span>{skill.totalProjetos} projeto(s)</span>
                    <span className={styles.percentBadge}>
                      {skill.percentual}%
                    </span>
                  </div>
                  <div className={styles.topSkillBar}>
                    <div
                      className={styles.topSkillProgress}
                      style={{ width: `${Math.min(skill.percentual, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </Card>

      {/* ======================================== */}
      {/* 6. RANKING DE POLIVALÊNCIA */}
      {/* ======================================== */}
      <Card className={styles.section}>
        <h3>🌟 Ranking de Polivalência</h3>
        {versatilityRankingData.mensagem ? (
          <p className={styles.noData}>{versatilityRankingData.mensagem}</p>
        ) : versatilityRankingData.ranking?.length === 0 ? (
          <p className={styles.noData}>Nenhum membro encontrado</p>
        ) : (
          <>
            <p className={styles.rankingCount}>
              Total de membros:{" "}
              <strong>{versatilityRankingData.totalMembros}</strong>
            </p>
            <div className={styles.rankingList}>
              {versatilityRankingData.ranking?.map((membro, index) => (
                <div key={membro.id} className={styles.rankingItem}>
                  <div className={styles.rankingPosition}>
                    <span className={styles.positionNumber}>#{index + 1}</span>
                    <div>
                      <strong>{membro.nome}</strong>
                      <span className={styles.memberEmail}>{membro.email}</span>
                    </div>
                  </div>
                  <div className={styles.rankingStats}>
                    <span className={styles.totalSkillsBadge}>
                      {membro.totalSkills} skills
                    </span>
                    <div className={styles.levelDistribution}>
                      <span className={`${styles.levelDot} ${styles.senior}`}>
                        S: {membro.detalhamento?.senior || 0}
                      </span>
                      <span className={`${styles.levelDot} ${styles.pleno}`}>
                        P: {membro.detalhamento?.pleno || 0}
                      </span>
                      <span className={`${styles.levelDot} ${styles.junior}`}>
                        J: {membro.detalhamento?.junior || 0}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default Analytics;
