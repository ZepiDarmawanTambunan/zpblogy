// models/Category.js
'use strict';
const { Sequelize, DataTypes, Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Category extends Model {
      static associate(models) {
        this.belongsToMany(models.Article, {
          through: {
              model: models.CategoryReference,
              unique: false,
              scope: {
                categoryableType: 'article',
              },
          },
          foreignKey: 'categoryId',
          constraints: false,
          as: 'articles',
        });
      }
    }
    

  Category.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 1
    },
  }, {
    sequelize,
    modelName: 'Category',
    tableName: 'categories',
    timestamps: false,
  });

  return Category;
};