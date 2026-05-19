'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {
      // define association here
    }
  }
  Message.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    subject: DataTypes.STRING,
    message: DataTypes.TEXT,
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Message',
  });
  return Message;
};
