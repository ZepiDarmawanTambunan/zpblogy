'use strict';

const { Sequelize, DataTypes, Model } = require('sequelize');
const config = require('../config/config');

const sequelize = new Sequelize(config.development);

class Tag extends Model {}

Tag.init({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  status: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 1
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
  }
}, {
  sequelize,
  modelName: 'Tag',
  tableName: 'tags',
  timestamps: false
});

module.exports = Tag;