const express = require('express');
const mongoose = require('mongoose');
 const bodyparser = require('body-parser');
 const passport = require('passport');

const app = express();

//middleware for bodyparser
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

//bring all routes
const auth = require("./routes/api/auth");
const profile = require("./routes/api/profile");
const question = require("./routes/api/question");

var port = process.env.PORT || 3000;

//mongoDB configuration
const db = require('./setup/myurl').mongoURL;

//Attempt to connect to database

mongoose
    .connect(db)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.log(err));

//passport middleware
app.use(passport.initialize());

//config for jwt strategy
require('./strategies/jsonwtStrategy')(passport);

//@route    -   GET /
//@desc    -   route to home page
//@access   -   PUBLIC

//just for testing -> route
app.get('/',(req,res) => {
    res.send("<h1>Home page</h1>");
});

//actual routes
app.use('/api/auth',auth);
app.use('/api/profile',profile);
app.use('/api/question',question);

app.listen(port,() => console.log(`Server is starting at port : ${port}`));
