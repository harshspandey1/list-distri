const Agent =require('../models/Agent')
const bcrypt=require('bcryptjs')

 exports.createAgent= async (req,res)=>{
    const {name,email,mobileNumber,password}=req.body;
    try{
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);

        const newAgent=new Agent({
            name,
            email,
            mobileNumber,
            password:hashedPassword
        });
        await newAgent.save();
        res.status(201).json(newAgent);  
    }
    catch(error){   
        res.status(500).json({message:'Server error',error:error.message});
    }
 }

    exports.getAgents=async(req,res)=>{
        try{
            const agents=await Agent.find().select('-password');
            res.json(agents);
        }
        catch (error) {
        console.error('Error fetching agents:', error);
        res.status(500).json({ message: 'Failed to fetch agents.' });
    }
    }

    exports.deleteAgent = async (req, res) => {
    try {
        const agent = await Agent.findById(req.params.id);

        if (!agent) {
            return res.status(404).json({ message: 'Agent not found' });
        }

        await Agent.findByIdAndDelete(req.params.id);

        res.json({ message: 'Agent removed successfully' });
    } catch (error) {
        console.error('Error deleting agent:', error);
        res.status(500).json({ message: 'Server error' });
    }
};