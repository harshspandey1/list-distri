import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";

// Reusable component for statistics cards
const StatCard = ({ title, value }) => (
  <div className="bg-white p-4 rounded-lg shadow-md text-center">
    <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
    <p className="text-2xl font-bold mt-1">{value}</p>
  </div>
);

const DashboardPage = () => {
  // State to hold all the dashboard statistics
  const [stats, setStats] = useState({
    totalAgents: 0,
    totalTasks: 0,
    activeTasks: 0,
    completedTasks: 0,
    lastUploadDate: null
  });

  // Function to fetch the latest stats from the backend
  const getStats = async () => {
    try {
      const res = await api.get("/dashboard/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch dashboard stats", err);
    }
  };

  // Fetch stats when the component first loads
  useEffect(() => {
    getStats();
  }, []);

  // Function to handle the reset tasks button click
  const handleResetTasks = async () => {
    if (window.confirm("Are you sure you want to delete ALL tasks? This action cannot be undone.")) {
      try {
        await api.delete("/tasks/all");
        // Refresh the stats after deleting to show the new counts (0)
        getStats();
      } catch (err) {
        console.error("Failed to reset tasks", err);
        alert("Failed to reset tasks.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Welcome, Admin</h1>

      {/* Main Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Manage Agents</h2>
          <p className="text-gray-600 mb-4">View, create, or delete agent profiles.</p>
          <Link to="/dashboard/agents" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">View Agents</Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Upload New List</h2>
          <p className="text-gray-600 mb-4">Upload a CSV file to distribute new tasks.</p>
          <Link to="/dashboard/upload" className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600">Upload File</Link>
        </div>
      </div>

      {/* Statistics Grid */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          <StatCard title="Total Agents" value={stats.totalAgents ?? 0} />
          <StatCard title="Total Tasks" value={stats.totalTasks ?? 0} />
          <StatCard title="Active Tasks" value={stats.activeTasks ?? 0} />
          <StatCard title="Completed Tasks" value={stats.completedTasks ?? 0} />
          <StatCard title="Last Upload" value={stats.lastUploadDate ? new Date(stats.lastUploadDate).toLocaleDateString() : "N/A"} />
        </div>
      </div>

      {/* Danger Zone for Reset Button */}
      <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-red-800 mb-2">Danger Zone</h2>
        <p className="text-red-700 mb-4">This will permanently delete all tasks from the database.</p>
        <button
          onClick={handleResetTasks}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
        >
          Reset All Tasks 🗑️
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;