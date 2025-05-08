import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
const API = "http://localhost:5000";
const Card = ({ title, value, bg }) => (
  <motion.div
    className={`${bg} p-6 rounded-2xl shadow-xl w-full h-full`}
    whileHover={{ scale: 1.05 }}
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
  >
    <h3 className="text-lg font-semibold">{title}</h3>
    <p className="text-3xl font-bold">{value}</p>
  </motion.div>
);
export default function DashboardPage() {
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const resTeams = await axios.get(`${API}/teams`);
        const resPlayers = await axios.get(`${API}/players`);
        const resMatches = await axios.get(`${API}/matches`);
        setTeams(resTeams.data);
        setPlayers(resPlayers.data);
        setMatches(resMatches.data);
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);
  const topPlayer = () => {
    if (players.length === 0) return "N/A";
    const sortedByRuns = [...players].sort((a, b) => b.runs - a.runs);
    return sortedByRuns[0]?.name || "N/A";
  };
  const totalRuns = players.reduce((acc, p) => acc + (p.runs || 0), 0);
  const totalWickets = players.reduce((acc, p) => acc + (p.wickets || 0), 0);
  const totalMatches = players.reduce((acc, p) => acc + (p.matches_played || 0), 0);
  return (
    <div className="w-full px-6 py-8">
      <h2 className="text-4xl font-bold mb-8 text-center">🏏 Dashboard</h2>
      {loading ? (
        <p className="text-center text-lg">Loading...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            <Link to="/teams">
              <Card title="Teams" value={teams.length} bg="bg-blue-100" />
            </Link>
            <Link to="/matches">
              <Card title="Matches" value={matches.length} bg="bg-green-100" />
            </Link>
            <Link to="/players">
              <Card title="Players" value={players.length} bg="bg-yellow-100" />
            </Link>
            <Card title="Top Player (by runs)" value={topPlayer()} bg="bg-purple-100" />
          </div>
          <div className="mt-12">
            <h3 className="text-2xl font-semibold mb-6 text-center">📊 Player Stats</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card title="Total Runs" value={totalRuns} bg="bg-red-100" />
              <Card title="Total Wickets" value={totalWickets} bg="bg-indigo-100" />
              <Card title="Matches Played" value={totalMatches} bg="bg-teal-100" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
