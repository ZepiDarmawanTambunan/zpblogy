'use strict';

const { Sequelize, DataTypes, Model } = require('sequelize');
const config = require('../config/config');

const sequelize = new Sequelize(config.development);

class Role extends Model {}

Role.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
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
  },
}, {
  sequelize,
  modelName: 'Role',
  tableName: 'roles',
  timestamps: false // Jika Anda ingin menggunakan field 'createdAt' dan 'updatedAt' yang dihasilkan secara otomatis oleh Sequelize, setel nilai ini menjadi true
});

module.exports = Role;