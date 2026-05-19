'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add columns to Portfolios
    await queryInterface.addColumn('Portfolios', 'aboutHeading', {
      type: Sequelize.STRING,
      defaultValue: 'Passionate about building digital experiences.'
    });
    await queryInterface.addColumn('Portfolios', 'aboutBio1', {
      type: Sequelize.TEXT
    });
    await queryInterface.addColumn('Portfolios', 'aboutBio2', {
      type: Sequelize.TEXT
    });
    await queryInterface.addColumn('Portfolios', 'aboutBio3', {
      type: Sequelize.TEXT
    });

    // Create Highlights Table
    await queryInterface.createTable('Highlights', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Create Timelines Table
    await queryInterface.createTable('Timelines', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      year: {
        type: Sequelize.STRING
      },
      role: {
        type: Sequelize.STRING
      },
      company: {
        type: Sequelize.STRING
      },
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

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Timelines');
    await queryInterface.dropTable('Highlights');
    await queryInterface.removeColumn('Portfolios', 'aboutBio3');
    await queryInterface.removeColumn('Portfolios', 'aboutBio2');
    await queryInterface.removeColumn('Portfolios', 'aboutBio1');
    await queryInterface.removeColumn('Portfolios', 'aboutHeading');
  }
};
