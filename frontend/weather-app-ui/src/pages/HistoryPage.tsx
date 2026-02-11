import { useEffect, useState } from "react";
import { api } from "../api/client";
import type { SearchHistoryItem } from "../types/stats";
import { formatLocal } from "../utils/time";

export default function HistoryPage() {
  const [items, setItems] = useState<SearchHistoryItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setBusy(true);
      setErr(null);
      try {
        const res = await api.get<SearchHistoryItem[]>("/search/history", { params: { limit: 200 } });
        if (!cancelled) setItems(res.data);
      } catch (e: any) {
        const msg = e?.response?.data ?? e?.message ?? "Failed to load history.";
        if (!cancelled) setErr(typeof msg === "string" ? msg : "Failed to load history.");
      } finally {
        if (!cancelled) setBusy(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <h2>Search History</h2>

      {busy && <div>Loading…</div>}
      {err && <div style={{ color: "crimson" }}>{err}</div>}

      {!busy && !err && items.length === 0 && <div>No searches yet.</div>}

      {items.length > 0 && (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={th}>Time</th>
              <th style={th}>City</th>
              <th style={th}>Temp (°C)</th>
              <th style={th}>Condition</th>
              <th style={th}>Description</th>
            </tr>
          </thead>
          <tbody>
            {items.map((s) => (
              <tr key={s.id}>
                <td style={td}>{formatLocal(s.searchedAtUtc)}</td>
                <td style={td}>{s.city}</td>
                <td style={td}>{Math.round(s.tempC)}</td>
                <td style={td}>{s.conditionMain}</td>
                <td style={td}>{s.conditionDescription}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const th: React.CSSProperties = { textAlign: "left", borderBottom: "1px solid #ddd", padding: 8 };
const td: React.CSSProperties = { borderBottom: "1px solid #eee", padding: 8 };
