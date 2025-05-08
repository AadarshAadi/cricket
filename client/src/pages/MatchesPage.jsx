import { useEffect, useState } from "react";
import axios from "axios";
import MatchForm from "../components/MatchForm";
const API = "http://localhost:5000";
export default function MatchesPage() {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const fetchMatches = async () => {
    const res = await axios.get(`${API}/matches`);
    setMatches(res.data);
  };
  const fetchTeams = async () => {
    const res = await axios.get(`${API}/teams`);
    setTeams(res.data);
  };
  useEffect(() => {
    fetchMatches();
    fetchTeams();
  }, []);
  const getTeamName = (id) => teams.find((t) => t._id === id)?.name || "Unknown";
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Matches</h2>
      <MatchForm onSubmit={fetchMatches} teams={teams} />
      <table className="table-auto w-full mt-6 border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Team 1</th>
            <th className="border p-2">Score</th>
            <th className="border p-2">Team 2</th>
            <th className="border p-2">Score</th>
            <th className="border p-2">Winner</th>
            <th className="border p-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {matches.map((m) => (
            <tr key={m.id}>
              <td className="border p-2">{getTeamName(m.team1_id)}</td>
              <td className="border p-2">{m.team1_score}</td>
              <td className="border p-2">{getTeamName(m.team2_id)}</td>
              <td className="border p-2">{m.team2_score}</td>
              <td className="border p-2 font-semibold">
                {m.winner_id ? getTeamName(m.winner_id) : "Draw"}
              </td>
              <td className="border p-2">
                {m.date ? new Date(m.date).toLocaleString() : "Invalid Date"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
