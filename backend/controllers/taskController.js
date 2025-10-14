const Task = require('../models/Task');

// GET all tasks
exports.getAllTasks = async (req, res) => {
    try {
        // Add .populate() to replace the agent's ID with their name
        const tasks = await Task.find().populate('assignedTo', 'name');
        res.json(tasks);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

// DELETE all tasks
exports.resetAllTasks = async (req, res) => {
    try {
        await Task.deleteMany({});
        res.json({ message: 'All tasks have been deleted.' });
    } catch (error){
        console.error("Error resetting tasks:", error);
        res.status(500).json({ message: 'Server error' });
    }
}

exports.updateTaskStatus = async (req, res) => {
    try {
        const { status } = req.body;
        // Validate the incoming status
        if (status !== 'active' && status !== 'completed') {
            return res.status(400).json({ message: 'Invalid status provided.' });
        }

        const task = await Task.findByIdAndUpdate(
            req.params.id, 
            { status }, 
            { new: true } // This option ensures the updated document is returned
        ).populate('assignedTo', 'name'); // Also populate the agent name in the response

        if (!task) {
            return res.status(404).json({ message: 'Task not found.' });
        }
        res.json(task);
    } catch (error) {
        console.error("Error updating task status:", error);
        res.status(500).json({ message: 'Server error' });
    }
};