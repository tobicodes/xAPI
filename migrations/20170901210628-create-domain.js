'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Domains', {
      domain_id: {
         type: Sequelize.INTEGER,
         primaryKey: true,
         defaultValue: 0,
         allowNull: false,
         autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      isPublic: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      user_id: Sequelize.STRING,
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Domains');
  }
};
