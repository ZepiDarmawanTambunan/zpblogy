'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Masukkan data ke tabel roles
    await queryInterface.bulkInsert('roles', [
      { name: 'master', status: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'admin', status: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'user', status: 1, createdAt: new Date(), updatedAt: new Date() }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    // Hapus semua data dari tabel roles
    await queryInterface.bulkDelete('roles', null, {});
  }
};