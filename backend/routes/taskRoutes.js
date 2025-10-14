const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getAllTasks, resetAllTasks, updateTaskStatus } = require('../controllers/taskController');


// GET /api/tasks/
router.get('/', authMiddleware, getAllTasks);

// DELETE /api/tasks/all
router.delete('/all', authMiddleware, resetAllTasks);

// PATCH /api/tasks/:id/status
router.patch('/:id/status', authMiddleware, updateTaskStatus);


module.exports = router;