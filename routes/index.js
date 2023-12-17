const express=require('express')
const Event=require("../models/event")
const router=express.Router()
router.get('/',async(req,res)=>{
    let events
    try{
        events=await Event.find().sort({createdAt:'desc'}).limit(2).exec()


    }catch{
        events=[]

    }
    res.render('index',{events:events})
})
module.exports=router;

