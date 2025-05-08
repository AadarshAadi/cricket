import { useState } from "react";
import axios from "axios";
const API = "http://localhost:5000";
export default function MatchForm({ onSubmit, teams }) {
  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");
  const [score1, setScore1] = useState("");
  const [score2, setScore2] = useState("");
  const [error, setError] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!team1 || !team2 || team1 === team2) {
      setError("Please select two different teams.");
      return;
    }
    const matchData = {
      team1_id: team1,
      team2_id: team2,
      team1_score: Number(score1),
      team2_score: Number(score2),
    };
    try {
      await axios.post(`${API}/matches`, matchData);
      setTeam1("");
      setTeam2("");
      setScore1("");
      setScore2("");
      setError("");
      onSubmit();
    } catch (err) {
      console.error(err);
      setError("Failed to create match");
    }
  };
  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex flex-wrap gap-4">
        <select className="border p-2" value={team1} onChange={(e) => setTeam1(e.target.value)}>
          <option value="">Select Team 1</option>
          {teams.map((t) => (
            <option key={t._id} value={t._id}>{t.name}</option>
          ))}
        </select>
        <input
          type="number"
          className="border p-2"
          placeholder="Team 1 Score"
          value={score1}
          onChange={(e) => setScore1(e.target.value)}
        />
        <select className="border p-2" value={team2} onChange={(e) => setTeam2(e.target.value)}>
          <option value="">Select Team 2</option>
          {teams.map((t) => (
            <option key={t._id} value={t._id}>{t.name}</option>
          ))}
        </select>
        <input
          type="number"
          className="border p-2"
          placeholder="Team 2 Score"
          value={score2}
          onChange={(e) => setScore2(e.target.value)}
        />
        <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded">
          Create Match
        </button>
      </div>
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </form>
  );
}
