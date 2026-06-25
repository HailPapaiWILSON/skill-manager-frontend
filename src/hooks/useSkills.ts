import { useQuery } from "@tanstack/react-query";
import api from "../api/client";
import type { Skill, Category } from "../types";

export function useSkills() {
  return useQuery({
    queryKey: ["skills"],
    queryFn: async () => {
      const response = await api.get("/skills");
      return response.data as Skill[];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get('/categorias');
      return response.data as Category[];
    },
    staleTime: 5 * 60 * 1000,
  });
}