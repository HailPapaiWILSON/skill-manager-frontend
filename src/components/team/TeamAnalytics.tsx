// components/team/TeamAnalytics.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { HeatmapChart } from "../analytics/HeatmapChart";
import { TechRiskList } from "../analytics/TechRiskList";
import { GapList } from "../analytics/GapList";
import { useTeamAnalytics } from "../../hooks/useTeamAnalytics";
import { Skeleton } from "../ui/skeleton";
import { AlertCircle } from "lucide-react";

interface TeamAnalyticsProps {
  teamId: number;
}

export function TeamAnalytics({ teamId }: TeamAnalyticsProps) {
  const { teamHeatmap, teamTechRisk, teamGaps, isLoading, isError } =
    useTeamAnalytics(teamId);

  if (isLoading) {
    return <AnalyticsSkeleton />;
  }

  if (isError) {
    return (
      <div className="flex items-center gap-2 text-red-600">
        <AlertCircle className="h-5 w-5" />
        <span>Failed to load analytics data</span>
      </div>
    );
  }

  return (
    <Tabs defaultValue="heatmap" className="space-y-4">
      <TabsList>
        <TabsTrigger value="heatmap">📊 Heatmap</TabsTrigger>
        <TabsTrigger value="tech-risk">⚠️ Tech Risk</TabsTrigger>
        <TabsTrigger value="gaps">🔍 Gaps</TabsTrigger>
      </TabsList>

      <TabsContent value="heatmap">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold mb-2">Skill Distribution</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Color intensity represents average skill level (1=Junior, 2=Pleno,
            3=Senior)
          </p>
          {teamHeatmap.length > 0 ? (
            <HeatmapChart data={teamHeatmap} />
          ) : (
            <p className="text-muted-foreground">
              No skill data available for this team
            </p>
          )}
        </div>
      </TabsContent>

      <TabsContent value="tech-risk">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold mb-2">Technical Risks</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Skills with limited expertise (≤ 2 experts)
          </p>
          {teamTechRisk.length > 0 ? (
            <TechRiskList data={teamTechRisk} />
          ) : (
            <p className="text-muted-foreground">
              ✅ No technical risks detected! All skills have sufficient
              coverage.
            </p>
          )}
        </div>
      </TabsContent>

      <TabsContent value="gaps">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold mb-2">Skill Gaps</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Skills required by projects but missing from team
          </p>
          {teamGaps.length > 0 ? (
            <GapList data={teamGaps} />
          ) : (
            <p className="text-muted-foreground">
              ✅ No gaps detected! All project requirements are covered.
            </p>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}

function AnalyticsSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-12 w-64" />
      <Skeleton className="h-96 w-full" />
    </div>
  );
}
