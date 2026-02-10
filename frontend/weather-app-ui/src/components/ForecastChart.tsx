import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import { Line } from "react-chartjs-2";
import type { ForecastPoint } from "../types/weather";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, TimeScale);

export default function ForecastChart({ points }: { points: ForecastPoint[] }) {
  if (points.length === 0) return <div>No chart data for selected filters.</div>;

  const labels = points.map((p) =>
    new Date(p.dateTimeUtc).toISOString().replace("T", " ").slice(5, 16)
  );
  const temps = points.map((p) => p.tempC);

  const data = {
    labels,
    datasets: [
      {
        label: "Temperature (°C)",
        data: temps,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: { enabled: true },
    },
    scales: {
      y: { title: { display: true, text: "°C" } },
    },
  } as const;

  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
      <Line data={data} options={options} />
    </div>
  );
}
