export interface User {
  id: number;
  nome: string;
  email: string;
  bio: string | null;
  funcao: 'usuario' | 'administrador';
  equipeId: number;
  equipe?: Team;
  skills?: UserSkill[];
}

export interface Team {
  id: number;
  nome: string;
  descricao: string | null;
  codigoIngresso: string;
  usuarios?: User[];
  projetos?: Project[];
}

export interface Project {
  id: number;
  nome: string;
  descricao: string | null;
  status: 'planejado' | 'em_andamento' | 'concluido' | 'cancelado';
  equipeId: number;
  equipe?: Team;
  skills?: ProjectSkill[];
}

export interface Skill {
  id: number;
  nome: string;
  categoriaId: number;
  categoria?: Category;
}

export interface Category {
  id: number;
  nome: string;
}

export interface UserSkill {
  usuarioId: number;
  skillId: number;
  nivel: 'junior' | 'pleno' | 'senior';
  anosExperiencia: number;
  skill?: Skill;
  usuario?: User;
}

export interface ProjectSkill {
  projetoId: number;
  skillId: number;
  skill?: Skill;
  projeto?: Project;
}

export interface HeatmapData {
  equipeId: number;
  nome: string;
  skillId: number;
  skill: string;
  totalEspecialistas: number;
  nivelMedio: number;
}

export interface TechRiskData {
  id: number;
  skill: string;
  totalEspecialistas: number;
}

export interface GapData {
  id: number;
  skill: string;
  categoria: string | null;
}