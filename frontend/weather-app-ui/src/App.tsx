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
      <header style={headerStyle}>
        {/* Always-visible widget (centered) */}
        <div style={widgetContainerStyle}>
          <CurrentWeatherWidget />
        </div>

        {/* Navigation + auth controls */}
        <div style={menuRowStyle}>
          <nav style={navStyle}>
            <Link to="/">Forecast</Link>
            <Link to="/history">History</Link>
            <Link to="/stats">Stats</Link>
          </nav>

          <div style={authStyle}>
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
        </div>
      </header>

      <div style={{ paddingTop: 16 }}>
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
    </div>
  );
}

const headerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  gap: 12,
  paddingBottom: 12,
  borderBottom: "1px solid #ddd",
};

const widgetContainerStyle: React.CSSProperties = {
  width: "100%",
  display: "flex",
  justifyContent: "center",
};

const menuRowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 16,
  alignItems: "center",
  flexWrap: "wrap",
};

const navStyle: React.CSSProperties = {
  display: "flex",
  gap: 12,
};

const authStyle: React.CSSProperties = {
  display: "flex",
  gap: 12,
  alignItems: "center",
};
