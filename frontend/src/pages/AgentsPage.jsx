import React, { useState, useEffect } from "react";
import api from "../utils/api";

const AgentsPage = () => {
  const [agents, setAgents] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", mobileNumber: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await api.get("/agents");
        setAgents(res.data);
      } catch (err) {
        console.error("Failed to fetch agents:", err);
        setErrorMsg(err.response?.data?.message || "Failed to fetch agents");
      }
    };
    fetchAgents();
  }, []);

  const handleInputChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleDelete = async (agentId) => {
    // Ask for confirmation before deleting
    if (window.confirm('Are you sure you want to delete this agent?')) {
        try {
            await api.delete(`/agents/${agentId}`);
            
            // Update the UI by filtering out the deleted agent
            setAgents(agents.filter((agent) => agent._id !== agentId));

        } catch (err) {
            console.error("Failed to delete agent:", err);
            setErrorMsg(err.response?.data?.message || "Failed to delete agent");
        }
    }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await api.post("/agents", form);
      setAgents((prev) => [...prev, res.data]);
      setForm({ name: "", email: "", mobileNumber: "", password: "" });
    } catch (err) {
      console.error("Failed to create agent:", err);
      setErrorMsg(err.response?.data?.message || "Failed to create agent");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-2">
      <h1 className="text-2xl font-bold mb-4">Agents Management</h1>

      {errorMsg && <p className="text-red-600 mb-2">{errorMsg}</p>}

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Add New Agent</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="name" value={form.name} onChange={handleInputChange} placeholder="Name" required className="p-2 border rounded"/>
          <input name="email" value={form.email} onChange={handleInputChange} placeholder="Email" type="email" required className="p-2 border rounded"/>
          <input name="mobileNumber" value={form.mobileNumber} onChange={handleInputChange} placeholder="Mobile Number" required className="p-2 border rounded"/>
          <input name="password" value={form.password} onChange={handleInputChange} placeholder="Password" type="password" required className="p-2 border rounded"/>
          <button type="submit" disabled={loading} className="md:col-span-2 bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700">
            {loading ? "Adding..." : "Add Agent"}
          </button>
        </form>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <table className="min-w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Mobile</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent,index) => (
              <tr key={agent._id|| index} className="border-b hover:bg-gray-50">
                <td className="p-3">{agent.name}</td>
                <td className="p-3">{agent.email}</td>
                <td className="p-3">{agent.mobileNumber}</td>
                <td className="p-3">
                  <button onClick={() => handleDelete(agent._id)}  className="text-red-600">Delete</button>
                </td>
              </tr>
            ))}
            {agents.length === 0 && (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">No agents found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AgentsPage;
