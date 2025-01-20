const Sequelize = require("sequelize");
const db = require("../config/database");

const DataTypes = Sequelize.DataTypes;

const DecreeCategory = db.define(
  "decrees_category",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
  },
  {
    paranoid: true, // Mengaktifkan fitur soft delete
    timestamps: true, // Menambahkan `createdAt` dan `updatedAt`
    deletedAt: "deletedAt", // Nama kolom untuk soft delete (default: deletedAt)
  }
);

module.exports = DecreeCategory;
