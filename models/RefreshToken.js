// models/RefreshToken.js
import { Sequelize, DataTypes, Model } from 'sequelize';
import config from '../config/config.js';
import User from './User.js';

const sequelize = new Sequelize(config.development); // Menggunakan konfigurasi development, bisa disesuaikan dengan lingkungan yang tepat

class RefreshToken extends Model {}

RefreshToken.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  token: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
}, {
  sequelize,
  modelName: 'RefreshToken',
  tableName: 'refresh_tokens',
  timestamps: false // Jika Anda ingin menggunakan field 'createdAt' dan 'updatedAt' yang dihasilkan secara otomatis oleh Sequelize, setel nilai ini menjadi true
});

// Definisikan relasi antara RefreshToken dan User
RefreshToken.belongsTo(User, { foreignKey: 'user_id' });

export default RefreshToken;