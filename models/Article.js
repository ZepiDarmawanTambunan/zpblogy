// models/Article.js

const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize(/* konfigurasi koneksi Anda */);

class Article extends Model {}

Article.init({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  title: {
    type: DataTypes.STRING
  },
  content: {
    type: DataTypes.TEXT
  },
  status: {
    type: DataTypes.STRING
  },
  image: {
    type: DataTypes.STRING
  },
  userId: {
    type: DataTypes.INTEGER
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
  timestamps: false // Jika Anda ingin menggunakan field 'createdAt' dan 'updatedAt' yang dihasilkan secara otomatis oleh Sequelize, setel nilai ini menjadi true
});

module.exports = Article;