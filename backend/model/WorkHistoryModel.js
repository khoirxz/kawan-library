var { Sequelize } = require("sequelize");
var db = require("../config/database");

var { DataTypes } = Sequelize;

var WorkHistoryModel = db.define("workHistory", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  company: {
    type: DataTypes.STRING,
  },
});

module.exports = WorkHistoryModel;
