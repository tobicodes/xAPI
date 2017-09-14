const express = require("express");
const router = express.Router({mergeParams: true});
const db = require("../models");

const createApplication = require('./helpers').createApplication
const findAssociatedDomains = require('./helpers').findAssociatedDomains

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


// GET a specific Application 

router.get('/:application_id', function(req,res){
  db.Application.findById(req.params.application_id)
  .then(function(foundApplication){
    res.send(foundApplication)
  })
  .catch(function(err){
    res.status(404).send({
      err,
      'message': `Could not find an Application with id: ${req.params.application_id}`})
  })
})

// POST to create an Application 
  // this will also associate Application with a User and Domain(s) 

router.post('/', async function(req,res){

  let user_id = req.params.user_id;
  let domainInfo = req.body.domains;
  let application_id = null;
  let domains = [];

  try {
    let foundUser = await db.User.findById(user_id)
    let application = await createApplication(req.body.name, req.body.description, foundUser.dataValues.user_id)
    application_id = application.dataValues.application_id
    for(var i=0; i< domainInfo.length; i++){
      createDomain(domainInfo[i].domainName, domainInfo[i].domainIsPublic, user_id, application)
    }
    
    let linkedApps = await linkApplicationsToDomains(application, application_id, domainInfo)
    
    res.send(
      {
        'Application': application,
        'Associated Domains': linkedApps.associatedDomains
      })  
  } 
  catch(err){
    res.status(500).send({ 
      err,
      message: 'Unable to create Application and Domains given input params'
    })
  }
})

// PATCH request to update applications as well as associated domains

router.patch('/:application_id', async function(req, res){
  let application_id = req.params.application_id
  let applicationUpdates = req.body.applicationUpdates;
  let domain_ids = req.body.domain_ids
  let domainUpdates = req.body.domainUpdates

  try {
    let application = await db.Application.findById(application_id)
    await application.updateAttributes(applicationUpdates)
    let domainsToBeUpdated = await db.Domain.findAll({where: {domain_id: {$in:  domain_ids}}})
    for(var i=0 ; i< domainsToBeUpdated.length; i++ ){
      await domainsToBeUpdated[i]. updateAttributes(domainUpdates[i])
    }

    res.send({
      successfulUpdate: true,
      application
    })
  }

  catch (err){
    return{
      err,
      successfulUpdate: false
    }
  }

})

// DELETE to delete a specific Application

router.delete('/:application_id', function(req, res){
  const application_id = req.params.application_id

  db.Application.findById(application_id)
  .then(foundApplication => {
    return foundApplication.destroy();
  })
  .then(() => res.status(200).send({
    'message': 'Application was successfully deleted'
  }))
  .catch((err) => res.status(404).send({
    'message': `Could not delete Application with id: ${application_id}`
  }))
  
})

// let associatedDomains = await application.getDomains()

module.exports = router;
