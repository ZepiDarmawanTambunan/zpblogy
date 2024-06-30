'use strict';

const { Sequelize, DataTypes, Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
        this.belongsTo(models.User, { foreignKey: 'userId' });
        this.belongsTo(models.Article, {
            foreignKey: 'commentableId',
            constraints: false,
            scope: {
            imageableType: 'article'
            }
        });
        this.hasMany(models.Rating, {
            foreignKey: 'ratingableId',
            constraints: false,
            scope: {
              ratingableType: 'comment'
            }
        });
        this.hasMany(models.Comment, {
          foreignKey: 'parentId',
          as: 'replies' // Opsional: Jika ingin memberi nama hubungan
        });
    }
  };
  
  Comment.init({
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
    rate: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    clientId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    commentableId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    commentableType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'comments',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    status: {
      type: DataTypes.INTEGER,
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
    modelName: 'Comment',
    tableName: 'comments',
    timestamps: false
  });
  return Comment;
};