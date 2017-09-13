'use strict';
const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  var ApplicationDomains = sequelize.define('ApplicationDomains', {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false
    },
    application_id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4
    },
    domain_id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4
    }
  });
  return ApplicationDomains;
};
