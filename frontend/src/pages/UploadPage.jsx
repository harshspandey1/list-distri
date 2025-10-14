import React, { useState } from "react";
import api from "../utils/api";

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  // 1. Changed this back to a simple state
  const [summary, setSummary] = useState(null);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file");
      return;
    }
    const formData = new FormData();
    formData.append("list", file);

    try {
      setMessage("Uploading...");
      setSummary(null); // Clear previous summary
      const res = await api.post("/lists/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      setSummary(res.data);
      // 2. Removed the localStorage.setItem line
      
      setMessage("Uploaded and distributed successfully");
    } catch (err) {
      console.error(err);
      setMessage(err?.response?.data?.message || "Upload failed");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Upload CSV/XLSX</h1>
      <div className="bg-white p-6 rounded shadow mb-4">
        <input type="file" accept=".csv,.xls,.xlsx" onChange={handleFileChange} />
        <div className="mt-4">
          <button onClick={handleUpload} className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600">Upload & Distribute</button>
        </div>
        {message && <p className="mt-3 text-sm">{message}</p>}
      </div>

      {summary && (
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Distribution Summary</h3>
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left">Agent Name</th>
                <th className="p-2 text-left">Items Assigned</th>
              </tr>
            </thead>
            <tbody>
              {summary.distribution?.map(item => (
                <tr key={item.agentId} className="border-b">
                  <td className="p-2">{item.agentName}</td>
                  <td className="p-2">{item.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UploadPage;