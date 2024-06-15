'use strict';

module.exports = {
  up: async function(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('tags', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        name: {
          allowNull: false,
          unique: true,
          type: Sequelize.STRING
        },        
        status: {
          type: Sequelize.TINYINT,
          allowNull: false,
          defaultValue: 1,
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
  down: async function(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.dropTable('tags', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};