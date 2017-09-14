const express = require("express");
const router = express.Router();
const db = require("../models");

// GET request to find all Public Domains 

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

// POST request to create a Domain - either public or private

router.post('/', function(req, res){
  // let isPublic  = req.body.isPublic;
  // let apps = {};
  // let user_id = req.body.user_id || "This domain is available to all users";

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


// GET request to retrieve a specific Public Domain



module.exports = router;
