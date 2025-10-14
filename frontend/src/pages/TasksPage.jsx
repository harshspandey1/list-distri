import React, { useEffect, useState, useMemo } from "react";
import api from "../utils/api";

const TasksPage = () => {
  // State for all data and UI controls
  const [tasks, setTasks] = useState([]);
  const [agents, setAgents] = useState([]);
  const [filterAgent, setFilterAgent] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  // Fetch all necessary data on component load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksRes, agentsRes] = await Promise.all([
          api.get("/tasks"),
          api.get("/agents"),
        ]);
        setTasks(tasksRes.data);
        setAgents(agentsRes.data);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };
    fetchData();
  }, []);

  // Handle toggling a task's status
  const handleStatusToggle = async (taskId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'completed' : 'active';
    try {
      const res = await api.patch(`/tasks/${taskId}/status`, { status: newStatus });
      setTasks(currentTasks => 
        currentTasks.map(task => 
          task._id === taskId ? res.data : task
        )
      );
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  // Process tasks: first filter, then sort
  const processedTasks = useMemo(() => {
    let processableTasks = [...tasks];

    if (filterAgent) {
      processableTasks = processableTasks.filter(task => task.assignedTo?._id === filterAgent);
    }

    if (sortConfig.key !== null) {
      processableTasks.sort((a, b) => {
        const aValue = sortConfig.key === 'agent' ? a.assignedTo?.name : a[sortConfig.key];
        const bValue = sortConfig.key === 'agent' ? b.assignedTo?.name : b[sortConfig.key];
        if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    
    return processableTasks;
  }, [tasks, filterAgent, sortConfig]);

  // Handle sort requests from table headers
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">All Distributed Tasks</h1>

      {/* Filter Dropdown */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <label htmlFor="agentFilter" className="mr-2 font-semibold">Filter by Agent:</label>
        <select
          id="agentFilter"
          value={filterAgent}
          onChange={(e) => setFilterAgent(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="">All Agents</option>
          {agents.map(agent => (
            <option key={agent._id} value={agent._id}>{agent.name}</option>
          ))}
        </select>
      </div>

      {/* Tasks Table */}
      <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b">
              <th className="p-3 text-left"><button onClick={() => requestSort('agent')} className="font-semibold">Agent</button></th>
              <th className="p-3 text-left"><button onClick={() => requestSort('firstName')} className="font-semibold">First Name</button></th>
              <th className="p-3 text-left"><button onClick={() => requestSort('phone')} className="font-semibold">Phone</button></th>
              <th className="p-3 text-left font-semibold">Status</th>
              <th className="p-3 text-left font-semibold">Notes</th>
            </tr>
          </thead>
          <tbody>
            {processedTasks.map(task => (
              <tr key={task._id} className="border-b hover:bg-gray-50">
                <td className="p-3 whitespace-nowrap">{task.assignedTo?.name || 'N/A'}</td>
                <td className="p-3 whitespace-nowrap">{task.firstName}</td>
                <td className="p-3 whitespace-nowrap">{task.phone}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleStatusToggle(task._id, task.status)}
                    className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                      task.status === 'active' 
                        ? 'bg-yellow-200 text-yellow-800' 
                        : 'bg-green-200 text-green-800'
                    }`}
                  >
                    {task.status}
                  </button>
                </td>
                <td className="p-3">{task.notes}</td>
              </tr>
            ))}
            {processedTasks.length === 0 && (
              <tr><td colSpan="5" className="p-4 text-center text-gray-500">No tasks found for this filter.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TasksPage;