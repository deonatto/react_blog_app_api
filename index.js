const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoute = require('./routes/auth');
dotenv.config();

// allow json object inside body
app.use(express.json());
mongoose.connect(process.env.MONGO_URL)
    .then(
        console.log('connected to DB')
    ).catch(err=>{
        console.log(err);
    });

app.use('/api/auth', authRoute);
app.listen('5000', ()=>{
    console.log('backend running');
});

