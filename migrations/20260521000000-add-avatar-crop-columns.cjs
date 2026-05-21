'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Portfolios', 'avatarScale', { 
      type: Sequelize.FLOAT,
      defaultValue: 1.0,
      allowNull: true
    });
    await queryInterface.addColumn('Portfolios', 'avatarX', { 
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: true
    });
    await queryInterface.addColumn('Portfolios', 'avatarY', { 
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Portfolios', 'avatarScale');
    await queryInterface.removeColumn('Portfolios', 'avatarX');
    await queryInterface.removeColumn('Portfolios', 'avatarY');
  }
};
