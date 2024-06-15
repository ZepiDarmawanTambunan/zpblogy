'use strict';

const { Sequelize, DataTypes, Model } = require('sequelize');
const config = require('../config/config');
const Role = require('./Role');

const sequelize = new Sequelize(config.development);

class User extends Model {}

User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 3,
    references: {
      model: 'roles',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  status: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 1,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  }
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  timestamps: false
});

User.belongsTo(Role, { foreignKey: 'role_id' });

module.exports = User;