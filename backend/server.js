//Imports
const express=require('express')
const mongoose=require('mongoose')
const dotenv=require('dotenv')
const cors=require('cors')
//Import Routes
const authRoutes=require('./routes/authRoutes')
const agentRoutes=require('./routes/agentRoutes')
const listRoutes=require('./routes/listRoutes')
const dashboardRoutes=require('./routes/dashboardRoutes') 
const taskRoutes = require('./routes/taskRoutes'); 

//Config
dotenv.config();
const app=express();
const PORT=process.env.PORT||5001;

//Database Connection
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log('MongoDB connected'))
.catch((err)=>console.error('MongoDB connection error',err));

//Middlewares
app.use(cors());
app.use(express.json());   

//Route Middlewares
app.use('/api/auth',authRoutes);
app.use('/api/agents',agentRoutes);
app.use('/api/lists',listRoutes);
app.use('/api/dashboard',dashboardRoutes);
app.use('/api/tasks', taskRoutes);


//Start Server
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
})

//Exports
module.exports=app;