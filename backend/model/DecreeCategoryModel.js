const Sequelize = require("sequelize");
const db = require("../config/database");

const DataTypes = Sequelize.DataTypes;

const DecreeCategory = db.define("decrees_category", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
});

module.exports = DecreeCategory;
