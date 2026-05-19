'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Portfolio extends Model {
    static associate(models) {
      // define association here
    }
  }
  Portfolio.init({
    name: DataTypes.STRING,
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    freelance: DataTypes.STRING,
    statusBadge: DataTypes.STRING,
    avatarUrl: DataTypes.TEXT,
    resumeUrl: DataTypes.TEXT,
    aboutHeading: DataTypes.STRING,
    aboutBio1: DataTypes.TEXT,
    aboutBio2: DataTypes.TEXT,
    aboutBio3: DataTypes.TEXT,
    skillsHeading: DataTypes.STRING,
    skillsDescription: DataTypes.TEXT,
    techBadges: DataTypes.ARRAY(DataTypes.STRING),
    projectsHeading: DataTypes.STRING,
    projectsDescription: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Portfolio',
  });
  return Portfolio;
};
