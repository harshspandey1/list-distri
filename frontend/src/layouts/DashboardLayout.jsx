import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-xl font-bold mb-6">Admin Dashboard</h1>
          <nav className="space-y-3">
            <Link to="/dashboard" className="block text-gray-900 font-bold  hover:text-indigo-600">Home</Link>
            <Link to="/dashboard/agents" className="block text-gray-700 hover:text-indigo-600">👥 All Agents</Link>
            <Link to="/dashboard/upload" className="block text-gray-700 hover:text-indigo-600">📤 Upload & Distribute</Link>
            <Link to="/dashboard/tasks" className="block text-gray-700 hover:text-indigo-600">📋 All Tasks</Link>
          </nav>
        </div>

        <div>
          <button onClick={logout} className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600">Logout</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
