import { useEffect, useState } from "react";
import { api } from "../api/client";
import type { CurrentWeather } from "../types/weather";

export default function CurrentWeatherWidget() {
  const [data, setData] = useState<CurrentWeather | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setErr("Geolocation not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          setErr(null);
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const res = await api.get<CurrentWeather>(`/weather/current`, { params: { lat, lon } });
          setData(res.data);
        } catch {
          setErr("Failed to load current weather.");
        }
      },
      () => setErr("Location permission denied.")
    );
  }, []);

  return (
    <div style={{ minWidth: 260, padding: 8, border: "1px solid #ddd", borderRadius: 8 }}>
      <div style={{ fontWeight: 600 }}>Current</div>
      {err && <div style={{ color: "crimson" }}>{err}</div>}
      {!err && !data && <div>Loading…</div>}
      {data && (
        <div>
          <div>{data.city}</div>
          <div>{Math.round(data.tempC)}°C</div>
          <div>{data.conditionMain} ({data.conditionDescription})</div>
        </div>
      )}
    </div>
  );
}
