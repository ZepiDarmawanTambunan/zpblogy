'use strict';

const { Sequelize, DataTypes, Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Rating extends Model {
    static associate(models) {
        this.belongsTo(models.User, { foreignKey: 'userId' });
        this.belongsTo(models.Article, {
            foreignKey: 'ratingableId',
            constraints: false,
            scope: {
            imageableType: 'article'
            }
        });
        this.belongsTo(models.Article, {
          foreignKey: 'ratingableId',
          constraints: false,
          scope: {
          imageableType: 'comment'
          }
        });
    }
  };
  
  Rating.init({
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
    ratingableId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ratingableType: {
      type: DataTypes.STRING,
      allowNull: false
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
    modelName: 'Rating',
    tableName: 'ratings',
    timestamps: false
  });
  return Rating;
};