import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getHeatmap, getTechRisk, getGaps } from "../../../api/analytics";
import { Card } from "../../../components/ui/Card";
import styles from "./Analytics.module.css";

const Analytics = ({ teamId }) => {
  // Only fetch when this component renders (tab active)
  const heatmapQuery = useQuery({
    queryKey: ["analytics", "heatmap"],
    queryFn: getHeatmap,
  });
  const techRiskQuery = useQuery({
    queryKey: ["analytics", "techRisk"],
    queryFn: () => getTechRisk(2),
  });
  const gapsQuery = useQuery({
    queryKey: ["analytics", "gaps", teamId],
    queryFn: () => getGaps(teamId),
    enabled: !!teamId,
  });

  const isLoading =
    heatmapQuery.isLoading || techRiskQuery.isLoading || gapsQuery.isLoading;
  const error = heatmapQuery.error || techRiskQuery.error || gapsQuery.error;

  if (isLoading) return <div>Carregando análises...</div>;
  if (error) return <div>Erro ao carregar análises</div>;

  const heatmapData = heatmapQuery.data?.data || [];
  const techRiskData = techRiskQuery.data?.data || [];
  const gapsData = gapsQuery.data?.data || [];

  return (
    <div>
      <h2>Heatmap de Skills por Equipe</h2>
      <div className={styles.heatmapWrapper}>
        {heatmapData.length === 0 ? (
          <p>Nenhum dado de heatmap disponível.</p>
        ) : (
          <table className={styles.heatmap}>
            <thead>
              <tr>
                <th>Equipe / Skill</th>
                {Array.from(new Set(heatmapData.map((d) => d.skill))).map(
                  (skill) => (
                    <th key={skill}>{skill}</th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {Object.entries(
                heatmapData.reduce((acc, row) => {
                  if (!acc[row.nome]) acc[row.nome] = {};
                  acc[row.nome][row.skill] = row.nivelMedio;
                  return acc;
                }, {}),
              ).map(([team, skills]) => (
                <tr key={team}>
                  <td>
                    <strong>{team}</strong>
                  </td>
                  {Array.from(new Set(heatmapData.map((d) => d.skill))).map(
                    (skill) => {
                      const value = skills[skill];
                      return (
                        <td
                          key={skill}
                          style={{
                            backgroundColor: value
                              ? `rgba(37, 99, 235, ${value / 3})`
                              : "#f1f5f9",
                            fontWeight: value ? "bold" : "normal",
                            textAlign: "center",
                          }}
                        >
                          {value ? value.toFixed(1) : "-"}
                        </td>
                      );
                    },
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <h2>Risco Técnico (Skills com poucos especialistas)</h2>
      {techRiskData.length === 0 ? (
        <p>Nenhuma skill em risco.</p>
      ) : (
        <ul>
          {techRiskData.map((skill) => (
            <li key={skill.id}>
              {skill.skill} - {skill.totalEspecialistas} especialista(s)
            </li>
          ))}
        </ul>
      )}

      <h2>Gaps de Skills da Equipe</h2>
      {gapsData.length === 0 ? (
        <p>Nenhum gap identificado para esta equipe.</p>
      ) : (
        <ul>
          {gapsData.map((gap) => (
            <li key={gap.id}>
              {gap.skill} {gap.categoria && `(${gap.categoria})`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Analytics;
