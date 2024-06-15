'use strict';

module.exports = {
  up: async function (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('articles', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        title: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        content: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        status: {
          type: Sequelize.TINYINT, // Mengubah dari TINYINT ke INTEGER
          allowNull: false,
          defaultValue: 1,
        },
        userId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }
      }, { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
  down: async function (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.dropTable('articles', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};