import { useEffect, useState } from "react";
import axios from "axios";
const API = "http://localhost:5000";
export default function PlayerForm({ onSubmit, editingPlayer, teams }) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [role, setRole] = useState("");
  const [teamId, setTeamId] = useState("");
  const [runs, setRuns] = useState("");
  const [wickets, setWickets] = useState("");
  const [matchesPlayed, setMatchesPlayed] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    if (editingPlayer) {
      setName(editingPlayer.name);
      setAge(editingPlayer.age);
      setRole(editingPlayer.role);
      setTeamId(editingPlayer.team_id);
      setRuns(editingPlayer.runs);
      setWickets(editingPlayer.wickets);
      setMatchesPlayed(editingPlayer.matches_played);
    } else {
      setName("");
      setAge("");
      setRole("");
      setTeamId("");
      setRuns(0);
      setWickets(0);
      setMatchesPlayed(0);
    }
  }, [editingPlayer]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !age || !role || !teamId || runs === "" || wickets === "" || matchesPlayed === "") {
      setErrorMessage("Please fill in all fields.");
      return;
    }
    const payload = { 
      name, 
      age: Number(age), 
      role, 
      team_id: teamId, 
      runs: Number(runs),
      wickets: Number(wickets), 
      matches_played: Number(matchesPlayed) 
    };
    try {
      if (editingPlayer) {
        await axios.put(`${API}/players/${editingPlayer._id}`, payload);
      } else {
        await axios.post(`${API}/players`, payload);
      }
      onSubmit();
    } catch (err) {
      console.error("Error submitting player:", err);
      setErrorMessage("An error occurred while submitting the player. Please try again.");
    }
  };
  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex flex-wrap gap-4">
        <input
          className="border p-2"
          placeholder="Player Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border p-2"
          placeholder="Age"
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
        <input
          className="border p-2"
          placeholder="Role (e.g., Batsman)"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
        <input
          className="border p-2"
          placeholder="Runs"
          type="number"
          value={runs}
          onChange={(e) => setRuns(e.target.value)}
        />
        <input
          className="border p-2"
          placeholder="Wickets"
          type="number"
          value={wickets}
          onChange={(e) => setWickets(e.target.value)}
        />
        <input
          className="border p-2"
          placeholder="Matches Played"
          type="number"
          value={matchesPlayed}
          onChange={(e) => setMatchesPlayed(e.target.value)}
        />
        <select
          className="border p-2"
          value={teamId}
          onChange={(e) => setTeamId(e.target.value)}
        >
          <option value="">Select Team</option>
          {teams.map((team) => (
            <option key={team._id} value={team._id}>
              {team.name}
            </option>
          ))}
        </select>
        <button className="bg-green-600 text-white px-4 py-2 rounded">
          {editingPlayer ? "Update" : "Add"} Player
        </button>
      </div>
      {errorMessage && <p className="text-red-500 mt-4 mb-6 text-center">{errorMessage}</p>}
    </form>
  );
}
