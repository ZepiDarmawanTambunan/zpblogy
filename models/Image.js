// models/Image.js
import { Sequelize, DataTypes, Model } from 'sequelize';
import config from '../config/config.js';
import Article from './Article.js';

const sequelize = new Sequelize(config.development); // Menggunakan konfigurasi development, bisa disesuaikan dengan lingkungan yang tepat

class Image extends Model {}

Image.init({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  url: {
    type: DataTypes.STRING
  },
  articleId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Article',
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
  modelName: 'Image',
  tableName: 'images',
  timestamps: false // Jika Anda ingin menggunakan field 'createdAt' dan 'updatedAt' yang dihasilkan secara otomatis oleh Sequelize, setel nilai ini menjadi true
});

// Definisikan relasi antara Image dan Article
Image.belongsTo(Article, { foreignKey: 'articleId' });

export default Image;