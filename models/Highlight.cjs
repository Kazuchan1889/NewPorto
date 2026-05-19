'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Highlight extends Model {
    static associate(models) {}
  }
  Highlight.init({
    title: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Highlight',
  });
  return Highlight;
};
