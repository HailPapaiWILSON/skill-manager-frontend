import { useQuery } from "@tanstack/react-query";
import api from "../api/client";
import { HeatmapData, TechRiskData, GapData } from "../types";

export function useTeamAnalytics(teamId: number) {
  // Fetch global heatmap
  const heatmapQuery = useQuery({
    queryKey: ["heatmap"],
    queryFn: async () => {
      const response = await api.get("/analytics/heatmap");
      return response.data as HeatmapData[];
    },
    staleTime: 5 * 60 * 1000,
  });
  const gapsQuery = useQuery({
    queryKey: ["gaps", teamId],
    queryFn: async () => {
      const response = await api.get(`/analytics/gaps?equipeId=${teamId}`);
      return response.data as GapData[];
    },
    enabled: !!teamId,
    staleTime: 5 * 60 * 1000,
  });

  // Compute team tech risk
  const techRiskQuery = useQuery({
    queryKey: ["team-tech-risk", teamId],
    queryFn: async () => {
      const teamResponse = await api.get(`/equipes/${teamId}/detalhes`);
      const teamMembers = teamResponse.data.usuarios || [];

      // Count skills in team
      const skillCount = new Map<number, number>();
      teamMembers.forEach((member: any) => {
        member.skills?.forEach((skill: any) => {
          skillCount.set(
            skill.skillId,
            (skillCount.get(skill.skillId) || 0) + 1,
          );
        });
      });

      // Get all skills
      const skillsResponse = await api.get("/skills");
      const allSkills = skillsResponse.data;

      // Return skills with <= 2 experts
      return allSkills
        .map(
          (skill: any): TechRiskData => ({
            id: skill.id,
            skill: skill.nome,
            totalEspecialistas: skillCount.get(skill.id) || 0,
          }),
        )
        .filter(
          (skill: { totalEspecialistas: number }) =>
            skill.totalEspecialistas <= 2,
        )
        .sort(
          (
            a: { totalEspecialistas: number },
            b: { totalEspecialistas: number },
          ) => a.totalEspecialistas - b.totalEspecialistas,
        );
    },
    enabled: !!teamId,
    staleTime: 5 * 60 * 1000,
  });

  // Filter heatmap for this team
  const teamHeatmap =
    heatmapQuery.data?.filter((item) => item.equipeId === teamId) ?? [];

  return {
    heatmapQuery,
    gapsQuery,
    techRiskQuery,
    teamHeatmap,
    teamTechRisk: techRiskQuery.data ?? [],
    teamGaps: gapsQuery.data ?? [],
    isLoading:
      heatmapQuery.isLoading || gapsQuery.isLoading || techRiskQuery.isLoading,
    isError: heatmapQuery.isError || gapsQuery.isError || techRiskQuery.isError,
  };
}
