const express = require("express");
const Task = require("../models/Task");
const auth = require("../middleware/auth");

const router = express.Router();router.post("/", auth, async(req,res)=>{

    try{

        const task = new Task({

            title:req.body.title,
            description:req.body.description,
            dueDate:req.body.dueDate,
            userId:req.user.id

        });

        await task.save();

        res.json(task);

    }catch(err){
        res.status(500).json(err);
    }

});

router.get("/", auth, async(req,res)=>{

    try{

        const tasks =
        await Task.find({
            userId:req.user.id
        });

        res.json(tasks);

    }catch(err){
        res.status(500).json(err);
    }

});

router.put("/:id", auth, async(req,res)=>{

    try{

        const task =
        await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        );

        res.json(task);

    }catch(err){
        res.status(500).json(err);
    }

});


router.delete("/:id", auth, async(req,res)=>{

    try{

        await Task.findByIdAndDelete(
            req.params.id
        );

        res.json({
            message:"Task Deleted"
        });

    }catch(err){
        res.status(500).json(err);
    }

});

module.exports = router;