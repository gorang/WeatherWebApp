import type { ForecastPoint } from "../types/weather";

export default function ForecastGrid({ points }: { points: ForecastPoint[] }) {
  if (points.length === 0) return <div>No data for selected filters.</div>;

  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th style={th}>Time (UTC)</th>
          <th style={th}>Temp (°C)</th>
          <th style={th}>Condition</th>
          <th style={th}>Description</th>
        </tr>
      </thead>
      <tbody>
        {points.map((p) => (
          <tr key={p.dateTimeUtc}>
            <td style={td}>{new Date(p.dateTimeUtc).toISOString().replace("T", " ").slice(0, 16)}</td>
            <td style={td}>{Math.round(p.tempC)}</td>
            <td style={td}>{p.conditionMain}</td>
            <td style={td}>{p.conditionDescription}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const th: React.CSSProperties = { textAlign: "left", borderBottom: "1px solid #ddd", padding: 8 };
const td: React.CSSProperties = { borderBottom: "1px solid #eee", padding: 8 };
