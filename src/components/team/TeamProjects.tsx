import { useQuery } from "@tanstack/react-query";
import api from "../../api/client";
import { Project } from "../../types";
import { Skeleton } from "../ui/skeleton";

interface TeamProjectsProps {
  teamId: number;
}

export function TeamProjects({ teamId }: TeamProjectsProps) {
  const { data: team, isLoading } = useQuery({
    queryKey: ["team", teamId, "projects"],
    queryFn: async () => {
      const response = await api.get(`/equipes/${teamId}/detalhes`);
      return response.data;
    },
  });

  if (isLoading) {
    return <ProjectsSkeleton />;
  }

  const projects = team?.projetos || [];

  const getStatusColor = (status: string) => {
    const colors = {
      planejado: "bg-blue-100 text-blue-800",
      em_andamento: "bg-yellow-100 text-yellow-800",
      concluido: "bg-green-100 text-green-800",
      cancelado: "bg-red-100 text-red-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100";
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {projects.map((project: Project) => (
        <div key={project.id} className="rounded-lg border bg-card p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold">{project.nome}</h3>
              {project.descricao && (
                <p className="text-sm text-muted-foreground mt-1">
                  {project.descricao}
                </p>
              )}
            </div>
            <span
              className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(project.status)}`}
            >
              {project.status.replace("_", " ")}
            </span>
          </div>
          {project.skills && project.skills.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {project.skills.map((skill) => (
                <span
                  key={skill.skillId}
                  className="px-2 py-0.5 text-xs bg-muted rounded-full"
                >
                  {skill.skill?.nome}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ProjectsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {[1, 2].map((i) => (
        <div key={i} className="rounded-lg border p-4 space-y-3">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-64" />
          <div className="flex gap-1.5">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}
