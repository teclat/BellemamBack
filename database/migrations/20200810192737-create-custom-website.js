'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('custom_websites', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      field: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      image_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      obs: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      text: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('custom_websites');
  }
};
