import { useEffect, useMemo, useState } from "react";
import { api } from "../api/client";
import type { SearchStatistics } from "../types/stats";
import { formatLocal } from "../utils/time";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function StatsPage() {
  const [data, setData] = useState<SearchStatistics | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setBusy(true);
      setErr(null);
      try {
        const res = await api.get<SearchStatistics>("/search/statistics");
        if (!cancelled) setData(res.data);
      } catch (e: any) {
        const msg = e?.response?.data ?? e?.message ?? "Failed to load statistics.";
        if (!cancelled) setErr(typeof msg === "string" ? msg : "Failed to load statistics.");
      } finally {
        if (!cancelled) setBusy(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const pieData = useMemo(() => {
    const labels = data?.conditionDistribution?.map((x) => x.conditionMain) ?? [];
    const counts = data?.conditionDistribution?.map((x) => x.count) ?? [];
    return {
      labels,
      datasets: [
        {
          label: "Count",
          data: counts,
        },
      ],
    };
  }, [data]);

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <h2>Statistics</h2>

      {busy && <div>Loading…</div>}
      {err && <div style={{ color: "crimson" }}>{err}</div>}

      {!busy && !err && !data && <div>No data.</div>}

      {data && (
        <>
          <section style={card}>
            <h3 style={{ marginTop: 0 }}>Top 3 searched cities</h3>
            {data.topCities.length === 0 ? (
              <div>No searches yet.</div>
            ) : (
              <ol>
                {data.topCities.map((c) => (
                  <li key={c.city}>
                    {c.city} — {c.count}
                  </li>
                ))}
              </ol>
            )}
          </section>

          <section style={card}>
            <h3 style={{ marginTop: 0 }}>Latest 3 searches</h3>
            {data.latestSearches.length === 0 ? (
              <div>No searches yet.</div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={th}>Time</th>
                    <th style={th}>City</th>
                    <th style={th}>Temp (°C)</th>
                    <th style={th}>Condition</th>
                  </tr>
                </thead>
                <tbody>
                  {data.latestSearches.map((s, idx) => (
                    <tr key={`${s.city}-${s.searchedAtUtc}-${idx}`}>
                      <td style={td}>{formatLocal(s.searchedAtUtc)}</td>
                      <td style={td}>{s.city}</td>
                      <td style={td}>{Math.round(s.tempC)}</td>
                      <td style={td}>{s.conditionMain}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>

          <section style={card}>
            <h3 style={{ marginTop: 0 }}>Weather condition distribution</h3>
            {data.conditionDistribution.length === 0 ? (
              <div>No searches yet.</div>
            ) : (
              <div style={{ width: "100%", maxWidth: 600 }}>
                <Pie data={pieData} />
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

const card: React.CSSProperties = {
  border: "1px solid #ddd",
  borderRadius: 8,
  padding: 12,
};

const th: React.CSSProperties = { textAlign: "left", borderBottom: "1px solid #ddd", padding: 8 };
const td: React.CSSProperties = { borderBottom: "1px solid #eee", padding: 8 };
