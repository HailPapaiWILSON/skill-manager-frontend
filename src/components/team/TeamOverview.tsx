import { Team } from "../../types";

interface TeamOverviewProps {
  team: Team;
}

export function TeamOverview({ team }: TeamOverviewProps) {
  const memberCount = team.usuarios?.length || 0;
  const projectCount = team.projetos?.length || 0;

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="rounded-lg border bg-card p-6">
        <h3 className="text-sm font-medium text-muted-foreground">Members</h3>
        <p className="text-3xl font-bold mt-2">{memberCount}</p>
        <p className="text-sm text-muted-foreground mt-1">
          {memberCount === 1 ? "person" : "people"} in this team
        </p>
      </div>
      <div className="rounded-lg border bg-card p-6">
        <h3 className="text-sm font-medium text-muted-foreground">Projects</h3>
        <p className="text-3xl font-bold mt-2">{projectCount}</p>
        <p className="text-sm text-muted-foreground mt-1">
          {projectCount === 1 ? "project" : "projects"} in this team
        </p>
      </div>
      <div className="rounded-lg border bg-card p-6">
        <h3 className="text-sm font-medium text-muted-foreground">Team Code</h3>
        <p className="text-2xl font-mono font-bold mt-2">
          {team.codigoIngresso}
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Use this code to join the team
        </p>
      </div>
    </div>
  );
}
