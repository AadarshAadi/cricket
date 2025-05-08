import { useEffect, useState } from "react";
import axios from "axios";
import PlayerForm from "../components/PlayerForm";
const API = "http://localhost:5000";
export default function PlayersPage() {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [playersPerPage] = useState(5);

  const fetchPlayers = async () => {
    try {
      const res = await axios.get(`${API}/players`);
      setPlayers(res.data);
    } catch {
      setError("Failed to load players");
    }
  };

  const fetchTeams = async () => {
    const res = await axios.get(`${API}/teams`);
    setTeams(res.data);
  };

  const deletePlayer = async (id) => {
    await axios.delete(`${API}/players/${id}`);
    fetchPlayers();
  };

  const handleEdit = (player) => {
    setEditingPlayer(player);
  };

  const handleFormSubmit = () => {
    setEditingPlayer(null);
    fetchPlayers();
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    fetchPlayers();
    fetchTeams();
  }, []);

  const filteredPlayers = players.filter((player) =>
    player.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastPlayer = currentPage * playersPerPage;
  const indexOfFirstPlayer = indexOfLastPlayer - playersPerPage;
  const currentPlayers = filteredPlayers.slice(indexOfFirstPlayer, indexOfLastPlayer);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Players</h2>
      <PlayerForm
        onSubmit={handleFormSubmit}
        editingPlayer={editingPlayer}
        teams={teams}
      />
      <input
        type="text"
        className="border p-2 mb-4"
        placeholder="Search by player name"
        value={searchQuery}
        onChange={handleSearch}
      />
      {error && <p className="text-red-600">{error}</p>}
      <table className="table-auto w-full mt-6">
        <thead>
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Age</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Team</th>
            <th className="border p-2">Runs</th>
            <th className="border p-2">Wickets</th>
            <th className="border p-2">Matches</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentPlayers.map((player) => {
            const team = teams.find((t) => t._id === player.team_id);
            return (
              <tr key={player._id}>
                <td className="border p-2">{player.name}</td>
                <td className="border p-2">{player.age}</td>
                <td className="border p-2">{player.role}</td>
                <td className="border p-2">{team?.name || "Unknown"}</td>
                <td className="border p-2">{player.runs}</td>
                <td className="border p-2">{player.wickets}</td>
                <td className="border p-2">{player.matches_played}</td>
                <td className="border p-2">
                  <button className="text-blue-600 mr-2" onClick={() => handleEdit(player)}>
                    Edit
                  </button>
                  <button className="text-red-600" onClick={() => deletePlayer(player._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="mt-4">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white"
        >
          Previous
        </button>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage * playersPerPage >= filteredPlayers.length}
          className="px-4 py-2 bg-blue-500 text-white ml-2"
        >
          Next
        </button>
      </div>
    </div>
  );
}
