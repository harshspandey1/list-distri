const express= require('express')
const router=express.Router();
const {loginAdmin}=require('../controllers/authController');
const {registerAdmin}=require('../controllers/authController');

router.post('/register',registerAdmin);
router.post('/login',loginAdmin);

module.exports=router;