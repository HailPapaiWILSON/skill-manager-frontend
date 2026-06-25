import { HeatmapData } from "../../types";

interface HeatmapChartProps {
  data: HeatmapData[];
}

export function HeatmapChart({ data }: HeatmapChartProps) {
  // Group by skill
  const skills = Array.from(new Set(data.map((d) => d.skill)));
  const members = Array.from(new Set(data.map((d) => d.nome)));

  const getColor = (level: number) => {
    if (level < 1.5) return "bg-blue-100 text-blue-800";
    if (level < 2.5) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  if (data.length === 0) {
    return <p className="text-muted-foreground">No data available</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2 bg-muted text-left">Member / Skill</th>
            {skills.map((skill) => (
              <th
                key={skill}
                className="border p-2 bg-muted text-center text-sm"
              >
                {skill}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member}>
              <td className="border p-2 font-medium">{member}</td>
              {skills.map((skill) => {
                const cell = data.find(
                  (d) => d.nome === member && d.skill === skill,
                );
                return (
                  <td key={skill} className="border p-2 text-center">
                    {cell ? (
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${getColor(cell.nivelMedio)}`}
                      >
                        {cell.nivelMedio.toFixed(1)}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center gap-4 mt-4 text-sm">
        <span>Legend:</span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 bg-blue-100 rounded"></span>
          Junior (1.0-1.5)
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 bg-yellow-100 rounded"></span>
          Pleno (1.6-2.5)
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 bg-green-100 rounded"></span>
          Senior (2.6-3.0)
        </span>
      </div>
    </div>
  );
}
