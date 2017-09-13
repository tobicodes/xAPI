const express = require("express");
const router = express.Router();
const db = require("../models");

// GET request to find all public Domains 

router.get('/', function(req, res){
  db.Domain.findAll({
    where: {
      isPublic: true,
    }
  })
  .then(function(domains){
    res.send(domains)
  })
  .catch(function(error){
    res.status(500).send(error)
  })
})

// POST request to create a domain - either public or private

router.post('/', function(req, res){
  let isPublic  = req.body.isPublic;
  let apps = {};
  let user_id = req.body.user_id || "This domain is available to all users";

  // if(!isPublic){
  //    //add domain id to all applications

  //    // create Domain and note the user_id for this domain

      
  // }else{
  //    //add domain id to one application
  // }


  db.Domain.create({
    name: req.body.name,
    isPublic: req.body.isPublic,
    user_id: req.body.user_id
  })
  .then(function(domain){
    res.status(201).send(domain)
  })
  .catch(function(error){
    res.status(500).send(error)
  })
})



// GET request to get all private domains for a given User

  // function that gets user id for a particular domain

  // first get the application_id from the ApplicationDomains join table
  // then find that application from the Applications table

  // then find the user whose user id links to that application

  // then find all private doma

// router.get('/', function(req, res){
//   db.Domain.findAll({
//     where: {
//       isPublic: false,
//     }
//   })
//   .then(function(domains){
//     res.send(domains)
//   })
//   .catch(function(error){
//     res.status(500).send(error)
//   })
// })


module.exports = router;
