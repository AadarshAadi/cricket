import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TeamsPage from "./pages/TeamsPage";
import PlayersPage from "./pages/PlayersPage";
import MatchesPage from "./pages/MatchesPage";
import DashboardPage from "./pages/DashboardPage";
import LandingPage from "./pages/LandingPage";
import TeamMatchHistoryPage from "./pages/TeamMatchHistoryPage";
function App() {
  return (
    <Router>
      <div className="p-4">
        <Routes>
        <Route path="/" element={<LandingPage />} />
          <Route path="/teams" element={<TeamsPage />} />
          <Route path="/players" element={<PlayersPage />} />
          <Route path="/matches" element={<MatchesPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/teams/:teamId/history" element={<TeamMatchHistoryPage />} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;
