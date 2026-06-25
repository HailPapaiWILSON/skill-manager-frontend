import { GapData } from "../../types";
import { AlertCircle } from "lucide-react";

interface GapListProps {
  data: GapData[];
}

export function GapList({ data }: GapListProps) {
  // Group by category
  const grouped = data.reduce(
    (acc, item) => {
      const category = item.categoria || "Uncategorized";
      if (!acc[category]) acc[category] = [];
      acc[category].push(item);
      return acc;
    },
    {} as Record<string, GapData[]>,
  );

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([category, items]) => (
        <div key={category}>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">
            {category}
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2 p-2 bg-muted/50 rounded"
              >
                <AlertCircle className="h-4 w-4 text-orange-500" />
                <span>{item.skill}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
