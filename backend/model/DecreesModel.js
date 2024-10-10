var { Sequelize } = require("sequelize");
var db = require("../config/database");

var Decrees = db.define("decrees", {
  id: {
    type: Sequelize.CHAR(36),
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
  },
  user_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  category: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  status: {
    type: Sequelize.ENUM("draft", "approved", "canceled"),
    allowNull: false,
  },
  effective_date: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  expired_date: {
    type: Sequelize.DATE,
    allowNull: true,
  },
  file_path: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

module.exports = Decrees;
