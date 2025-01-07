const Sequelize = require("sequelize");
const db = require("../config/database");

const DataTypes = Sequelize.DataTypes;

const Office = db.define("offices", {
  id: {
    type: DataTypes.CHAR(4),
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Office;
