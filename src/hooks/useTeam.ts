import { useQuery } from '@tanstack/react-query';
import api from '../api/client';
import { Team } from '../types';

export function useTeam(teamId: number) {
  return useQuery({
    queryKey: ['team', teamId],
    queryFn: async () => {
      const response = await api.get(`/equipes/${teamId}/detalhes`);
      return response.data as Team;
    },
    enabled: !!teamId,
    staleTime: 5 * 60 * 1000,
  });
}
