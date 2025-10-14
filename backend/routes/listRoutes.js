const express=require('express');
const router=express.Router();
const multer=require('multer');
const authMiddleware=require('../middleware/authMiddleware');
const { uploadAndDistribute } = require('../controllers/listController');

//Multer setup for file uploads&validation
const upload=multer({
    fileFilter:(req,file,cb)=>{
        if(file.mimetype==='text/csv'||file.mimetype==='application/vnd.ms-excel'||file.mimetype==='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
            cb(null,true);
    }
    else{
        cb(new Error('Only CSV and Excel files are allowed'),false);
    }
}
})

router.post('/upload',authMiddleware,upload.single('list'),uploadAndDistribute);

module.exports=router;
