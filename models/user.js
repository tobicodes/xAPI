'use strict';
const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    user_id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isAlpha: true,
        notEmpty: true
        }
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
        notEmpty: true
      }
    }
  });
  
  User.associate = function (models) {
    User.hasMany(models.Application, {
      foreignKey: 'user_id'
    });
  };

  return User;
};

// onDelete - cascade?

