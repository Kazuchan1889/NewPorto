'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Portfolios', 'avatarUrl', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.changeColumn('Projects', 'image', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Portfolios', 'avatarUrl', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.changeColumn('Projects', 'image', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  }
};
