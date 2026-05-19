'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Portfolios', 'resumeUrl', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Portfolios', 'resumeUrl', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  }
};
