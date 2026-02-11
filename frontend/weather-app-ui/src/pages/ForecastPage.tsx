import { useMemo, useState } from "react";
import { api } from "../api/client";
import type { ForecastResponse, ForecastPoint } from "../types/weather";
import ForecastChart from "../components/ForecastChart";
import ForecastGrid from "../components/ForecastGrid";

type RangeOption = "1" | "3" | "5";

export default function ForecastPage() {
  const [city, setCity] = useState("Zagreb");
  const [rangeDays, setRangeDays] = useState<RangeOption>("5");

  const [rawCity, setRawCity] = useState<string>("");
  const [rawPoints, setRawPoints] = useState<ForecastPoint[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function search() {
    setErr(null);
    setBusy(true);
    try {
      const res = await api.get<ForecastResponse>("/weather/forecast", { params: { city } });
      setRawCity(res.data.city);
      setRawPoints(res.data.points);
    } catch (e: any) {
      const msg = e?.response?.data ?? e?.message ?? "Failed to load forecast.";
      setErr(typeof msg === "string" ? msg : "Failed to load forecast.");
      setRawCity("");
      setRawPoints([]);
    } finally {
      setBusy(false);
    }
  }

  // Filter parameter #2: time period (1/3/5 days from first data point)
  const filteredPoints = useMemo(() => {
    if (rawPoints.length === 0) return [];
    const start = new Date(rawPoints[0].dateTimeUtc).getTime();
    const days = parseInt(rangeDays, 10);
    const end = start + days * 24 * 60 * 60 * 1000;

    return rawPoints.filter((p) => {
      const t = new Date(p.dateTimeUtc).getTime();
      return t >= start && t <= end;
    });
  }, [rawPoints, rangeDays]);

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <h2>Forecast</h2>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "end" }}>
        <label>
          City
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="e.g. Zagreb"
            style={{ display: "block", padding: 8, width: 240 }}
          />
        </label>

        <label>
          Time period
          <select
            value={rangeDays}
            onChange={(e) => setRangeDays(e.target.value as RangeOption)}
            style={{ display: "block", padding: 8 }}
          >
            <option value="1">Next 1 day</option>
            <option value="3">Next 3 days</option>
            <option value="5">Next 5 days</option>
          </select>
        </label>

        <button onClick={search} disabled={busy} style={{ padding: "10px 14px" }}>
          {busy ? "Searching..." : "Search"}
        </button>
      </div>

      {err && <div style={{ color: "crimson" }}>{err}</div>}

      {rawPoints.length > 0 && (
        <div>
          <div style={{ marginBottom: 8 }}>
            <strong>City:</strong> {rawCity} • <strong>Points:</strong> {filteredPoints.length} (filtered)
          </div>

          <div style={{ display: "grid", gap: 16 }}>
            <ForecastChart points={filteredPoints} />
            <ForecastGrid points={filteredPoints} />
          </div>
        </div>
      )}

      {rawPoints.length === 0 && !err && (
        <div style={{ color: "#666" }}>
          Enter a city and click <strong>Search</strong>.
        </div>
      )}
    </div>
  );
}
