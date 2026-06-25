import { TechRiskData } from "../../types";
import { AlertTriangle, Users } from "lucide-react";

interface TechRiskListProps {
  data: TechRiskData[];
}

export function TechRiskList({ data }: TechRiskListProps) {
  return (
    <div className="space-y-3">
      {data.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
        >
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <span className="font-medium">{item.skill}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>
              {item.totalEspecialistas} expert
              {item.totalEspecialistas !== 1 ? "s" : ""}
            </span>
            {item.totalEspecialistas === 0 && (
              <span className="px-2 py-0.5 text-xs bg-red-100 text-red-600 rounded-full">
                Critical
              </span>
            )}
            {item.totalEspecialistas === 1 && (
              <span className="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-600 rounded-full">
                At Risk
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
