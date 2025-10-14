const express=require('express')
const router=express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { createAgent, getAgents, deleteAgent } = require('../controllers/agentController');


router.post('/',authMiddleware,createAgent);
router.get('/',authMiddleware,getAgents);
router.delete('/:id', authMiddleware, deleteAgent);

module.exports=router;