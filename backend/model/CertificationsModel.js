var { Sequelize } = require("sequelize");
var db = require("../config/database");

var Certifications = db.define("certifications", {
  id: {
    type: Sequelize.CHAR(36),
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
  },
  user_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  date: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  file_path: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Certifications;
