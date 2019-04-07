const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const router = express.Router();
const {ensureAuthenticated} = require('../helpers/auth');

// Load Idea Model
require('../models/Idea');
const Idea = mongoose.model('ideas');

router.get('/ab', (req,res) => {
    console.log(req.user);
})
// Idea Index Page
router.get('/',passport.authenticate('jwt', { session: false }), (req, res) => {
  Idea.find({user: req.user.id})
    .sort({date:'desc'})
    .then(ideas => {
      res.render('ideas/index', {
        ideas:ideas
      });
    });
});

// Add Idea Form
router.get('/add', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.render('ideas/add');
});

// Edit Idea Form
router.get('/edit/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
  .then(idea => {
    if(idea.user != req.user.id){
      req.flash('error_msg', 'Not Authorized');
      res.redirect('/ideas');
    } else {
      res.render('ideas/edit', {
        idea:idea
      });
    }
    
  });
});

// Process Form
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  let errors = [];

  if(!req.body.title){
    errors.push({text:'Please add a title'});
  }
  if(!req.body.details){
    errors.push({text:'Please add some details'});
  }

  if(errors.length > 0){
    res.render('/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details,
      user: req.user.id
    }
    new Idea(newUser)
      .save()
      .then(idea => {
        req.flash('success_msg', 'idea added');
        res.redirect('/ideas');
      })
  }
});

// Edit Form process
router.put('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
  .then(idea => {
    // new values
    idea.title = req.body.title;
    idea.details = req.body.details;

    idea.save()
      .then(idea => {
        req.flash('success_msg', 'idea updated');
        res.redirect('/ideas');
      })
  });
});

// Delete Idea
router.delete('/:id',passport.authenticate('jwt', { session: false }), (req, res) => {
  Idea.remove({_id: req.params.id})
    .then(() => {
      req.flash('success_msg', 'idea removed');
      res.redirect('/ideas');
    });
});

module.exports = router;