const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jsonwt = require('jsonwebtoken');
const passport = require('passport');
const key = require('../../setup/myurl');

//@type    GET
//@route   /api/auth
//@desc    just for testing 
//@access  PUBLIC
router.get('/',(req,res) => res.json({test:"Auth is Success"}));

//import schema for person to Register
const Person = require('../../models/Person');

//@type    POST
//@route   /api/auth/register
//@desc    route for registration of users 
//@access  PUBLIC
router.post('/register',(req,res) => {
    Person.findOne({email: req.body.email})
        .then(person => {
            if(person){
                return res
                .status(400)
                .json({emailerror:'Email is already registerd'});
            }else{
                const newPerson = new Person({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                });
                //Encrypt password using bcrypt               
               bcrypt.genSalt(10, (err, salt) => {
               bcrypt.hash(newPerson.password, salt, (err, hash) => {
                  if(err) throw err;
                  newPerson.password = hash;
                  newPerson
                   .save()
                   .then(person => res.json(person))
                   .catch(err => console.log(err));
    });
});
            }
        })
        .catch(err => console.log(err));
});

//@type    POST
//@route   /api/auth/login
//@desc    route for login  of users 
//@access  PUBLIC
router.post('/login',(req,res) => {
     const email = req.body.email;
     const password = req.body.password;

     Person.findOne({email})
     .then( person => {
         if(!person){
             return res.status(400).json({emailerror : 'Email is not Registered'});
         }
         bcrypt.compare(password, person.password)
         .then(isCorrect => {
             if(isCorrect){
                 res.json({Success : 'User is able to login successfully'})
             }else {
                 res.status(400).json({pssworderror: 'Password is not Correct'})
             }
         })
         .catch(err => console.log(err));
     })
     .catch(err => console.log(err));
});

module.exports = router; 