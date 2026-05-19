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
    projectsDescription: DataTypes.TEXT,
    contactHeading: DataTypes.STRING,
    contactDescription: DataTypes.TEXT,
    contactEmail: DataTypes.STRING,
    contactLocation: DataTypes.STRING,
    contactPhone: DataTypes.STRING,
    contactGithub: DataTypes.STRING,
    contactLinkedin: DataTypes.STRING,
    contactTwitter: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Portfolio',
  });
  return Portfolio;
};
