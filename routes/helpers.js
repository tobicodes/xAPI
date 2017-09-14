const db = require("../models");

// method to create a new Application Instance
function createApplication(name, description, user_id){
  return db.Application.create({
    name: name,
    description: description,
    user_id: user_id
  })
  .then(application => {
    return application
  })
  .catch((error) => {
    return {
      error,
      message: 'Could not create Application with given inputs'
    }
  })
}


// method to create a Domain instance 
function createDomain(domainName, domainIsPublic, userId){

  return db.Domain.create({
    name: domainName,
    isPublic: domainIsPublic,
    user_id: userId
  })
  .then(function(domain){
    return domain
  })
  .catch(function(error){
    return {
      error, 
      message: 'Could not create a Domain with the input params'
    }
  })
}

// method to link a Application instance with x number of  domains 
// Tobi think about Public vs private domains



function getLinkedDomains(application){
  application.getDomains()
  .then((domains) => {
    console.log("Ronaldo", domains)
  })
  .catch(console.error)
}

// method to find Domain instances that are linked to a given Application


function findLinkedDomains(application){
  db.ApplicationDomains.find({
    where: {
      application_id: application.dataValues.application_id
    }
  })
  .then((domains) => {
    console.log("wizkid", domains)
  })
  .catch((error) => {
    console.log(error, "No domains outchea")
  })
}

function loadDomains(){
  db.Application.findAll({
    include: [{
      model: db.Domain,
      through: db.ApplicationDomains
    }]
  })
  .then(applications => console.log("Ribery",applications))
  .catch(console.error)
}

async function linkApplicationsToDomains(application, application_id, domains){
  let domainNames = [];

  for (var i=0; i < domains.length; i++){
    domainNames.push(domains[i].domainName)
  } 

  try {
    let domains = await db.Domain.findAll({where:{name: {$in: domainNames}}})
    await application.setDomains(domains)
    return findAssociatedDomains(application_id)
  }

  catch(err){
    return  {
      err,
      message: 'Could not link Domains with Applications'
    }
  }
}

/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////

async function findAssociatedDomains(application_id){
  var domain_ids;
  var domains;
  var foundDomains;
  var application; 

  try {
    let foundApplicationDomains = await db.ApplicationDomains.findAll({
      where: {
        application_id: application_id
      }
    })
    domain_ids = createListOfDomainIds(foundApplicationDomains)
    foundDomains = await findDomainsById(domain_ids)
    domains = createPrettyListOfDomains(foundDomains)
    application = await updateApplicationObj(application_id, domains);

    return application
  }

  catch(err){
    return {
      err,
      'message': 'Could not find associated Domains for this Application'
    }
  }
}

function createListOfDomainIds(applicationDomains){
  var domain_ids = []
  for(var element of applicationDomains){
    domain_ids.push(element.dataValues.domain_id)
  }
  return domain_ids
}


async function findDomainsByName(domainInfo){
  var domainNames = [];
  for (var i=0; i < domainInfo.length; i++){
    domainNames.push(domainInfo[i].domainName)
  } 
  try {
    var domains = await db.Domain.findAll({
      where:{
        name: {
          $in: domainNames
        }
      }
    })
    return domains
  }

  catch(err){
    return {
      err,
      'message': 'Could not find Domains with the input Domain names'
    }
  }
}

async function findDomainsById(domain_ids){

  try {
    var domains = await db.Domain.findAll({
      where: {
        domain_id : {
          $in: domain_ids
        }
      }
    });

    return domains
  }
  catch(err){
    return {
      err,
      'message': 'Could not find Domains with the input Domain IDs' 
    }
  }
 } 


function createPrettyListOfDomains(domainObjs){
  var listOfDomains = [];

  for(var domain of domainObjs){
    listOfDomains.push(domain.dataValues)
  }
  return listOfDomains;
}

async function updateApplicationObj(application_id, domains){

  try {
      var foundApplication = await db.Application.findById(application_id);
      foundApplication['associatedDomains'] = domains;

    return foundApplication
  }

  catch (err){
    return {
      err,
      'message': 'Could not update the input Application object with the input Domain objects'
    }
  }

} 


module.exports = { findAssociatedDomains, linkApplicationsToDomains, createApplication, createDomain, getLinkedDomains, findLinkedDomains, loadDomains };

