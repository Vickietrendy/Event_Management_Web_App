const express=require('express')
const router=express.Router()
const Alumni=require('../models/alumni')
const Event=require('../models/event')
const { alumniManagerOnly } = require('../middleware/auth');

// all alumni
router.get('/', alumniManagerOnly, async (req,res)=>{
    let searchOptions={}
    if(req.query.name!=null && req.query.name!==''){
searchOptions.name=new RegExp(req.query.name,'i')
    }
    try{

const alumni=await Alumni.find(searchOptions)
res.render('alumni/index',{alumni:alumni, searchOptions:req.query})
}catch{
    res.redirect('/');
}
    
})
// new alumni
router.get('/new',alumniManagerOnly, (req,res)=>{
    res.render('alumni/new',{alumni: new Alumni()})
})
//create new alumni
router.post('/',async (req,res)=>{
    const alumni=new Alumni({
        name: req.body.name,
        city: req.body.city,
        admissionNumber: req.body.admissionNumber,
        classYear: req.body.classYear
    })
   try{
    const newAlumni=await alumni.save();
    res.redirect('alumni')
   }
   catch{
    res.render('alumni/new',{
        alumni:alumni,
        errorMessage: 'Error creating alumni'
    })

   }
   }) 
router.get('/:id', alumniManagerOnly, async(req,res)=>{
try{
const alumni=await Alumni.findById(req.params.id)
const events=await Event.find({alumni: alumni.id}).limit(3).exec()
res.render('alumni/show',{
        alumni:alumni,
        eventsByAlumni:events
    })
    }
    catch(err){
       // console.log(err)
        res.redirect('/')
    }
})
router.get('/:id/edit', alumniManagerOnly, async (req,res)=>{
    const alumni= await Alumni.findById(req.params.id)
    try{
        res.render('alumni/edit',{alumni: alumni})
    }
    catch{
        res.redirect('/alumni')
    }
})

router.get('/:id/delete', alumniManagerOnly, async (req,res)=>{
    const alumni= await Alumni.findById(req.params.id)
    try{
        res.render('alumni/delete',{alumni: alumni})
    }
    catch{
        res.redirect('/alumni')
    }
})

router.put('/:id', alumniManagerOnly, async (req,res)=>{
   let alumni
   try{
    alumni=await Alumni.findById(req.params.id);
    alumni.name=req.body.name;
    alumni.city=req.body.city;
    await alumni.save()
    res.redirect(`/alumni/${alumni.id}`)
   }
   catch{
    if(alumni==null){
        res.redirect('/')
    }
    else{
    res.render('alumni/edit',{
        alumni:alumni,
        errorMessage: 'Error updating alumni'
    })
}

   }
   
})
router.delete('/:id/delete',alumniManagerOnly, async (req,res)=>{
let alumni
   try{
    alumni=await Alumni.findById(req.params.id)
    await alumni.deleteOne()
    res.redirect('/alumni')
   }
   catch(err){
    if(err)
    console.error(err)
    if(alumni==null){
        res.redirect('/')
    }
    else{
    res.redirect(`/alumni/${alumni.id}`)
}

   }
})

module.exports=router;
