'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Portfolios', 'skillsHeading', {
      type: Sequelize.STRING,
      defaultValue: 'My Technical Arsenal'
    });
    await queryInterface.addColumn('Portfolios', 'skillsDescription', {
      type: Sequelize.TEXT,
      defaultValue: 'A blend of frontend finesse and backend power — constantly expanding with modern tools and best practices.'
    });
    await queryInterface.addColumn('Portfolios', 'techBadges', {
      type: Sequelize.ARRAY(Sequelize.STRING),
      defaultValue: ['React', 'Next.js', 'Vue', 'TypeScript', 'JavaScript', 'Node.js']
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Portfolios', 'techBadges');
    await queryInterface.removeColumn('Portfolios', 'skillsDescription');
    await queryInterface.removeColumn('Portfolios', 'skillsHeading');
  }
};
