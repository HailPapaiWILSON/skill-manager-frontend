// pages/TeamDetail.tsx
import { useParams, Link } from "react-router-dom";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { TeamOverview } from "../components/team/TeamOverview";
import { TeamAnalytics } from "../components/team/TeamAnalytics";
import { TeamMembers } from "../components/team/TeamMembers";
import { TeamProjects } from "../components/team/TeamProjects";
import { useTeam } from "../hooks/useTeam";
import { useAuth } from "../hooks/useAuth";
import { Skeleton } from "../components/ui/skeleton";
import { AlertCircle } from "lucide-react";

export function TeamDetail() {
  const { id } = useParams<{ id: string }>();
  const teamId = Number(id);
  const { data: team, isLoading, error } = useTeam(teamId);
  const { user } = useAuth();
  const isOwnTeam = user?.equipeId === teamId;

  if (isLoading) {
    return <TeamDetailSkeleton />;
  }

  if (error || !team) {
    return (
      <div className="flex items-center gap-2 text-red-600">
        <AlertCircle className="h-5 w-5" />
        <span>Team not found</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link
            to="/teams"
            className="text-sm text-muted-foreground hover:underline"
          >
            ← Back to Teams
          </Link>
          <h1 className="text-3xl font-bold mt-2">{team.nome}</h1>
          {team.descricao && (
            <p className="text-muted-foreground mt-1">{team.descricao}</p>
          )}
          <div className="flex items-center gap-2 mt-2">
            {isOwnTeam && (
              <span className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                Your Team
              </span>
            )}
            <span className="text-xs text-muted-foreground">
              Code: {team.codigoIngresso}
            </span>
          </div>
        </div>
        {isOwnTeam && (
          <Link to="/profile">
            <button className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
              Edit Your Profile
            </button>
          </Link>
        )}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">📊 Analytics</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <TeamOverview team={team} />
        </TabsContent>

        <TabsContent value="analytics">
          <TeamAnalytics teamId={teamId} />
        </TabsContent>

        <TabsContent value="projects">
          <TeamProjects teamId={teamId} />
        </TabsContent>

        <TabsContent value="members">
          <TeamMembers teamId={teamId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function TeamDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-12 w-full max-w-md" />
        <Skeleton className="h-96 w-full" />
      </div>
    </div>
  );
}
