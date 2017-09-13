const express = require("express");
const router = express.Router({mergeParams: true});
const db = require("../models");

const createApplication = require('./helpers').createApplication

const createDomain = require('./helpers').createDomain
const getLinkedDomains = require('./helpers').getLinkedDomains
const linkApplicationsToDomains = require('./helpers').linkApplicationsToDomains
const findLinkedDomains = require('./helpers').findLinkedDomains
const loadDomains = require('./helpers').loadDomains



// GET request to access all applications for a user

router.get('/', function(req,res){
  db.Application.findAll({
    where: {
      user_id: req.params.user_id
    }
  })
  .then(function(applications){
    res.send(applications)
  })
  .catch(function(err){
    res.status(500).send(err)
  })
})


// GET a specific application 

router.get('/:application_id', function(req,res){
  db.Application.findById(req.params.application_id)
  .then(function(foundApplication){
    res.send(foundApplication)
  })
  .catch(function(err){
    res.status(500).send(err)
  })
})

// POST to create an Application 
  // this will also associate Application with a User and Domain(s) 

    //find user
    //create application using req body
    // create domains 
    // link created application to domain
    // return application that shows the associated domains

    // Tobi write tests for these steps!

router.post('/', function(req,res){
  let user_id = req.params.user_id;
  let domainInfo = req.body.domains;
  let foundUser = null;
  let newApplication = null;

  db.User.findById(user_id)
  .then((user) => {
    foundUser = user;
  })
  .then( () => {
    return createApplication(req.body.name, req.body.description, foundUser.dataValues.user_id)
  })
  .then((application) => {
    for(var i=0; i< domainInfo.length; i++){
      createDomain(domainInfo[i].domainName, domainInfo[i].domainIsPublic, user_id)
    }
    return application;
  })
  .then((application) => {
    return linkApplicationsToDomains(application, domainInfo)
    // loadDomains()

    // return application;
  })
  .then((application) => res.send(application))
    
  .catch((error) => {
    res.status(500).send({ 
      error,
      message: 'Something went wrong. Yikes'
    })
  })
})
   


module.exports = router;
