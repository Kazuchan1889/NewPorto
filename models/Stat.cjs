'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Stat extends Model {
    static associate(models) {
      // define association here
    }
  }
  Stat.init({
    label: DataTypes.STRING,
    value: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Stat',
  });
  return Stat;
};
