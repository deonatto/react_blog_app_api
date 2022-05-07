const router = require('express').Router(); 
const User = require("../models/User");
const bcrypt = require('bcryptjs');

//REGISTER
router.post('/register', async(req,res)=>{
    try{
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(req.body.password, salt);
        // create new user with data from request body
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });
        // save user on DB
        const user = await newUser.save();
        res.status(200).json(user);
    }catch(err){
        res.status(500).json(err);
    }
})

//LOGIN
router.post('/login', async(req,res)=>{
    try{
        const user = await User.findOne({username:req.body.username});
        if(user){
            const validated = bcrypt.compareSync(req.body.password, user.password);
            if(validated){
                //destructuring user object to avoid sending password in response
                const {password, ...rest} = user._doc;
                res.status(200).json(rest);
            }else{
                res.status(400).json('Invalid Credentials');
            }

        }else{
            res.status(400).json('Invalid Credentials');
        }
    }catch(err){
        res.status(500).json(err);
    }
})

module.exports = router;