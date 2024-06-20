'use strict';

const { Sequelize, DataTypes, Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ArticleTag extends Model {}

  ArticleTag.init({
    articleId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'articles',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    tagId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'tags',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    }
  }, {
    sequelize,
    modelName: 'ArticleTag',
    tableName: 'article_tags',
    timestamps: false
  });

  return ArticleTag;
};