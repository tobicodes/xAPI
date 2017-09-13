'use strict';
const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  var Application = sequelize.define('Application', {
    application_id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING,
      validate: {
        isAlpha: true
      }
    },
    description: Sequelize.STRING
  });

  Application.associate = function(models){
    Application.belongsTo(models.User, {
      onDelete: "CASCADE",
      foreignKey: 'user_id'
    });
    Application.belongsToMany(models.Domain, {
      onDelete: "CASCADE",
      through: 'ApplicationDomains',
      foreignKey: 'application_id'
    });
  }
  return Application;
};


