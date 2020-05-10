const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');

//Load Person Model
const Person = require('../../models/Person');

//Load Profile Model
const Profile = require('../../models/Profile');

//Load Question Model
const Question = require('../../models/Question');

//@type    GET
//@route   /api/question
//@desc    route to a question
//@access  PUBLIC

router.get('/', (req,res) => {
    Question.find()
    .sort({date: "desc"})
    .then(question => {
        if(!question){
             res.status(404).json({questionNotFound: 'Question not found'});
        }     
        res.json(question);
    })
    .catch(err => console.log('err in finding Question for particular user' + err));
});

//@type    POST
//@route   /api/question
//@desc    route to post a  question
//@access  PRIVATE

router.post('/',passport.authenticate('jwt',{session: false}),(req,res) => {
    const newQuestion = new Question({
        text1: req.body.text1,
        text2: req.body.text2,
        user: req.user.id,
        username: req.user.username
    });
    newQuestion
    .save()
    .then(question => res.json(question))
    .catch(err => console.log('UNABLE to push question to database' + err));

})

//@type    POST
//@route   /api/question/answer/:id
//@desc    route to post a answer
//@access  PRIVATE

router.post('/answer/:id',passport.authenticate('jwt',{session: false}), (req,res) => {
    Question.findById(req.params.id)
    .then( question => {
        const newAnswer = {
            user: req.user.id,
            username: req.user.username,
            text: req.body.text
        };

        question.answers.unshift(newAnswer);

        question
        .save()
        .then(question => res.json(question))
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
})

//@type    POST
//@route   /api/question/answer/upvote/:id
//@desc    route to post a answer
//@access  PRIVATE

router.post('/upvote/:id',passport.authenticate('jwt',{session: false}), (req,res) => {
    Profile.findOne({user: req.user.id})
    .then(profile => {
        Question.findById(req.params.id)
        .then(question => {
            if(question.upvotes.filter(upvote => upvote.user.toString() === req.user.id.toString()).length > 0) {
                return res.status(400).json({noupvote: "User already Upvoted"})
            }
            question.upvotes.unshift({user: req.user.id});
            question
            .save()
            .then(question => res.json(question))
            .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
})

module.exports = router;