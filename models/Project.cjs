'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    static associate(models) {
      // define association here
    }
  }
  Project.init({
    title: DataTypes.STRING,
    category: DataTypes.STRING,
    description: DataTypes.TEXT,
    image: DataTypes.TEXT,
    tags: DataTypes.ARRAY(DataTypes.STRING),
    link: DataTypes.STRING,
    github: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Project',
  });
  return Project;
};
