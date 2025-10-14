const Admin=require('../models/Admin')
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');

exports.registerAdmin=async(req,res)=>{
    const{email,password}=req.body;
    try{
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);

        const newAdmin=new Admin({
            email,
            password:hashedPassword

        });
    await newAdmin.save();
    res.status(201).json({message:'Admin registered successfully'});
}
    catch(error){
        res.status(500).json({message:'Server error',error:error.message});
    }
}


exports.loginAdmin=async(req,res)=>{
    const{email,password}=req.body;
    try{
        const admin= await Admin.findOne({email});
        if(!admin){
            return res.status(400).json({message:'Invalid credentials'});
        }
        const isMatch=await bcrypt.compare(password,admin.password);
    
     if(!isMatch){
            return res.status(400).json({message:'Invalid credentials'});
        }
        const payload={id:admin.id,email:admin.email};
        const token=jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:'24h'});
        res.json({token});
    }
    catch(error){
        res.status(500).json({message:'Server error',error:error.message});
    }
}