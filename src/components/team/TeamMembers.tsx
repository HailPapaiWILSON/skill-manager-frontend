import { useQuery } from "@tanstack/react-query";
import api from "../../api/client";
import { User, UserSkill } from "../../types";
import { Skeleton } from "../ui/skeleton";

interface TeamMembersProps {
  teamId: number;
}

export function TeamMembers({ teamId }: TeamMembersProps) {
  const { data: team, isLoading } = useQuery({
    queryKey: ["team", teamId, "members"],
    queryFn: async () => {
      const response = await api.get(`/equipes/${teamId}/detalhes`);
      return response.data;
    },
  });

  if (isLoading) {
    return <MembersSkeleton />;
  }

  const members = team?.usuarios || [];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {members.map((member: User) => (
        <div key={member.id} className="rounded-lg border bg-card p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold">{member.nome}</h3>
              <p className="text-sm text-muted-foreground">{member.email}</p>
              {member.bio && (
                <p className="text-sm mt-2 line-clamp-2">{member.bio}</p>
              )}
            </div>
          </div>
          {member.skills && member.skills.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {member.skills.map((skill: UserSkill) => (
                <span
                  key={skill.skillId}
                  className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-muted rounded-full"
                >
                  {skill.skill?.nome}
                  <span className="text-muted-foreground">({skill.nivel})</span>
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function MembersSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-lg border p-4 space-y-3">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-40" />
          <div className="flex gap-1.5">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}
