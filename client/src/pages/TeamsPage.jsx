import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import TeamForm from "../components/TeamForm";
const API_URL = "http://localhost:5000/teams";
export default function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingTeam, setEditingTeam] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [teamsPerPage] = useState(5);
  const fetchTeams = async () => {
    try {
      const res = await axios.get(API_URL);
      setTeams(res.data);
      setFilteredTeams(res.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load teams");
    }
  };
  const deleteTeam = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchTeams();
  };
  const handleEdit = (team) => {
    setEditingTeam(team);
  };
  const handleFormSubmit = () => {
    setEditingTeam(null);
    fetchTeams();
  };
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    const filtered = teams.filter((team) =>
      team.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredTeams(filtered);
  };
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  useEffect(() => {
    fetchTeams();
  }, []);
  const indexOfLastTeam = currentPage * teamsPerPage;
  const indexOfFirstTeam = indexOfLastTeam - teamsPerPage;
  const currentTeams = filteredTeams.slice(indexOfFirstTeam, indexOfLastTeam);
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Teams</h2>
      <TeamForm onSubmit={handleFormSubmit} editingTeam={editingTeam} />
      <input
        type="text"
        className="border p-2 mb-4"
        placeholder="Search by team name"
        value={searchQuery}
        onChange={handleSearch}
      />
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <>
          <table className="table-auto w-full mt-6">
            <thead>
              <tr>
                <th className="border p-2">Name</th>
                <th className="border p-2">City</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentTeams.map((team) => (
                <tr key={team._id}>
                  <td className="border p-2 text-blue-600 hover:underline">
                    <Link to={`/teams/${team._id}/history`}>{team.name}</Link>
                  </td>
                  <td className="border p-2">{team.city}</td>
                  <td className="border p-2">
                    <button className="text-blue-600 mr-2" onClick={() => handleEdit(team)}>
                      Edit
                    </button>
                    <button className="text-red-600" onClick={() => deleteTeam(team._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
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
              disabled={currentPage * teamsPerPage >= filteredTeams.length}
              className="px-4 py-2 bg-blue-500 text-white ml-2"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
