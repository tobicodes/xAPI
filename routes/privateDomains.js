const express = require("express");
const router = express.Router({mergeParams: true});
const db = require("../models");

// GET request to retrieve all private Domains for a given User

router.get('/', function(req, res){

  const user_id = req.params.user_id;
  db.Domain.findAll({
    where: {
      isPublic: false,
      user_id: user_id
    }
  })
  .then(function(privateDomains){
    res.send(privateDomains)
  })
  .catch(function(error){
    res.status(404).send(error)
  })
})

// GET request to retrieve a specific Private Domain

router.get('/:privateDomain_id', function(req,res){
  const privateDomain_id  = req.params.privateDomain_id;

  db.Domain.findById(privateDomain_id)
  .then(function(privateDomain){
    res.send(privateDomain)
  })
  .catch(function(error){
    res.status(404).send(error)
  })
})


module.exports = router;


