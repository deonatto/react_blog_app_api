const router = require('express').Router(); 
const User = require('../models/User');
const Post = require('../models/Post');
const bcrypt = require('bcryptjs');

//CREATE 
router.post('/', async(req,res)=>{
    const newPost = new Post(req.body);
    try{
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    }catch(err){
        res.status(500).json(err);
    }
})

//UPDATE
router.put('/:id', async(req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        if(post.user_id === req.body.user_id){
            const updatePost = await Post.findByIdAndUpdate(req.params.id,{
                $set: req.body
            },{new:true});
            res.status(200).json(updatePost);
        }else{
            res.status(404).json('You can update only your post!');
        }

    }catch(err){
        res.status(500).json(err);
    }
})

//DELETE
router.delete('/:id', async(req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        if(post.user_id === req.body.username_id){
            await Post.findByIdAndDelete(req.params.id);
            res.status(200).json('Post has been deleted');
        }else{
            res.status(404).json('You can delete only your post!');
        }

    }catch(err){
        res.status(500).json(err);
    }
})

//GET POST
router.get('/:id', async(req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    }catch(err){
        res.status(500).json(err);
    }
})

// GET ALL POSTS
router.get('/', async(req,res)=>{
    console.log(req.query.user_id);
    console.log(req.query.cat);
    const user_id = req.query.user_id;
    const cat = req.query.cat;
    try{
        let posts; 
        if(user_id){
            posts = await Post.find({user_id})
        }else if(cat){
            posts = await Post.find({categories:{
                $in:[cat]
            }})
        }else{
            posts = await Post.find();
        }
        res.status(200).json(posts);
    }catch(err){
        res.status(500).json(err);
    }
})
module.exports = router;