'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Timeline extends Model {
    static associate(models) {}
  }
  Timeline.init({
    year: DataTypes.STRING,
    role: DataTypes.STRING,
    company: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Timeline',
  });
  return Timeline;
};
