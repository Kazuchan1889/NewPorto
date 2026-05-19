'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SkillCategory extends Model {
    static associate(models) {
      SkillCategory.hasMany(models.Skill, {
        foreignKey: 'categoryId',
        as: 'skills'
      });
    }
  }
  SkillCategory.init({
    label: DataTypes.STRING,
    colorClass: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'SkillCategory',
  });
  return SkillCategory;
};
