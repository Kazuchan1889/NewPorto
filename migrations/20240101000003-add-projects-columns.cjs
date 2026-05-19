'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Portfolios', 'projectsHeading', {
      type: Sequelize.STRING,
      defaultValue: 'Featured Work'
    });
    await queryInterface.addColumn('Portfolios', 'projectsDescription', {
      type: Sequelize.TEXT,
      defaultValue: 'A selection of my recent projects. Some are built for clients, others are personal experiments.'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Portfolios', 'projectsDescription');
    await queryInterface.removeColumn('Portfolios', 'projectsHeading');
  }
};
