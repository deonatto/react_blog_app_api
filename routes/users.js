const router = require('express').Router(); 
const User = require('../models/User');
const Posts = require('../models/Post');
const bcrypt = require('bcryptjs');

//UPDATE
router.put('/:id', async(req,res)=>{
    if(req.body.userId === req.params.id){
        if(req.body.password){
            const salt = bcrypt.genSaltSync(10);
            req.body.password = bcrypt.hashSync(req.body.password, salt);
        }
        try{
            const updatedUser = await User.findByIdAndUpdate(req.params.id,{
                $set: req.body
            },{new:true});
            res.status(200).json(updatedUser);
        }catch(err){
            res.status(500).json(err);
        }
    }else{
        res.status(401).json('You can update only your account');
    }
})

//DELETE
router.delete('/:id', async(req,res)=>{
    if(req.body.userId === req.params.id){
        try{
            await Posts.deleteMany({username_id: req.params.id})
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json("User has been deleted");
        }catch(err){
            res.status(500).json(err);
        }
    }else{
        res.status(401).json('You can delete only your account');
    }
})

//GET USER
router.get('/:id', async(req,res)=>{
    try{
        const user = await User.findById(req.params.id);
        const {password, ...rest} = user._doc;
        res.status(200).json(rest);
    }catch(err){
        res.status(500).json(err);
    }
})

module.exports = router;