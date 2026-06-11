const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const router = express.Router();


router.post("/register", async(req,res)=>{

    try{

        const {name,email,password} = req.body;

        let user = await User.findOne({email});

        if(user){
            return res.status(400).json({
                message:"User already exists"
            });
        }

        const hashedPassword =
        await bcrypt.hash(password,10);

        user = new User({
            name,
            email,
            password:hashedPassword
        });

        await user.save();

        res.json({
            message:"Registration Successful"
        });

    }catch(err){
        res.status(500).json(err);
    }

});


router.post("/login", async(req,res)=>{

    try{

        const {email,password}=req.body;

        const user =
        await User.findOne({email});

        if(!user){
            return res.status(400).json({
                message:"User not found"
            });
        }

        const valid =
        await bcrypt.compare(
            password,
            user.password
        );

        if(!valid){
            return res.status(400).json({
                message:"Invalid Password"
            });
        }

        const token = jwt.sign(
            {id:user._id},
            process.env.JWT_SECRET
        );

        res.json({
            token
        });

    }catch(err){
        res.status(500).json(err);
    }

});

module.exports = router;