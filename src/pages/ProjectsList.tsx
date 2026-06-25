// pages/ProjectsList.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../api/client";
import { Project } from "../types";
import { Skeleton } from "../components/ui/skeleton";
import { Search, Filter } from "lucide-react";

export function ProjectsList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await api.get("/projetos");
      return response.data as Project[];
    },
  });

  const statuses = [
    "all",
    "planejado",
    "em_andamento",
    "concluido",
    "cancelado",
  ];

  const filteredProjects = projects?.filter((project) => {
    const matchesSearch =
      project.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ??
        false);
    const matchesStatus =
      statusFilter === "all" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    const colors = {
      planejado: "bg-blue-100 text-blue-800 border-blue-200",
      em_andamento: "bg-yellow-100 text-yellow-800 border-yellow-200",
      concluido: "bg-green-100 text-green-800 border-green-200",
      cancelado: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100";
  };

  const getStatusLabel = (status: string) => {
    return status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  if (isLoading) {
    return <ProjectsListSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">All Projects</h1>
          <p className="text-muted-foreground">
            Browse all projects across the organization
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status === "all" ? "All Status" : getStatusLabel(status)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {filteredProjects?.map((project) => (
          <Link
            key={project.id}
            to={`/projects/${project.id}`}
            className="group block p-6 bg-card border rounded-lg hover:shadow-md transition-all hover:border-primary/50"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                  {project.nome}
                </h3>
                {project.descricao && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {project.descricao}
                  </p>
                )}
              </div>
              <span
                className={`px-2 py-0.5 text-xs rounded-full border ${getStatusColor(project.status)}`}
              >
                {getStatusLabel(project.status)}
              </span>
            </div>

            <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                Team: {project.equipe?.nome || "N/A"}
              </span>
              {project.skills && project.skills.length > 0 && (
                <span className="flex items-center gap-1">
                  {project.skills.length} skill
                  {project.skills.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>

            {project.skills && project.skills.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {project.skills.slice(0, 3).map((skill) => (
                  <span
                    key={skill.skillId}
                    className="px-2 py-0.5 text-xs bg-muted rounded-full"
                  >
                    {skill.skill?.nome}
                  </span>
                ))}
                {project.skills.length > 3 && (
                  <span className="px-2 py-0.5 text-xs text-muted-foreground">
                    +{project.skills.length - 3} more
                  </span>
                )}
              </div>
            )}

            <div className="mt-4 pt-4 border-t">
              <span className="text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                View Project →
              </span>
            </div>
          </Link>
        ))}
      </div>

      {filteredProjects?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No projects found matching your filters.
          </p>
        </div>
      )}
    </div>
  );
}

function ProjectsListSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="flex gap-4">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-40" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-6 border rounded-lg space-y-3">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-4 w-32" />
            <div className="flex gap-1.5">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
