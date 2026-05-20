'use strict';

const Sequelize = require('sequelize');
const process = require('process');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.cjs')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Statically require all models for serverless environment compatibility (Vercel)
const Highlight = require('./Highlight.cjs')(sequelize, Sequelize.DataTypes);
const Message = require('./Message.cjs')(sequelize, Sequelize.DataTypes);
const Portfolio = require('./Portfolio.cjs')(sequelize, Sequelize.DataTypes);
const Project = require('./Project.cjs')(sequelize, Sequelize.DataTypes);
const Skill = require('./Skill.cjs')(sequelize, Sequelize.DataTypes);
const SkillCategory = require('./SkillCategory.cjs')(sequelize, Sequelize.DataTypes);
const Stat = require('./Stat.cjs')(sequelize, Sequelize.DataTypes);
const Timeline = require('./Timeline.cjs')(sequelize, Sequelize.DataTypes);

db[Highlight.name] = Highlight;
db[Message.name] = Message;
db[Portfolio.name] = Portfolio;
db[Project.name] = Project;
db[Skill.name] = Skill;
db[SkillCategory.name] = SkillCategory;
db[Stat.name] = Stat;
db[Timeline.name] = Timeline;

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
