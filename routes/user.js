const express = require("express");
const router = express.Router();
const db = require("../models");

// GET request to retrieve all Users

router.get('/', function(req,res){
  db.User.findAll()
  .then(function(users){
    res.send(users)
  })
  .catch(function(err){
    res.status(500).send(err)
  });
});


// GET request to retrieve a specific User

router.get('/:user_id', function(req, res) {
  db.User.findById(req.params.user_id)
  .then(function(user){
    if(user)res.send(user);
    else res.status(500).send({
      error:'Could not find a User in the database with that id'
    })
  })
  // .catch(function(err){
  //   res.status(500).send('Could not find a user with that id');
  // });
});

// POST request to create a new User

router.post('/', function(req,res){
  db.User.create({
    name: req.body.name, 
    email: req.body.email
  })
  .then(function(user){
    res.status(201).send(user)
  })
  .catch(function(err){
    res.status(400).send(err)
  })
})

// PATCH request to update a specific User

router.patch('/:user_id', (req, res) => {
  const user_id = req.params.user_id;
  const updates = req.body.updates;
  db.User.findById(user_id)
  .then(foundUser => {
    return foundUser.updateAttributes(updates)
  })
  .then(updatedUser => {
    res.json({
      successfulUpdate: true, 
      updatedUser
    });
  })
  .catch((err) => res.status(500).send({
    successfulUpdate: false,
    err
  }))
});

// DELETE request to delete a single User

router.delete('/:user_id', (req, res) => {
  const user_id= req.params.user_id;
  db.User.findById(user_id)
  .then(foundUser => {
    return foundUser.destroy();
  })
  .then(() => res.status(200).send({
      'message': 'User was successfully deleted'
    })
  )
  .catch((err) => res.status(404).send({
      'message': `Could not delete User with id: ${user_id}`,
    })
  )
})
 

module.exports = router;


