import { useEffect, useState } from "react";
import axios from "axios";
const API_URL = "http://localhost:5000/teams";
export default function TeamForm({ onSubmit, editingTeam }) {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  useEffect(() => {
    if (editingTeam) {
      setName(editingTeam.name);
      setCity(editingTeam.city);
    } else {
      setName("");
      setCity("");
    }
  }, [editingTeam]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !city) return;

    if (editingTeam) {
      await axios.put(`${API_URL}/${editingTeam._id}`, { name, city });
    } else {
      await axios.post(API_URL, { name, city });
    }
    setName("");
    setCity("");
    onSubmit();
  };
  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex gap-4">
        <input
          className="border p-2 w-1/3"
          placeholder="Team Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border p-2 w-1/3"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">
          {editingTeam ? "Update" : "Add"} Team
        </button>
      </div>
    </form>
  );
}
