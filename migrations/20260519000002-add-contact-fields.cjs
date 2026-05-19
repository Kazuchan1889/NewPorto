'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Portfolios', 'contactHeading', { type: Sequelize.STRING });
    await queryInterface.addColumn('Portfolios', 'contactDescription', { type: Sequelize.TEXT });
    await queryInterface.addColumn('Portfolios', 'contactEmail', { type: Sequelize.STRING });
    await queryInterface.addColumn('Portfolios', 'contactLocation', { type: Sequelize.STRING });
    await queryInterface.addColumn('Portfolios', 'contactPhone', { type: Sequelize.STRING });
    await queryInterface.addColumn('Portfolios', 'contactGithub', { type: Sequelize.STRING });
    await queryInterface.addColumn('Portfolios', 'contactLinkedin', { type: Sequelize.STRING });
    await queryInterface.addColumn('Portfolios', 'contactTwitter', { type: Sequelize.STRING });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Portfolios', 'contactHeading');
    await queryInterface.removeColumn('Portfolios', 'contactDescription');
    await queryInterface.removeColumn('Portfolios', 'contactEmail');
    await queryInterface.removeColumn('Portfolios', 'contactLocation');
    await queryInterface.removeColumn('Portfolios', 'contactPhone');
    await queryInterface.removeColumn('Portfolios', 'contactGithub');
    await queryInterface.removeColumn('Portfolios', 'contactLinkedin');
    await queryInterface.removeColumn('Portfolios', 'contactTwitter');
  }
};
