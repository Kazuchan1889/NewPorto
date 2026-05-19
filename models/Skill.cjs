'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Skill extends Model {
    static associate(models) {
      Skill.belongsTo(models.SkillCategory, {
        foreignKey: 'categoryId',
        as: 'category'
      });
    }
  }
  Skill.init({
    name: DataTypes.STRING,
    level: DataTypes.INTEGER,
    categoryId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Skill',
  });
  return Skill;
};
