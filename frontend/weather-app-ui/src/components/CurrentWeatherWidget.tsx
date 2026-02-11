import { useEffect, useState } from "react";
import { api } from "../api/client";
import type { CurrentWeather } from "../types/weather";
import { isLoggedIn } from "../auth/auth";

export default function CurrentWeatherWidget() {
  const [data, setData] = useState<CurrentWeather | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    /* TODO: Re-enable login check if the backend requires authentication for this endpoint.
    if (!isLoggedIn()) {
      setErr("Login to see current weather.");
      setData(null);
      return;
    }
    */

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

          const res = await api.get<CurrentWeather>("/weather/current", {
            params: { lat, lon },
          });

          setData(res.data);
        } catch (e) {
          setErr("Failed to load current weather.");
        }
      },
      () => setErr("Location permission denied.")
    );
  }, []);

  return (
    <div style={cardStyle}>
      <div style={{ fontWeight: 700, marginBottom: 6 }}>Current weather</div>

      {err && <div style={{ color: err.includes("Failed") ? "crimson" : "#444" }}>{err}</div>}
      {!err && !data && <div>Loading…</div>}

      {data && (
        <div style={{ display: "grid", gap: 2 }}>
          <div style={{ fontWeight: 600 }}>{data.city}</div>
          <div style={{ fontSize: 20 }}>{Math.round(data.tempC)}°C</div>
          <div style={{ color: "#444" }}>
            {data.conditionMain} ({data.conditionDescription})
          </div>
        </div>
      )}
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  minHeight: 120,
  minWidth: 280,
  maxWidth: 420,
  width: "fit-content",
  padding: 12,
  border: "1px solid #ddd",
  borderRadius: 8,
  backgroundColor: "#fafafa",
  textAlign: "center",
};
