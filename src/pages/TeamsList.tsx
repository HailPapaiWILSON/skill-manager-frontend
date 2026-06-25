// pages/TeamsList.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../api/client";
import { Team } from "../types";
import { Skeleton } from "../components/ui/skeleton";
import { Search, Users, FolderKanban, UserPlus } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export function TeamsList() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: teams, isLoading } = useQuery({
    queryKey: ["teams"],
    queryFn: async () => {
      const response = await api.get("/equipes");
      return response.data as Team[];
    },
  });

  const filteredTeams = teams?.filter(
    (team) =>
      team.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (team.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ??
        false),
  );

  if (isLoading) {
    return <TeamsListSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">All Teams</h1>
          <p className="text-muted-foreground">
            Browse all teams in the organization
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search teams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTeams?.map((team) => {
          const isOwnTeam = user?.equipeId === team.id;
          return (
            <Link
              key={team.id}
              to={`/teams/${team.id}`}
              className="group block p-6 bg-card border rounded-lg hover:shadow-md transition-all hover:border-primary/50"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                    {team.nome}
                    {isOwnTeam && (
                      <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        Your Team
                      </span>
                    )}
                  </h3>
                  {team.descricao && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {team.descricao}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {team.usuarios?.length || 0} members
                </span>
                <span className="flex items-center gap-1">
                  <FolderKanban className="h-4 w-4" />
                  {team.projetos?.length || 0} projects
                </span>
                <span className="flex items-center gap-1 ml-auto">
                  <UserPlus className="h-4 w-4" />
                  <span className="font-mono text-xs">
                    {team.codigoIngresso}
                  </span>
                </span>
              </div>

              <div className="mt-4 pt-4 border-t">
                <span className="text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  View Team →
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {filteredTeams?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No teams found matching your search.
          </p>
        </div>
      )}
    </div>
  );
}

function TeamsListSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-64" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="p-6 border rounded-lg space-y-3">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
            <div className="flex gap-4">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
