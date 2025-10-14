const express = require('express');
const router = express.Router();
const Agent = require('../models/Agent');
const Task = require('../models/Task');
const authMiddleware = require('../middleware/authMiddleware'); //  Import middleware

// Protect all routes in this file
router.use(authMiddleware);

// GET /api/dashboard/stats
router.get('/stats', async (req, res) => {
    try {
        const totalAgents = await Agent.countDocuments();
        const totalTasks = await Task.countDocuments();
        const activeTasks = await Task.countDocuments({ status: 'active' });
        const completedTasks = await Task.countDocuments({ status: 'completed' });
        const lastUpload = await Task.findOne().sort({ createdAt: -1 });

        res.json({
            totalAgents,
            totalTasks,
            activeTasks,
            completedTasks,
            lastUploadDate: lastUpload ? lastUpload.createdAt : 'N/A'
        });
    } catch (error) {
        // Log the actual error on the server for debugging
        console.error("Error fetching dashboard stats:", error); 
        res.status(500).json({ message: 'Server error fetching stats.' });
    }
});

module.exports = router;