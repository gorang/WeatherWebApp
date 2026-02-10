import { Link, Route, Routes, useNavigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForecastPage from "./pages/ForecastPage";
import HistoryPage from "./pages/HistoryPage";
import StatsPage from "./pages/StatsPage";
import CurrentWeatherWidget from "./components/CurrentWeatherWidget";
import { clearToken, isLoggedIn } from "./auth/auth";

export default function App() {
  const nav = useNavigate();

  return (
    <div style={{ padding: 16, fontFamily: "system-ui, sans-serif" }}>
      <header style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "center" }}>
        <nav style={{ display: "flex", gap: 12 }}>
          <Link to="/">Forecast</Link>
          <Link to="/history">History</Link>
          <Link to="/stats">Stats</Link>
        </nav>

        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <CurrentWeatherWidget />
          {isLoggedIn() ? (
            <button
              onClick={() => {
                clearToken();
                nav("/login");
              }}
            >
              Logout
            </button>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </header>

      <hr />

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <ForecastPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <HistoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/stats"
          element={
            <ProtectedRoute>
              <StatsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}
