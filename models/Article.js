'use strict';

const { Sequelize, DataTypes, Model } = require('sequelize');
const config = require('../config/config');
const ArticleTag = require('./ArticleTag');
const Tag = require('./Tag');

const sequelize = new Sequelize(config.development);

class Article extends Model {}

Article.init({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 1
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users', // Name of the table in the database
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
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
  modelName: 'Article',
  tableName: 'articles',
  timestamps: false
});

Article.belongsToMany(Tag, { through: ArticleTag, foreignKey: 'articleId' });
Tag.belongsToMany(Article, { through: ArticleTag, foreignKey: 'tagId' });

module.exports = Article;