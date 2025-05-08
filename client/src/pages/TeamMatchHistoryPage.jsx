import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
const API = "http://localhost:5000";
export default function TeamMatchHistoryPage() {
  const { teamId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`${API}/teams/${teamId}/match-history`);
        setData(res.data);
      } catch (err) {
        console.error("Error loading match history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [teamId]);
  if (loading) return <p className="text-center">Loading...</p>;
  if (!data) return <p className="text-center text-red-500">Failed to load data.</p>;
  const players = data.players || [];
  const matches = data.matches || [];
  const totalMatches = matches.length;
  const wins = matches.filter((match) => match.result === "win").length;
  const losses = totalMatches - wins;
  const winLossRatio = wins / (losses || 1);
  const topPlayer = players.length > 0 ? players.reduce((max, player) =>
    (player.runs > max.runs ? player : max), players[0]) : null;
  return (
    <div className="px-6 py-8">
      <h2 className="text-3xl font-bold mb-4">{data.team.name} – Match History</h2>
      <section className="mb-8">
        <h3 className="text-2xl font-semibold mb-2">Win/Loss Ratio</h3>
        {totalMatches > 0 ? (
          <>
            <p className="text-xl">Win: {wins}, Loss: {losses}</p>
            <p className="text-xl">Win/Loss Ratio: {winLossRatio.toFixed(2)}</p>
          </>
        ) : (
          <p>No matches played yet.</p>
        )}
      </section>
      <section className="mb-8">
        <h3 className="text-2xl font-semibold mb-2">Players</h3>
        {players.length > 0 ? (
          <table className="w-full border mb-4">
            <thead>
              <tr>
                <th className="border p-2">Name</th>
                <th className="border p-2">Runs</th>
                <th className="border p-2">Wickets</th>
                <th className="border p-2">Matches Played</th>
              </tr>
            </thead>
            <tbody>
              {players.map((p) => (
                <tr key={p.id}>
                  <td className="border p-2">{p.name}</td>
                  <td className="border p-2">{p.runs}</td>
                  <td className="border p-2">{p.wickets}</td>
                  <td className="border p-2">{p.matches_played}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No players available for this team.</p>
        )}
      </section>
      {topPlayer && (
        <section className="mb-8">
          <h3 className="text-2xl font-semibold mb-2">Top Performing Player</h3>
          <div className="border p-4 rounded-xl bg-gray-100 shadow-sm">
            <h4 className="text-xl font-medium mb-2">Player: {topPlayer.name}</h4>
            <p>Runs: {topPlayer.runs}</p>
            <p>Wickets: {topPlayer.wickets}</p>
            <p>Matches Played: {topPlayer.matches_played}</p>
          </div>
        </section>
      )}
      <section>
        <h3 className="text-2xl font-semibold mb-2">Matches</h3>
        {matches.length > 0 ? (
          matches.map((match) => (
            <div key={match.match_id} className="mb-6 border rounded-xl p-4 bg-gray-50 shadow-sm">
              <h4 className="text-xl font-medium mb-2">
                Match on {match.date || "Unknown Date"}
              </h4>
              <p>{match.result}</p>
            </div>
          ))
        ) : (
          <p>No matches available for this team.</p>
        )}
      </section>
    </div>
  );
}
