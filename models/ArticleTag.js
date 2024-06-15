'use strict';

const { Sequelize, DataTypes, Model } = require('sequelize');
const config = require('../config/config');

const sequelize = new Sequelize(config.development);

class ArticleTag extends Model {}

ArticleTag.init({
  articleId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'articles', // Name of the table in the database
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  tagId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'tags', // Name of the table in the database
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  }
}, {
  sequelize,
  modelName: 'ArticleTag',
  tableName: 'article_tags', // The name of the table in the database
  timestamps: false
});

module.exports = ArticleTag;