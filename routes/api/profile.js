const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//Load Person Model
const Person = require('../../models/Person');

//Load profile Model
const Profile = require('../../models/Profile');

//@type    GET
//@route   /api/profile
//@desc    route for personal user profile 
//@access  PRIVATE


router.get(
    '/',
    passport.authenticate('jwt',{session: false}),
     (req,res) => {
        Profile.findOne({ user: req.user.id})
        .then(profile => {
            if(!profile){
                return res.status(404).json({profilenotfound: 'No profile found'})
            }
            res.json(profile);
        })
        .catch(err => console.log('got some error in profile' + err));
})

//@type    POST
//@route   /api/profile
//@desc    route for UPDATING/SAVING personal user profile 
//@access  PRIVATE

router.post('/',
  passport.authenticate('jwt',{session: false}),
  (req,res) => {
     const profileValues = {};
     profileValues.user = req.user.id;
     if(req.body.username) profileValues.username = req.body.username;
     if(req.body.website) profileValues.website = req.body.website;
     if(req.body.country) profileValues.country = req.body.country;
     if(req.body.portfolio) profileValues.portfolio = req.body.portfolio;
     if(typeof req.body.languages !== undefined){
         profileValues.languages = req.body.languages.split(',');
     }
     profileValues.social = {};
     if(req.body.youtube) profileValues.social.youtube = req.body.youtube;
     if(req.body.facebook) profileValues.social.facebook = req.body.facebook;
     if(req.body.instagram) profileValues.social.instagram = req.body.instagram;

     //Do database stuff
     Profile.findOne({user: req.user.id})
        .then( profile => {
            if(profile){
                Profile.findOneAndUpdate(
                    {user: req.user.id},
                    {$set: profileValues},
                    {new: true}
                ).then(profile => res.json(profile))
                .catch(err => console.log('problem in update' + err));
            }else{
                Profile.findOne({username: profileValues.username})
                .then(profile => {
                    //username already exists
                    if(profile){
                        res.status(400).json({username: 'Username already exists'})
                    }
                    //save user
                    new Profile(profileValues)
                     .save()
                     .then(profile => res.json(profile))
                     .catch(err => console.log('Problem in saving profile' + err));
                })
                .catch(err => console.log('problem in not getting profile' + err));
            }
        })
        .catch(err => console.log('Problem in fetching profile' + err));
  }
);


module.exports = router;