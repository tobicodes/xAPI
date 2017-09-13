'use strict';
const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {

  var Domain = sequelize.define('Domain', {
    domain_id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false
    },
    name: Sequelize.STRING,
    isPublic: Sequelize.BOOLEAN,
    user_id: Sequelize.STRING
  });

  Domain.associate = function(models){
    Domain.belongsToMany(models.Application, {
      onDelete: "CASCADE",
      through: 'ApplicationDomains',
      foreignKey: 'domain_id'
    })
  }
  return Domain;
};




