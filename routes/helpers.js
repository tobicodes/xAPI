const db = require("../models");

// method to create a new Application Instance
function createApplication(name, description, user_id){
  return db.Application.create({
    name: name,
    description: description,
    user_id: user_id
  })
  .then(application => {
    debugger;
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

function linkApplicationsToDomains(application, domains){
  let domainNames = [];
  console.log("peachpuff", domainNames);

  for (var i=0; i < domains.length; i++){
    domainNames.push(domains[i].domainName)
  } 

  db.Domain.findAll({
    where:{
      name: {
        $in: domainNames
      }
    }
  })
  .then((domains) => {
    application.setDomains(domains).then((ApplicationDomains) => {
    })
  })
  .catch(console.error)

}

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



module.exports = { createApplication, createDomain, getLinkedDomains, linkApplicationsToDomains, findLinkedDomains, loadDomains };

