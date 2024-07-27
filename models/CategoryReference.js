// models/CategoryReference.js
'use strict';
const { Sequelize, DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class CategoryReference extends Model {
    static associate(models) {
      this.belongsTo(models.Category, { foreignKey: 'categoryId' });
    }
  }

  CategoryReference.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    categoryableId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    categoryableType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'CategoryReference',
    tableName: 'category_references',
    timestamps: false,
  });

  return CategoryReference;
};