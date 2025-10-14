const Papa = require('papaparse');
const Agent = require('../models/Agent');
const Task = require('../models/Task');

exports.uploadAndDistribute = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }

    try {
        //  Get up to 5 agents to distribute tasks to
        const agents = await Agent.find().limit(5);
        if (agents.length < 1) { // We need at least one agent
            return res.status(400).json({ message: 'No agents found to distribute tasks.' });
        }

        const csvData = req.file.buffer.toString('utf-8');
        const parsed = Papa.parse(csvData, { header: true, skipEmptyLines: true });

        //  Validate CSV headers (case-insensitive)
        const headers = parsed.meta.fields.map(h => h.trim().toLowerCase());
        if (!headers.includes('firstname') || !headers.includes('phone')) {
            return res.status(400).json({ message: 'CSV must contain "FirstName" and "Phone" columns.' });
        }

        const tasksToSave = [];
        const distributionSummary = {}; // To count tasks per agent

        // Loop through CSV rows and prepare tasks
        parsed.data.forEach((task, index) => {
            // Use original headers to access data, e.g., task.FirstName
            const firstName = task.FirstName || task.firstname;
            const phone = task.Phone || task.phone;

            if (firstName && phone) {
                const assignedAgent = agents[index % agents.length];
                tasksToSave.push({
                    firstName: firstName,
                    phone: phone,
                    notes: task.Notes || task.notes || '',
                    assignedTo: assignedAgent._id
                });
                // Tally the count for the summary
                distributionSummary[assignedAgent.id] = (distributionSummary[assignedAgent.id] || 0) + 1;
            }
        });

        //  Insert all tasks into the database in one operation
        if (tasksToSave.length > 0) {
            await Task.insertMany(tasksToSave);
        }

        // Format the summary to send back to the frontend
        const distribution = agents.map(agent => ({
            agentId: agent.id,
            agentName: agent.name,
            count: distributionSummary[agent.id] || 0
        }));

        res.status(200).json({ message: 'List processed successfully.', distribution });

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: 'Error processing file' });
    }
};