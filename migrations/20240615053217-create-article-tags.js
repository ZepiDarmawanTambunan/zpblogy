'use strict';

module.exports = {
  up: async function(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('article_tags', {
        articleId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'articles', // Name of the table in the database
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        tagId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'tags', // Name of the table in the database
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
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
      await queryInterface.dropTable('article_tags', { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};